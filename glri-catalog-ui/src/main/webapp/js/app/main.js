'use strict';

/* Controllers */
var GLRICatalogApp = angular.module('GLRICatalogApp', []);

GLRICatalogApp.controller('CatalogCtrl', function($scope, $http) {

	$scope.FACET_DEFS = [
		{name: "Any", initState: "active", isAny: true},
		{name: "Data", initState: ""},
		{name: "Publication", initState: ""},
		{name: "Project", initState: ""}
	];
	
	$scope.SORT_OPTIONS = [
		{key: "title", display: "Title"},
		{key: "contactText", display: "Author / PI / Creator"}
	];
	$scope.RESOURCE_TYPE_ANY = "Any";

	$scope.orderProp = 'title';
	$scope.resourceFilter = 'Any';	//user selected resource type to filter by
	$scope.locationType = '';
	
	$scope.currentFacets = {};	//counts of the facets
	
	$scope.rawResult = null;	//array of all the returned items, UNprocessed
	$scope.resultItems = null;	//array of all the returned items, processed to include display properties
	$scope.filteredRecords = null;		//Current records, filtered based on facets.

	//Pagination
	$scope.currentPage = 0;
	$scope.pageSize = 5;
	$scope.pagedRecords = [];
	
	
	$scope.numberOfPages = function() {
		if ($scope.filteredRecords) {
			return Math.ceil($scope.filteredRecords.length/$scope.pageSize);
		} else {
			return 0;
		}
    }
	$scope.hasPreviousPage = function() {
		return $scope.currentPage > 0;
	}
	$scope.hasNextPage = function() {
		return ($scope.currentPage + 1) < $scope.numberOfPages();
	}

	$scope.doLoad = function(event) {

		event.preventDefault();
		event.stopPropagation();
		$http.get(buildDataUrl()).success(function(data) {
			$scope.updateRawResults(data);
			$scope.doLocalLoad($scope.getFilteredResults());
		});
		$scope.$apply();
	};

	$scope.doLocalLoad = function(recordsArray) {
		$scope.filteredRecords = recordsArray;
		$scope.currentPage = 0;
		$scope.updatePagedRecords();
	};
	
	$scope.gotoNextPage = function() {
		if ($scope.hasNextPage()) {
			$scope.currentPage++;
			$scope.updatePagedRecords();
			$scope.$apply();
		}
	}
	
	$scope.gotoPreviousPage = function() {
		if ($scope.currentPage > 0) {
			$scope.currentPage--;
			$scope.updatePagedRecords();
			$scope.$apply();
		}
	}
	
	$scope.updatePagedRecords = function() {
		var startRecordIdx = $scope.currentPage * $scope.pageSize;
		var endRecordIdx = startRecordIdx + $scope.pageSize;
		
		if (endRecordIdx > $scope.filteredRecords.length) endRecordIdx = $scope.filteredRecords.length;
		
		$scope.pagedRecords = new Array();
		var destIdx = 0;
		for (var srcIdx = startRecordIdx; srcIdx < endRecordIdx; srcIdx++) {
			$scope.pagedRecords[destIdx] = $scope.filteredRecords[srcIdx];
			destIdx++;
		}
		
	}

	$scope.filterChange = function(newFilterValue) {
		$scope.resourceFilter = newFilterValue;
		$scope.doLocalLoad($scope.getFilteredResults());
	};
	
	$scope.sortChange = function() {
		//Sadly, the selectpicker and the angularjs lib don't work well together
		//so we need this manual sync here.
		$('.sort-options .selectpicker').selectpicker('val', $scope.orderProp);
		$('.sort-options .selectpicker').selectpicker('refresh');
	}

	$scope.updateRawResults = function(unfilteredJsonData) {
		$scope.rawResult = unfilteredJsonData;

		//Add some aggregation and calc'ed values
		$scope.resultItems = $scope.processGlriResults(unfilteredJsonData.items);

		$scope.updateFacetCount($scope.rawResult.searchFacets[0].entries);
	};

	$scope.updateFacetCount = function(facetJsonObject) {

		//reset all facets to zero
		for (var i in $scope.FACET_DEFS) {
			var facet = $scope.FACET_DEFS[i];

			if (!(facet.isAny == true)) {
				$scope.currentFacets[term] = count;
				$('#resource_input .btn input[value=' + facet.name + '] + span').html("0");
			}
		}

		for (var i in facetJsonObject) {
			var term = facetJsonObject[i].term;
			var count = facetJsonObject[i].count;

			$scope.currentFacets[term] = count;
			$('#resource_input .btn input[value=' + term + '] + span').html(count);
		}
		;
	};

	$scope.getFilteredResults = function() {
		if ($scope.resourceFilter != null && $scope.resultItems != null) {

			if ($scope.resourceFilter == $scope.RESOURCE_TYPE_ANY) {
				return $scope.resultItems;
			} else {
				var data = new Array();

				for (var i in $scope.resultItems) {
					var item = $scope.resultItems[i];
					if (item.browseCategories[0] == $scope.resourceFilter) {
						data.push(item);
					}
				}

				return data;
			}
		} else {
			return $scope.resultItems;
		}
	};

	$scope.processGlriResults = function(resultRecordsArray) {
		var records = resultRecordsArray;
		var newRecords = [];

		for (var i = 0; i < records.length; i++) {
			var item = records[i];
			var link = item['link']['url'];
			item['url'] = link;

			var resource = item['browseCategories'][0];
			if (resource != null) {
				resource = resource.toLowerCase();
			} else {
				resource = "unknown";
			}
			item['resource'] = resource;

			switch (resource) {
				case "project":
					item['project_url'] = "http://google.com";
					break;
				case "publication":
					item['publication_url'] = "http://google.com";
					break;
				case "data":
					item['data_download_url'] = "http://google.com";
					break;
				default:


			}

			//build contactText
			var contacts = item['contacts'];
			var contactText = "";	//combined contact text
			
			for (var j = 0; j < contacts.length; j++) {
				
				if (j < 3) {
					var contact = contacts[j];
					var name = contact['name'];
					var type = contact['type'];

					if (type == null) type = "??";
					if (type == 'Principle Investigator') type = "PI";

					contactText+= name + " (" + type + "), ";
				} else if (j == 3) {
					contactText+= "and others.  "
				} else {
					break;
				}
			}
			
			if (contactText.length > 0) {
				contactText = contactText.substr(0, contactText.length - 2);	//rm trailing ', '
			} else {
				contactText = "[No contact information listed]";
			}
			
			item['contactText'] = contactText;

			newRecords.push(item);
		}

		return newRecords;
	};

	$scope.hasVisibleResults = function() {
		var results = $scope.getFilteredResults();
		return (results != null && results.length > 0);
	};

	$scope.getVisibleResultCount = function() {
		var results = $scope.getFilteredResults();
		if (results != null && results.length > 0) {
			return results.length;
		} else {
			return 0;
		}
	};

	$scope.updateLocationList = function() {

		//location type just selected by the user
		var typeSelection = $scope.locationType;

		$("#loc_name_input optgroup").each(function() {
			if (typeSelection == '' || this.label.indexOf(typeSelection + "s") == 0) {
				$(this).removeAttr("disabled");
			} else {
				$(this).attr("disabled", "disabled");
			}
		});

		//No location selection made prior to this is valid, so clear out.
		$("#loc_name_input").val("");
		$("#loc_name_input").selectpicker('refresh')
	};


});


