/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */


$(document).ready(function(){
    // Sets up click behavior on all button elements with the alert class
    // that exist in the DOM when the instruction was executed
	$.dynatableSetup({
		features: {
		  paginate: true,
		  sort: true,
		  pushState: true,
		  search: false,
		  recordCount: true,
		  perPageSelect: false
		},
		params: {
			records: "_root"
		}
	});
	
    $("#loc_type_input").on( "change", function(event) {updateLocationList(event)});
	
    $("#query-submit").on( "click", function(event) {
		event.preventDefault();
		event.stopPropagation();
		updateTable();
    });
	
	/* Kick off the fancy selects */
	$('.selectpicker').selectpicker();
	
	initSelectMap();
});

var dynamicTable = null;

function updateTable() {
	var url = buildDataUrl();
	console.log( "Submitting the AJAX Request as: " + url);
	
	$("table.hidden").show();
	
	$.ajax({
		dataType: "json",
		url: url,
		success: tableDataReady
	});

	
}

var tableDataReady = function(data) {
	
	var records = data.items;
	
	for (i=0; i<data.items.length; i++) {
		var item = data.items[i];
		var link = item['link']['url'];
		item['url'] = link;
		
		var resource = item['browseCategories'][0];
		item['resource'] = resource;
		
		var contacts = item['contacts'];
		for (j=0; j<contacts.length; j++) {
			var contact = contacts[j];
			var type = contact['contactType'];
			
			if (type == null) type = contact['type'];
			
			if ("Point of Contact" == type) {
				item['contact'] = contact['name'] + " (Point of Contact)";
				break;
			} else if ("Author" == type) {
				item['contact'] = contact['name'] + " (Author)";
				break;
			} else if ("Project Chief" == type) {
				item['contact'] = contact['name'] + " (Project Chief)";
				break;
			} else {
				item['contact'] = "???"
			}
			
		}
	}
	
	if (dynamicTable == null) {
		$("#query-results-table").dynatable({
			dataset: {
				records: records
			},
			writers: {
				_cellWriter: writeCell
			}
		});
		
		dynamicTable = $("#query-results-table").data('dynatable');
	} else {
		dynamicTable.processingIndicator.show();
		dynamicTable.records.updateFromJson(records);
		dynamicTable.dom.update();
		dynamicTable.processingIndicator.hide();

	}
	
};

function writeCell(column, record) {
    var html = glriAttributeWriter(column, record);
    var td = '<td';

    if (column.hidden || column.textAlign) {
      td += ' style="';

      // keep cells for hidden column headers hidden
      if (column.hidden) {
        td += 'display: none;';
      }

      // keep cells aligned as their column headers are aligned
      if (column.textAlign) {
        td += 'text-align: ' + column.textAlign + ';';
      }

      td += '"';
    }
	
    html = td + '>' + html + '</td>';
	
	return html;
 };
 
 function glriAttributeWriter(column, record) {

	var text;
	var id = column['id'];
	
	if (id == "url") {
		text = "<a href=\"" + record[id] + "\" target=\"_blank\">link</a>";
	} else {
		text = record[id];
	}
    return text;
 };

function buildDataUrl() {
	var url = $("#sb-query-form").attr("action");
	url += "?" + $("#sb-query-form").serialize();
	return url;
}

function updateLocationList(event) {
	
	//location type just selected by the user
	var typeSelection = event.currentTarget.options[event.currentTarget.selectedIndex].value;
	
	$("#loc_name_input optgroup").each(function() {
		if (this.label.indexOf(typeSelection + "s") == 0) {
			$(this).removeAttr("disabled");
		} else {
			$(this).attr("disabled", "disabled");
		}
	});
	
	//No location selection made prior to this is valid, so clear out.
	$("#loc_name_input").val("");
}


///////////
// Map Functions
///////////
function initSelectMap() {
	
	var lon = -85.47;
	var lat = 45.35;
	var zoom = 5.25;
	var map, wmsLayer, boxLayer;
	
	map = new OpenLayers.Map('map');

	wmsLayer = new OpenLayers.Layer.WMS( "OpenLayers WMS",
		"http://vmap0.tiles.osgeo.org/wms/vmap0?", {layers: 'basic'});

	boxLayer = new OpenLayers.Layer.Vector("Box layer");

	map.addLayers([wmsLayer, boxLayer]);
	map.addControl(new OpenLayers.Control.LayerSwitcher());
	map.addControl(new OpenLayers.Control.MousePosition());

	boxControl = new OpenLayers.Control.DrawFeature(boxLayer,
			OpenLayers.Handler.RegularPolygon, {
				handlerOptions: {
					sides: 4,
					irregular: true
				}
			}
		);

	// register a listener for removing any boxes already drawn
	boxControl.handler.callbacks.create = function(data) {
		if(boxLayer.features.length > 0) {
			boxLayer.removeAllFeatures();
		}
	};
	
	// register a listener for drawing a box
	boxControl.events.register('featureadded', boxControl,
			function(f) {

		// Variables for the geometry are: bottom/left/right/top
		// Sciencebase requires bounds to look like: [xmin,ymin,xmax,ymax]
		var extent = "["
				+ f.feature.geometry.bounds.left + ","
				+ f.feature.geometry.bounds.bottom
				+ "," + f.feature.geometry.bounds.right
				+ "," + f.feature.geometry.bounds.top
				+ "]";

		$('#xmin_label').val(f.feature.geometry.bounds.left);
		$('#ymin_label').val(f.feature.geometry.bounds.bottom);
		$('#xmax_label').val(f.feature.geometry.bounds.right);
		$('#ymax_label').val(f.feature.geometry.bounds.top);

		$('#spatial').val(extent);
	});


	map.addControl(boxControl);
	map.setCenter(new OpenLayers.LonLat(lon, lat), 5);
	
	$('#drawBox').click(function() {
		if($(this).is(':checked')) {
			boxControl.handler.stopDown = true;
			boxControl.handler.stopUp = true;
			boxControl.activate();
		} else {
			boxControl.handler.stopDown = false;
			boxControl.handler.stopUp = false;
			boxControl.deactivate();
		}
	});
	
	$('#clearMapButton').click(function() {
		$('#spatial').val('');
		$('#xmin_label').val('-');
		$('#ymin_label').val('-');
		$('#xmax_label').val('-');
		$('#ymax_label').val('-');

		boxLayer.removeAllFeatures();
		map.setCenter(new OpenLayers.LonLat(lon, lat), 5);				
	});
	
}

