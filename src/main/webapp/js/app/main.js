/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */


$(document).ready(function(){
    // Sets up click behavior on all button elements with the alert class
    // that exist in the DOM when the instruction was executed
	$.dynatableSetup({
		features: {
		  paginate: false,
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
    $("#query-submit").on( "click", function(event) {
		event.preventDefault();
		event.stopPropagation();
		updateTable();
    });
	
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
	}
	
	if (dynamicTable == null) {
		$("#query-results-table").dynatable({
			dataset: {
				records: records
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

function buildDataUrl() {
	var url = $("#sb-query-form").attr("action");
	url += "?" + $("#sb-query-form").serialize();
	return url;
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
	boxControl.events.register('featureadded', boxControl, function(f) {

	  // Variables for the geometry are: bottom/left/right/top
	  // Sciencebase requires bounds to look like: [xmin,ymin,xmax,ymax]
	  var extent = "[" + f.feature.geometry.bounds.left +
				   "," + f.feature.geometry.bounds.bottom +
				   "," + f.feature.geometry.bounds.right +
				   "," + f.feature.geometry.bounds.top + "]";

	  $('#spatial_input').val(extent);
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
	
}