$(document).ready(function() {

	/* Kick off the fancy selects */
	$('.selectpicker').selectpicker();

	initSelectMap();
});


function buildDataUrl() {
	var url = $("#sb-query-form").attr("action");
	url += "?" + $("#sb-query-form :input[name!='resource']").serialize();
	return url;
}


///////////
// Map Functions
///////////
function initSelectMap() {

	var lon = -85.47;
	var lat = 45.35;
	var zoom = 5.25;
	var map, worldStreet, worldGray, openlayersBase, boxLayer;

	map = new OpenLayers.Map('map');

	worldStreet = new OpenLayers.Layer.ArcGIS93Rest("World Street Map",
			"http://services.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/export",
			{layers: "show:0"});
	worldGray = new OpenLayers.Layer.ArcGIS93Rest("World Light Gray Base",
			"http://services.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/export",
			{layers: "show:0"});
	openlayersBase = new OpenLayers.Layer.WMS("OpenLayers Base",
			"http://vmap0.tiles.osgeo.org/wms/vmap0?", {layers: 'basic'});

	boxLayer = new OpenLayers.Layer.Vector("Box layer");

	map.addLayers([worldStreet, worldGray, openlayersBase, boxLayer]);
	map.addControl(new OpenLayers.Control.LayerSwitcher());
	map.addControl(new OpenLayers.Control.MousePosition());

	var boxControl = new OpenLayers.Control.DrawFeature(boxLayer,
			OpenLayers.Handler.RegularPolygon, {
		handlerOptions: {
			sides: 4,
			irregular: true
		}
	}
	);

	// register a listener for removing any boxes already drawn
	boxControl.handler.callbacks.create = function(data) {
		if (boxLayer.features.length > 0) {
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
		if ($(this).is(':checked')) {
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