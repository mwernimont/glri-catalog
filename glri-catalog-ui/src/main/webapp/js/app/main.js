'use strict';

/* Controllers */

GLRICatalogApp.controller('CatalogCtrl',
['$scope', '$http', '$filter', '$timeout', 'Pagination', 'ScienceBase',
function($scope, $http, $filter, $timeout, pager, ScienceBase) {

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
	
	$scope.isUIFresh   = true;	//True until the user does the first search.   Used to display welcome message.
	$scope.isSearching = false;	//true if we are waiting for results from the main (non-child) query.

	$scope.model ={
		text_query : '',
		location   : '',
		focus      : '',
		template   : '',
		spatial    : '',
	}
	//storage of state that would not be preserved if the user were to follow a
	//link to the current page state.
	$scope.transient = {};
	
	$scope.transient.nav = [
		                    { title:'Home'},
		              	    { title:'Browse'},
		              	    { title:'Search'},
		              	];
	$scope.transient.currentNav = 'Search';

	//The array of funding templates to choose from.  Init as "Any", but async load from vocab server.
	$scope.transient.templateValues = [
		{key: "", display:"Any Template", sort: -1},
		{key: "xxx", display:"...loading template list...", sort: 0},
	];
	
	
	$scope.navShow = function(nav) {
		var navs = $scope.transient.currentNav
		return navs  &&  navs.indexOf(nav)!=-1
	}
	
		
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
		spatial: 6,
		template: 7
	};
	
	
	$scope.currentFacets = {};	//counts of the facets
	
	$scope.searchResult = null;	//array of all the returned items, UNprocessed
	$scope.resultItems  = null;	//array of all the returned items, processed to include display properties

	
	//Non-query user created state
	$scope.userState = {
		drawingBounds  : false,	//true if dragging map should draw a box
		resourceFilter : "1",
		orderProp      : 'title',
	}

	
// asdf ScienceBase	
	/**
	 * Loads the template picklist from the vocab service.
	 * @returns void
	 */
	$scope.doTemplateVocabLoad = function() {
		$http({method: 'GET', url: 'ScienceBaseVocabService?parentId=53da7288e4b0fae13b6deb73&format=json'}).
			success(function(data, status, headers, config) {
				
				//remove the 'loading' message at index 1
				$scope.transient.templateValues.splice(1, 1);
				
				for (var i = 0; i < data.list.length; i++) {
					var o = new Object();
					o.key = data.list[i].name;
					o.display = o.key;
					
					//take all digits at the end, ignoring any trailing spaces.
					o.sort = Number(o.key.match(/(\d*)\s*$/)[1]);
					
					
					$scope.transient.templateValues.push(o);
				}
			}).
			error(function(data, status, headers, config) {
				//just put in a mesage in the picklist - no alert.
				//
				//remove the 'loading' message at index 1
				$scope.transient.templateValues.splice(1, 1);
				$scope.transient.templateValues.push({
					key: "", display:"(!) Failed to load template list", sort: 0
				});
			});
	};
	
// asdf ScienceBase	
	$scope.doRemoteLoad = function(event) {

		//This is called from a form submit button, so don't let the form submit
		event.preventDefault();
		event.stopPropagation();
		
		$scope.isSearching = 'loading';
		$http.get($scope.buildDataUrl()).success(function(data) {
			$scope.processRawScienceBaseResponse(data);
			$scope.isUIFresh = false;
			$scope.isSearching = false;
			$scope.processRecords();
		}).error(function(data, status, headers, config) {
			$scope.isSearching = false;
			alert("Unable to connect to ScienceBase.gov to find records.");
		});
	};
	
// asdf ScienceBase	
	/**
	 * Loads child records to the parent records as:
	 * parentRecord.childItems
	 * parentRecord.childRecordState
	 * childItems is an array of child records.
	 * childRecordState is one of:
	 * notloaded : nothing has been done w/ child items
	 * loading : Attempting to load the child records for this parent
	 * complete : Completed loading child records
	 * failed : Failed to load the child records
	 * closed : Records were loaded, but the user has closed them (they are still assigned to childItems).
	 * 
	 * 
	 * @param {type} parentRecord
	 * @returns {undefined}
	 */
	$scope.loadChildItems = function(parentRecord) {
		
		if (parentRecord.childRecordState == "closed") {
			//already loaded
			parentRecord.childRecordState = "complete";
		} else {
			var url = $scope.getBaseQueryUrl() + "folder=" + parentRecord.id;

			parentRecord.childRecordState = "loading";

			$http.get(url).success(function(data) {
				var childItems = $scope.processGlriResults(data.items);
				childItems = $filter('orderBy')(childItems, $scope.userState.orderProp);

				parentRecord.childItems = childItems;

				parentRecord.childRecordState = "complete";

			}).error(function(data, status, headers, config) {
				parentRecord.childRecordState = "failed";
				alert("Unable to connect to ScienceBase.gov to find child records.");
			});
		}
	};
	
	
// asdf ScienceBase	
	/**
	 * For the main (non-nested child) records, read response metadata and add
	 * extra properties to the records.
	 * 
	 * Side effects:
	 * Results are saved as resultItems and the UI facets will be updated.
	 * 
	 * @param {type} unfilteredJsonData from ScienceBase
	 */
	$scope.processRawScienceBaseResponse = function(unfilteredJsonData) {
		$scope.searchResult = unfilteredJsonData;
		
		if (unfilteredJsonData) {
			$scope.resultItems = $scope.processGlriResults(unfilteredJsonData.items);
			
			var categories = {};
			var keys = Object.keys($scope.FACET_DEFS);
			keys.forEach(function(key) {
				var category = $scope.FACET_DEFS[key]
				var entries  = filterResults($scope.resultItems, category)
				categories[category] = entries.length
			})			
			//updateFacetCount($scope.searchResult.searchFacets[0].entries);
			updateFacetCount(categories)
		} else {
			$scope.resultItems = $scope.processGlriResults(null);
			updateFacetCount(null);
		}
	};
	
// asdf ScienceBase	
	$scope.processGlriResults = function(resultRecordsArray) {
		var records = resultRecordsArray;
		var newRecords = [];

		if (records) {
			for (var i = 0; i < records.length; i++) {
				var item = records[i];
				
				//The system type is set of special items like 'folder's, which we don't want in the results
				var sysTypes = (item['systemTypes'])?item['systemTypes']:[];
				var sysType = (sysTypes[0])?sysTypes[0].toLowerCase():'standard';
				
				//Resource type / browserCategory has its own faceted search
				var resource = resource = "unknown";
				if (item['browseCategories'] && item['browseCategories'][0]) {
					resource = item['browseCategories'][0].toLowerCase();
				}
				
				//don't include folders unless they are projects
				if (sysType != 'folder' || (sysType == 'folder' && resource == 'project')) {
					
					var link = item['link']['url'];
					item['url'] = link;
					item['resource'] = resource;
					item['mainLink'] = ScienceBase.findLink(item["webLinks"], ["home", "html", "index page"], true);


					//Simplify the systemTypes
					delete item['systemTypes'];
					item['systemType'] = sysType;
					
					//Have we loaded child records yet?  (hint: no)
					item['childRecordState'] = "notloaded";
					
					
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
		}
		
		return newRecords;
	};
	
	/**
	 * Process records w/o stepping on any in-process UI updates.
	 * @returns {undefined}
	 */
	$scope.processRecords = function() {
		$timeout(_processRecords, 1, true);
	};
	
	/**
	 * Starting from resultItems:  Sort, fiter, reset current page and update paged records.
	 */
	var _processRecords = function() {
		if (! $scope.resultItems) $scope.resultItems = [];
		
		$scope.resultItems = $filter('orderBy')($scope.resultItems, $scope.userState.orderProp);
		pager.records = getFilteredResults();
		$scope.filteredRecordCount = pager.records.length;
		pager.pageCurrent = 0;
		pager.updatePageRecords();
	};
	
	$scope.clearForm = function(event) {
		
		OpenLayersMap.boxLayer.removeAllFeatures();
		OpenLayersMap.map.setCenter(new OpenLayers.LonLat(OpenLayersMap.orgLon, OpenLayersMap.orgLat), OpenLayersMap.orgZoom);
		
		$scope.model.text_query = '';
		$scope.model.location = '';
		$scope.model.focus = '';
		$scope.model.spatial = '';
		$scope.userState.resourceFilter = "1";
		
		$scope.processRawScienceBaseResponse(null); // asdf ScienceBase	or ProjectManager
		$scope.processRecords(); // asdf ScienceBase	or ProjectManager
		
		$scope.isUIFresh = true;
	};
	
	$scope.updatePageRecords = function() {
		$timeout(pager.updatePageRecords, 1, true);
	};

	$scope.$watch('userState.resourceFilter', function(newValue, oldValue) {
		if (newValue !== oldValue) {
			$scope.processRecords();// asdf ScienceBase	or ProjectManager
		}
	});
	
	$scope.$watch("userState.drawingBounds", function() {
		if ($scope.userState.drawingBounds) {
			OpenLayersMap.boxControl.handler.stopDown = true;
			OpenLayersMap.boxControl.handler.stopUp = true;
			OpenLayersMap.boxControl.activate();
		} else {
			OpenLayersMap.boxControl.handler.stopDown = false;
			OpenLayersMap.boxControl.handler.stopUp = false;
			OpenLayersMap.boxControl.deactivate();
		}
	}); 

	
	$scope.sortChange = function() {
		$scope.processRecords();// asdf ScienceBase	or ProjectManager
	};
	
	
	var updateFacetCount = function(facetJsonObject) {

		if ($scope.searchResult) {
			//reset all facets to zero
			$('#resource_input button span[class~="badge"]').html("0");


			if (facetJsonObject) {
				var keys = Object.keys(facetJsonObject);
				keys.forEach(function(term) {
					var count = facetJsonObject[term];
					$scope.currentFacets[term] = count;
					$('#resource_input button[class~="val-' + term + '"] span[class~="badge"]').html(count);
				})
			}
		} else {
			$('#resource_input button span[class~="badge"]').html("");
		}

	};

	
	var filterResults = function(data, category) {
		var filtered = new Array();

		for (var i in data) {
			var item = data[i];
			if (item.browseCategories && (item.browseCategories[0] == category)) {
				filtered.push(item);
//			} else if (! item.browseCategories) {
//				//We don't know what this thing is - add anyway??
//				data.push(item);
			}
		}

		return filtered;
	}
	
	
	var getFilteredResults = function() {
		if ($scope.userState.resourceFilter != null && $scope.resultItems != null) {

			if ($scope.userState.resourceFilter == "1") {
				return $scope.resultItems;
			} else {
				return filterResults($scope.resultItems, $scope.FACET_DEFS[$scope.userState.resourceFilter])
			}
		} else {
			return $scope.resultItems;
		}
	}

	
	// asdf ScienceBase
	$scope.getBaseQueryUrl = function() {
		return $("#sb-query-form").attr("action") + "?";
	}
	

	// asdf ScienceBase
	$scope.buildDataUrl = function() {
		var url = $scope.getBaseQueryUrl();
		
		var gaMetrics = new Object();	//for reporting
		
		gaMetrics['metric1'] = 1;	//Add a general entry for the search happening
		
		$.each($scope.model, function(key, value) {
			if (value != '' && value != 'Any') {
				
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
	};

	///////////
	// Map Functions
	///////////
	var OpenLayersMap = {

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
				if (OpenLayersMap.boxLayer.features.length > 0) {
					OpenLayersMap.boxLayer.removeAllFeatures();
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
		
	};
	
	
	//Called at the bottom of this JS file
	var init = function() {
		OpenLayersMap.init();
		$scope.doTemplateVocabLoad();
	}

	init();

}]);
