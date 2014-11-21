'use strict';


// the mediator between search nav and content
GLRICatalogApp.service('Search',
['$http', '$filter', '$timeout', 'Pagination', 'ScienceBase', 'Status',
function($http, $filter, $timeout, pager, ScienceBase, Status) {
	
	var ctx = this;
	
	ctx.results = {
		items  : [],	//array of all the returned items, processed to include display properties
	}
	
	//Non-query user created state
	ctx.state = {
		drawingBounds  : false,	//true if dragging map should draw a box
		resourceFilter : 0,
		orderProp      : 'title',
		isFreshUI      : true,
		isSearching    : false
	};

	ctx.FACET_DEFS = [
 		"Any",
 		"Data",
 		"Publication",
 		"Project"
 	];
	
	ctx.currentFacets = {};	    //counts of the facets
	
	ctx.setSearching  = function(value) {
		ctx.state.isFreshUI   = false;
		ctx.state.isSearching = value;	//true if we are waiting for results from the main (non-child) query.
	}
	
}]);


/* Controllers */


GLRICatalogApp.controller('SearchNavCtrl',
['$scope', '$http', '$filter', '$timeout', 'Pagination', 'ScienceBase', 'Status', 'Search',
function($scope, $http, $filter, $timeout, pager, ScienceBase, Status, Search) {
	
	$scope.state         = Search.state;
	$scope.FACET_DEFS    = Search.FACET_DEFS;
	$scope.currentFacets = Search.currentFacets;
	$scope.results       = Search.results;
	//storage of state that would not be preserved if the user were to follow a
	//link to the current page state.
	$scope.transient = {
		//The array of funding templates to choose from.  Init as "Any", but async load from vocab server.
		templateValues : [
			{key: "", display:"Any Template", sort: -1},
			{key: "xxx", display:"...loading template list...", sort: 0},
		]
	};
	$scope.model = {
		text_query : '',
		location   : '',
		focus      : '',
		template   : '',
		spatial    : '',
	};
	

	$scope.doRemoteLoad = function(event) {
		Search.setSearching(true);
		$scope.loadSearchData($scope.model, function(){
			Search.setSearching(false);
		}, function(){
			Search.setSearching(false);
		});
	}	
	
	
	$scope.clearForm = function(event) {
		
		OpenLayersMap.boxLayer.removeAllFeatures();
		OpenLayersMap.map.setCenter(new OpenLayers.LonLat(OpenLayersMap.orgLon, OpenLayersMap.orgLat), OpenLayersMap.orgZoom);
		
		$scope.model.text_query = '';
		$scope.model.location   = '';
		$scope.model.focus      = '';
		$scope.model.spatial    = '';
		Search.state.resourceFilter = 0;
		Search.state.isFreshUI  = true;
		
		$scope.processRawScienceBaseResponse(null); // asdf ScienceBase	or RecordManager
		processRecords();
	}

	
	// asdf ScienceBase	
	/**
	 * Loads the template picklist from the vocab service.
	 * @returns void
	 */
	var doTemplateVocabLoad = function() {
		$http({method: 'GET', url: 'ScienceBaseVocabService?parentId=53da7288e4b0fae13b6deb73&format=json'})
		.success(function(data, status, headers, config) {
				
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
		})
		.error(function(data, status, headers, config) {
			//just put in a mesage in the picklist - no alert.
			//
			//remove the 'loading' message at index 1
			$scope.transient.templateValues.splice(1, 1);
			$scope.transient.templateValues.push({
				key: "", display:"(!) Failed to load template list", sort: 0
			});
		});
	}

	
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
			}


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
	
	
	$scope.$watch("state.drawingBounds", function() {
		if (Search.state.drawingBounds) {
			OpenLayersMap.boxControl.handler.stopDown = true;
			OpenLayersMap.boxControl.handler.stopUp   = true;
			OpenLayersMap.boxControl.activate();
		} else {
			OpenLayersMap.boxControl.handler.stopDown = false;
			OpenLayersMap.boxControl.handler.stopUp   = false;
			OpenLayersMap.boxControl.deactivate();
		}
	}); 

	
	
	//Called at the bottom of this JS file
	var init = function() {
		OpenLayersMap.init();
		doTemplateVocabLoad();
	}

	init();
	
}]);


GLRICatalogApp.controller('SearchCtrl',
['$scope', '$http', '$filter', '$timeout', 'Pagination', 'ScienceBase', 'Status', 'Search',
function($scope, $http, $filter, $timeout, pager, ScienceBase, Status, Search) {

	$scope.state   = Search.state;
	
	$scope.SORT_OPTIONS = [
		{key: "title", display: "Title"},
		{key: "contactText", display: "Author / PI / Creator"}
	];
	
	
// asdf ScienceBase	
	$scope.loadSearchData = function(model,success,error) {
		
		$http.get( ScienceBase.buildSearchUrl(model) )
		.success(function(data) {
			$scope.processRawScienceBaseResponse(data);
			processRecords();
			if (success) success();
		}).error(function(data, status, headers, config) {
			if (error) error();
			alert("Unable to connect to ScienceBase.gov to find records.");
		});
	}
	
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
		Search.results.search = unfilteredJsonData;
		
		if (unfilteredJsonData) {
			ScienceBase.processProjectListResponse(unfilteredJsonData);
			Search.results.items = unfilteredJsonData.items;
			
			Search.FACET_DEFS.forEach(function(category) {
				var entries  = filterResults(Search.results.items, category)
				$scope.currentFacets[category] = entries.length
			})			
		} else {
			Search.results.items = ScienceBase.processProjectListResponse(null);
		}
	}
	
	
	/**
	 * Process records w/o stepping on any in-process UI updates.
	 * @returns {undefined}
	 */
	var processRecords = function() {
		$timeout(_processRecords, 1, true);
	}
	
	
	/**
	 * Starting from resultItems:  Sort, fiter, reset current page and update paged records.
	 */
	var _processRecords = function() {
		if ( ! Search.results.items ) {
			Search.results.items = [];
		}
		
		Search.results.items = $filter('orderBy')(Search.results.items, Search.state.orderProp);

		pager.records      = filterResults(Search.results.items, Search.FACET_DEFS[Search.state.resourceFilter]);
		$scope.filteredRecordCount = pager.records.length;
		
		pager.pageCurrent  = 0;
		updatePageRecords();
	}
	
	
	
	
	var updatePageRecords = function() {
		$timeout(pager.updatePageRecords, 1, true);
	}
	

	$scope.$watch('state.resourceFilter', function(newValue, oldValue) {
		if (newValue !== oldValue) {
			processRecords();
		}
	});
	
	
	$scope.sortChange = function() {
		processRecords();
	}
	
	
	var filterResults = function(data, category) {
		if ( data === null || category === null || category === 'Any') {
			return data;
		}
		
		var filtered = [];

		data.forEach(function(item){
			if (item.browseCategories && (item.browseCategories[0] === category)) {
				filtered.push(item);
			}
		});

		return filtered;
	}
	

	$scope.isFilterEmpty = function() {
		return ! Search.state.isFreshUI && Search.results.items.length > 0 && $scope.filteredRecordCount == 0
	}
	$scope.isSearchEmpty = function() {
		return ! Search.state.isFreshUI && Search.results.items.length == 0 
	}
	
}]);
