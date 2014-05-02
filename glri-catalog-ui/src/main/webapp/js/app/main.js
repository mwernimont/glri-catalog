'use strict';

/* Controllers */
var GLRICatalogApp = angular.module('GLRICatalogApp', ['ui.bootstrap']);

GLRICatalogApp.controller('CatalogCtrl', function($scope, $http, $filter, $timeout) {

	$scope.ANY_VALUE = "Any";
	
	$scope.FACET_DEFS = {
		1: $scope.ANY_VALUE,
		2: "Data",
		3: "Publication",
		4: "Project"
	};
	
	$scope.SORT_OPTIONS = [
		{key: "title", display: "Title"},
		{key: "contactText", display: "Author / PI / Creator"}
	];
	$scope.orderProp = 'title';
	
	
	$scope.isUIFresh = true;	//True until the user does the first search.   Used to display welcome message.

	$scope.model = new Object();
	$scope.model.text_query = '';
	$scope.model.location = '';
	$scope.model.focus = '';
	$scope.model.spatial = '';
	$scope.model.resourceFilter = "1";
	
	//These are the Google Analytics custom metrics for each search param.
	//To log search usage, each search should register that a search was done
	//and what type of search it was (actual search values are not tracked).
	//location is split into either loc_type or name based on the value.
	$scope.modelAnalytics = {
		search: 1,
		text_query: 2,
		loc_type: 3,
		loc_name: 4,
		focus: 5,
		spatial: 6
	};
	
	
	$scope.currentFacets = {};	//counts of the facets
	
	$scope.rawResult = null;	//array of all the returned items, UNprocessed
	$scope.resultItems = null;	//array of all the returned items, processed to include display properties
	$scope.filteredRecords = null;		//Current records, filtered based on facets.
	
	$scope.drawingBounds = false;	//true if dragging map should draw a box

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

	$scope.doRemoteLoad = function(event) {

		event.preventDefault();
		event.stopPropagation();
		$http.get($scope.buildDataUrl()).success(function(data) {
			$scope.processRawScienceBaseResponse(data);
			$scope.isUIFresh = false;
			$scope.processRecords();
		}).error(function(data, status, headers, config) {
			alert("Unable to connect to ScienceBase.gov to find records.");
		});
	};
	
	$scope.clearForm = function(event) {
		
		$scope.OpenLayersMap.boxLayer.removeAllFeatures();
		$scope.OpenLayersMap.map.setCenter(new OpenLayers.LonLat($scope.OpenLayersMap.orgLon, $scope.OpenLayersMap.orgLat), $scope.OpenLayersMap.orgZoom);
		
		$scope.model.text_query = '';
		$scope.model.location = '';
		$scope.model.focus = '';
		$scope.model.spatial = '';
		$scope.model.resourceFilter = "1";
		
		$scope.processRawScienceBaseResponse(null);
		$scope.processRecords();
		
		$scope.isUIFresh = true;
	};
	
	/**
	 * Read response metadata and add extra properties to the records.
	 * Results are saved as resultItems.
	 * 
	 * @param {type} unfilteredJsonData from ScienceBase
	 */
	$scope.processRawScienceBaseResponse = function(unfilteredJsonData) {
		$scope.rawResult = unfilteredJsonData;
		
		if (unfilteredJsonData) {
			$scope.resultItems = $scope.processGlriResults(unfilteredJsonData.items);
			$scope.updateFacetCount($scope.rawResult.searchFacets[0].entries);
		} else {
			$scope.resultItems = $scope.processGlriResults(null);
			$scope.updateFacetCount(null);
		}
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

	$scope.$watch('model.resourceFilter', function(newValue, oldValue) {
		if (newValue != oldValue) {
			$scope.processRecords();
		}
	});
	
	$scope.$watch("drawingBounds", function() {
		if ($scope.drawingBounds) {
			$scope.OpenLayersMap.boxControl.handler.stopDown = true;
			$scope.OpenLayersMap.boxControl.handler.stopUp = true;
			$scope.OpenLayersMap.boxControl.activate();
		} else {
			$scope.OpenLayersMap.boxControl.handler.stopDown = false;
			$scope.OpenLayersMap.boxControl.handler.stopUp = false;
			$scope.OpenLayersMap.boxControl.deactivate();
		}
	}); 

	$scope.sortChange = function() {
		$scope.processRecords();
	};

	$scope.updateFacetCount = function(facetJsonObject) {

		if ($scope.rawResult) {
			//reset all facets to zero
			$('#resource_input button span[class~="badge"]').html("0");


			if (facetJsonObject) {
				for (var i in facetJsonObject) {
					var term = facetJsonObject[i].term;
					var count = facetJsonObject[i].count;

					$scope.currentFacets[term] = count;
					$('#resource_input button[class~="val-' + term + '"] span[class~="badge"]').html(count);
				}
			}
		} else {
			$('#resource_input button span[class~="badge"]').html("");
		}

	};

	$scope.getFilteredResults = function() {
		if ($scope.model.resourceFilter != null && $scope.resultItems != null) {

			if ($scope.model.resourceFilter == "1") {
				return $scope.resultItems;
			} else {
				var data = new Array();

				for (var i in $scope.resultItems) {
					var item = $scope.resultItems[i];
					if (item.browseCategories[0] == $scope.FACET_DEFS[$scope.model.resourceFilter]) {
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

		if (records) {
			for (var i = 0; i < records.length; i++) {
				var item = records[i];
				var link = item['link']['url'];
				item['url'] = link;

				var resource = resource = "unknown";
				if (item['browseCategories'] && item['browseCategories'][0]) {
					resource = item['browseCategories'][0].toLowerCase();
				}

				item['resource'] = resource;
				item['mainLink'] = $scope.findLink(item["webLinks"], ["home", "html"], true);

				//build contactText
				var contacts = item['contacts'];
				var contactText = "";	//combined contact text

				if (contacts) {
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
				}

				if (contactText.length > 0) {
					contactText = contactText.substr(0, contactText.length - 2);	//rm trailing ', '
				} else {
					contactText = "[No contact information listed]";
				}

				item['contactText'] = contactText;

				newRecords.push(item);
			}
		}
		
		return newRecords;
	};
	

	/**
	 * Finds a link from a list of ScienceBase webLinks based on a list
	 * of search keys, which are searched for in order against the
	 * 'rel' and 'title' fields of each link.
	 * 
	 * The GLRI project will mark the homepage link with 'rel' == 'home'.
	 * The current Pubs are pushed into ScienceBase w/ 'title' == 'html'
	 * for an (approximate) home page.
	 * 
	 * The return value is an associative array where the title can be used for dispaly:
	 * {url, title}
	 * 
	 * If no matching link is found, null is returned.
	 * 
	 * @param {type} linkArray Array taken from ScienceBase search response webLinks.
	 * @param {type} searchArray List of link 'rel' or 'titles' to search for, in order.
	 * @param {type} defaultToFirst If nothing is found, return the first link if true.
	 * @returns {url, title} or null
	 */
	$scope.findLink = function(linkArray, searchArray, defaultToFirst) {

		if (linkArray && linkArray.length > 0) {

			var retVal = {url: linkArray[0].uri, title: "Home Page"};

			for (var searchIdx = 0; searchIdx < searchArray.length; searchIdx++) {
				var searchlKey = searchArray[searchIdx];
				for (var linkIdx = 0; linkIdx < linkArray.length; linkIdx++) {
					if (linkArray[linkIdx].rel == searchlKey) {
						retVal.url = linkArray[linkIdx].uri;
						retVal.title = $scope.cleanTitle(linkArray[linkIdx].title, "Home Page");
						return retVal;
					} else if (linkArray[linkIdx].title == searchlKey) {
						retVal.url = linkArray[linkIdx].uri;
						retVal.title = $scope.cleanTitle(linkArray[linkIdx].title, "Home Page");
						return retVal;
					}
				}
			}

			if (defaultToFirst) {
				retVal.title = linkArray[0].title;
				return retVal;
			} else {
				return null;
			}
		} else {
			return null;
		}
	};
	
	/**
	 * Replaces boilerplate link titles from ScienceBase w/ a default one if the proposed one is generic.
	 * @param {type} proposedTitle
	 * @param {type} defaultTitle
	 * @returns The passed title or the default title.
	 */
	$scope.cleanTitle = function(proposedTitle, defaultTitle) {
		var p = proposedTitle;
		if (! (p) || p == "html" || p == "jpg" || p == "unspecified") {
			return defaultTitle;
		} else {
			return p;
		}
	};

	$scope.buildDataUrl = function() {
		var url = $("#sb-query-form").attr("action") + "?";
		
		var gaMetrics = new Object();	//for reporting
		
		gaMetrics['metric1'] = 1;	//Add a general entry for the search happening
		
		$.each($scope.model, function(key, value) {
			if (key != "resourceFilter" && value != '' && value != 'Any') {
				
				var actualKey = key;	//for some param we use different keys based on the value
				
				if (key == "location") {
					if (value.indexOf(":") > -1) {
						//this is a location name like "Lake:Lake Michigan'
						actualKey = "loc_name";
					} else {
						//this is a location type like "Lake"
						actualKey = "loc_type";
					}
					
				}
				
				if ($scope.modelAnalytics[actualKey]) gaMetrics['metric' + $scope.modelAnalytics[actualKey]] = 1;
				
				url += encodeURI(actualKey) + "=" + encodeURI(value) + "&";
			}
		});

		if (url.lastIndexOf('&') == (url.length - 1)) url = url.substr(0, url.length - 1);

		//Reports to Google Analytics that a search was done on which set of
		//fields, but doesn't include what the search values were.
		ga('send', 'event', 'action', 'search', gaMetrics);
		
		return url;
	}	

	///////////
	// Map Functions
	///////////
	$scope.OpenLayersMap = {

		map: null,
		orgLon: -85.47,
		orgLat: 45.35,
		orgZoom: 5.25,
		worldStreet: null,
		worldGray: null,
		openlayersBase: null,
		boxLayer: null,
		boxControl: null,

		init: function() {
			this.map = new OpenLayers.Map('map');


			//Base Layers
			this.worldGray = new OpenLayers.Layer.ArcGIS93Rest("World Light Gray Base",
					"http://services.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/export",
					{layers: "show:0"});
			this.worldStreet = new OpenLayers.Layer.ArcGIS93Rest("World Street Map",
					"http://services.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/export",
					{layers: "show:0"});
			this.openlayersBase = new OpenLayers.Layer.WMS("OpenLayers Base",
					"http://vmap0.tiles.osgeo.org/wms/vmap0?", {layers: 'basic'});
			this.worldGrayRef = new OpenLayers.Layer.ArcGIS93Rest("World Light Gray Base Reference",
					"http://server.arcgisonline.com/arcgis/rest/services/Canvas/World_Light_Gray_Reference/MapServer/export",
					{layers: "show:0", TRANSPARENT: true});
					
			//layer for the user to draw a selection box
			this.boxLayer = new OpenLayers.Layer.Vector("Box layer");
			
			//Init layer config
			this.worldGrayRef.isBaseLayer = false;
			this.worldGrayRef.displayInLayerSwitcher = false;
			this.boxLayer.displayInLayerSwitcher = false;

			this.map.addLayers([this.worldGray, this.openlayersBase, this.worldStreet, this.worldGrayRef, this.boxLayer]);
			this.map.addControl(new OpenLayers.Control.LayerSwitcher());
			this.map.addControl(new OpenLayers.Control.MousePosition());
			this.map.addControl(new OpenLayers.Control.DragPan({position: new OpenLayers.Pixel(100, 100)}));
			
			//These seem to be set by default due to the layer ordering, but just to be sure...
			this.map.setBaseLayer(this.worldGray, true);
			this.worldGrayRef.setVisibility(true);
			
			this.boxControl = new OpenLayers.Control.DrawFeature(this.boxLayer,
				OpenLayers.Handler.RegularPolygon, {
					handlerOptions: { sides: 4, irregular: true }
				}
			);
	
			

			// register a listener for removing any boxes already drawn
			this.boxControl.handler.callbacks.create = function(data) {
				if ($scope.OpenLayersMap.boxLayer.features.length > 0) {
					$scope.OpenLayersMap.boxLayer.removeAllFeatures();
				}
			};


			// register a listener for drawing a box
			this.boxControl.events.register('featureadded', this.boxControl,
				function(f) {

					// Variables for the geometry are: bottom/left/right/top
					// Sciencebase requires bounds to look like: [xmin,ymin,xmax,ymax]
					var extent = "["
							+ f.feature.geometry.bounds.left + ","
							+ f.feature.geometry.bounds.bottom
							+ "," + f.feature.geometry.bounds.right
							+ "," + f.feature.geometry.bounds.top
							+ "]";

					$scope.model.spatial = extent;
				});


			this.map.addControl(this.boxControl, new OpenLayers.Pixel(100, 100));
			this.map.setCenter(new OpenLayers.LonLat(this.orgLon, this.orgLat), this.orgZoom);
			
			
			this.worldGray.events.register("visibilitychanged", this.worldGrayRef, function(event) {
				this.setVisibility(event.object.visibility);
			});

		}
		
	}
	
	$scope.OpenLayersMap.init();

});
