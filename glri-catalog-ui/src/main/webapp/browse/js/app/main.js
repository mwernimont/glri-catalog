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
	
	$scope.isUIFresh = true;	//True until the user does the first search.   Used to display welcome message.
	$scope.isSearching = false;	//true if we are waiting for results from the main (non-child) query.

	$scope.model = new Object();
	$scope.model.text_query = '';
	$scope.model.location = '';
	$scope.model.focus = '';
	$scope.model.template = '';
	$scope.model.spatial = '';
	$scope.model.resource = 'Project';
	
	//storage of state that would not be preserved if the user were to follow a
	//link to the current page state.
	$scope.transient = new Object();
	
	//The array of funding templates to choose from.  Init as "Any", but async load from vocab server.
	$scope.transient.templateValues = [
		{key: "", display:"Any", sort: -1},
		{key: "xxx", display:"...loading template list...", sort: 0},
	];
	
	$scope.transient.tabs = [
		{ title:'Home', isHome: false},
		{ title:'Toxic Substances', isHome: false},
		{ title:'Invasive Species', isHome: false},
		{ title:'Nearshore Health', isHome: false},
		{ title:'Habitat & Wildlife', isHome: false},
		{ title:'Accountability', isHome: false}
	];

	$scope.doTabSelect = function(tabName) {
//		$scope.model.focus = tabName;
//		$scope.doRemoteLoad();
	};
	
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
	
	$scope.rawResult = null;	//array of all the returned items, UNprocessed
	$scope.resultItems = null;	//array of all the returned items, processed to include display properties
	$scope.filteredRecords = null;		//Current records, filtered based on facets.
	
	//Non-query user created state
	$scope.userState = new Object();
	$scope.userState.drawingBounds = false;	//true if dragging map should draw a box
	$scope.userState.resourceFilter = "1";
	$scope.userState.orderProp = 'title';

	//Pagination
	$scope.pageRecordsPerPageOptions = [5, 10, 15];
	$scope.pageCurrent = 0;
	$scope.pageCurrentFirstRecordIndex = 0; //Use to display 'showing records 10 - 20'
	$scope.pageCurrentLastRecordIndex = 0;	//Use to display 'showing records 10 - 20'
	$scope.pageSize = $scope.pageRecordsPerPageOptions[0];
	$scope.pageCount;
	$scope.pageList = [];	//array of numbers, 0 to pageCount - 1.  Used by ng-repeat
	$scope.pageRecords = [];
	$scope.pageHasNext = false;
	$scope.pageHasPrevious = false;

	//Called at the bottom of this JS file
	$scope.init = function() {
		$scope.doRemoteLoad();
	};
	
	
	$scope.doRemoteLoad = function(event) {

		//This is called from a form submit button, so don't let the form submit
		if (event) {
			event.preventDefault();
			event.stopPropagation();
		}
		
		$scope.isSearching = true;
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
	
	/**
	 * Show or hide the child items of a record, loading if needed.
	 * @returns {undefined}
	 */
	$scope.toggleChildItems = function(parentRecord) {
		switch (parentRecord.childRecordState) {
			case 'loading':
				return;	//nothing to do
				break;
			case 'complete':
				parentRecord.childRecordState = 'closed';	//hides the records
				break;
			case 'closed' :
				parentRecord.childRecordState = 'complete';	//shows the records
				break;
			case 'notloaded' :
			case 'failed' :
			default :
				$scope.loadChildItems(parentRecord);
		}
	};
	
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
		$scope.rawResult = unfilteredJsonData;
		
		if (unfilteredJsonData) {
			$scope.resultItems = $scope.processGlriResults(unfilteredJsonData.items);
			$scope.updateFacetCount($scope.rawResult.searchFacets[0].entries);
		} else {
			$scope.resultItems = $scope.processGlriResults(null);
			$scope.updateFacetCount(null);
		}
	};
	

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
					item['mainLink'] = $scope.findLink(item["webLinks"], ["home", "html", "index page"], true);


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
		$timeout($scope._processRecords, 1, true);
	};
	
	/**
	 * Starting from resultItems:  Sort, fiter, reset current page and update paged records.
	 */
	$scope._processRecords = function() {
		if (! $scope.resultItems) $scope.resultItems = [];
		
		$scope.resultItems = $filter('orderBy')($scope.resultItems, $scope.userState.orderProp);
		$scope.filteredRecords = $scope.getFilteredResults();
		$scope.pageCurrent = 0;
		$scope.updatePageRecords();
	};
	
	$scope.clearForm = function(event) {
		
		$scope.OpenLayersMap.boxLayer.removeAllFeatures();
		$scope.OpenLayersMap.map.setCenter(new OpenLayers.LonLat($scope.OpenLayersMap.orgLon, $scope.OpenLayersMap.orgLat), $scope.OpenLayersMap.orgZoom);
		
		$scope.model.text_query = '';
		$scope.model.location = '';
		$scope.model.focus = '';
		$scope.model.spatial = '';
		$scope.userState.resourceFilter = "1";
		
		$scope.processRawScienceBaseResponse(null);
		$scope.processRecords();
		
		$scope.isUIFresh = true;
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
		if ($scope.userState.resourceFilter != null && $scope.resultItems != null) {

			if ($scope.userState.resourceFilter == "1") {
				return $scope.resultItems;
			} else {
				var data = new Array();

				for (var i in $scope.resultItems) {
					var item = $scope.resultItems[i];
					if (item.browseCategories && (item.browseCategories[0] == $scope.FACET_DEFS[$scope.userState.resourceFilter])) {
						data.push(item);
					} else if (! item.browseCategories) {
						//We don't know what this thing is - add anyway??
						data.push(item);
					}
				}

				return data;
			}
		} else {
			return $scope.resultItems;
		}
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
	
	$scope.getBaseQueryUrl = function() {
		return "../ScienceBaseService?";
	};

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


});
