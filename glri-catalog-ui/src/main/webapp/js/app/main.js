'use strict';

/* Controllers */
var GLRICatalogApp = angular.module('GLRICatalogApp', []);

GLRICatalogApp.controller('CatalogCtrl', function($scope, $http, $filter, $timeout) {

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
	$scope.pageRecordsPerPageOptions = [10, 20, 50];
	$scope.pageCurrent = 0;
	$scope.pageCurrentFirstRecordIndex = 0; //Use to display 'showing records 10 - 20'
	$scope.pageCurrentLastRecordIndex = 0;	//Use to display 'showing records 10 - 20'
	$scope.pageSize = $scope.pageRecordsPerPageOptions[1];
	$scope.pageCount;
	$scope.pageList = [];	//array of numbers, 0 to pageCount - 1.  Used by ng-repeat
	$scope.pageRecords = [];
	$scope.pageHasNext = false;
	$scope.pageHasPrevious = false;
	
	
	//Not used on UI
	$scope.hasPreviousPage = function() {
		return $scope.pageCurrent > 0;
	};
	
	//Not used on UI
	$scope.hasNextPage = function() {
		return ($scope.pageCurrent + 1) < $scope.pageCount;
	};

	$scope.doRemoteLoad = function(event) {

		event.preventDefault();
		event.stopPropagation();
		$http.get(buildDataUrl()).success(function(data) {
			$scope.processRawScienceBaseResponse(data);
			$scope.processRecords();
		});
	};
	
	/**
	 * Read response metadata and add extra properties to the records.
	 * Results are saved as resultItems.
	 * 
	 * @param {type} unfilteredJsonData from ScienceBase
	 */
	$scope.processRawScienceBaseResponse = function(unfilteredJsonData) {
		$scope.rawResult = unfilteredJsonData;

		//Add some aggregation and calc'ed values
		$scope.resultItems = $scope.processGlriResults(unfilteredJsonData.items);

		$scope.updateFacetCount($scope.rawResult.searchFacets[0].entries);
	};
	
	/**
	 * Process records w/o stepping on any in-process UI updates.
	 * @returns {undefined}
	 */
	$scope.processRecords = function() {
		$timeout($scope._processRecords, 1, true);
	};
	
	/**
	 * Starting from resultItems:  Sort, fiter, reset current page and update paged records.
	 */
	$scope._processRecords = function() {
		$scope.resultItems = $filter('orderBy')($scope.resultItems, $scope.orderProp);
		$scope.filteredRecords = $scope.getFilteredResults();
		$scope.pageCurrent = 0;
		$scope.updatePageRecords();
	};
	
	$scope.gotoNextPage = function() {
		if ($scope.pageHasNext) {
			$scope.pageCurrent++;
			$scope.updatePageRecords();
		}
	};
	
	$scope.gotoPreviousPage = function() {
		if ($scope.pageHasPrevious) {
			$scope.pageCurrent--;
			$scope.updatePageRecords();
		}
	};
	
	$scope.gotoPage = function(pageNumber) {
		if (pageNumber > -1 && pageNumber < $scope.pageCount) {
			$scope.pageCurrent = pageNumber;
			$scope.updatePageRecords();
		}
	};
	
	$scope.setPageSize = function(size) {
		$scope.pageSize = size;
		$scope.updatePageRecords();
	};
	
	$scope.calcPageCount = function() {
		if ($scope.filteredRecords) {
			return Math.ceil($scope.filteredRecords.length/$scope.pageSize);
		} else {
			return 0;
		}
    };
	
	$scope.updatePageRecords = function() {
		$timeout($scope._updatePageRecords, 1, true);
	};
	
	/**
	 * Update the paged records
	 */
	$scope._updatePageRecords = function() {
		var startRecordIdx = $scope.pageCurrent * $scope.pageSize;
		var endRecordIdx = startRecordIdx + $scope.pageSize;
		
		if (endRecordIdx > $scope.filteredRecords.length) endRecordIdx = $scope.filteredRecords.length;
		
		var newPgRecs = new Array();
		var destIdx = 0;
		for (var srcIdx = startRecordIdx; srcIdx < endRecordIdx; srcIdx++) {
			newPgRecs[destIdx] = $scope.filteredRecords[srcIdx];
			destIdx++;
		}
		
		
		$scope.pageRecords = newPgRecs;
		$scope.pageCount = $scope.calcPageCount();
		$scope.pageHasNext = ($scope.pageCurrent + 1) < $scope.pageCount;
		$scope.pageHasPrevious = $scope.pageCurrent > 0;
		$scope.pageCurrentFirstRecordIndex = $scope.pageCurrent * $scope.pageSize;
		
		if (($scope.pageCurrent + 1) < $scope.pageCount) {
			//any page but the last page
			$scope.pageCurrentLastRecordIndex = $scope.pageCurrentFirstRecordIndex + $scope.pageSize - 1;
		} else {
			//last page 
			$scope.pageCurrentLastRecordIndex = $scope.filteredRecords.length - 1;
		}
		
		if ($scope.pageList.length != $scope.pageCount) {
			var newPageList = new Array();
			for (var i = 0; i < $scope.pageCount; i++) {
				newPageList[i] = i;
			}
			$scope.pageList = newPageList;
		}
		
	};

	$scope.filterChange = function(newFilterValue) {
		$scope.resourceFilter = newFilterValue;
		$scope.processRecords();
	};
	
	$scope.sortChange = function() {
		$scope.processRecords();
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