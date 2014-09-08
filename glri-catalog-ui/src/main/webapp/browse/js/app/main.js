'use strict';

/* Controllers */
var GLRICatalogApp = angular.module('GLRICatalogApp', ['ui.bootstrap']);


GLRICatalogApp.controller('CatalogCtrl',
['$scope', '$http', '$filter', '$timeout', 
function($scope, $http, $filter, $timeout) {

	$scope.CONST = {};
	$scope.CONST.FOCUS_AREA_SCHEME = "https://www.sciencebase.gov/vocab/category/Great%20Lakes%20Restoration%20Initiative/GLRIFocusArea";
	$scope.CONST.TEMPLATE_SCHEME = "https://www.sciencebase.gov/vocab/category/Great%20Lakes%20Restoration%20Initiative/GLRITemplates";

	
	$scope.navRoot = function(nav) {
		$scope.transient.currentTab = null;		
		if (nav === 'Search') {
			window.location='/glri-catalog';
		}
		$scope.transient.currentNav = [nav];
	}
	$scope.navAdd = function(nav) {
		var navs = $scope.transient.currentNav
		if (navs) {
			navs.push(nav);
		}
	}
	$scope.navShow = function(nav) {
		var navs = $scope.transient.currentNav
		return navs  &&  navs.indexOf(nav)!=-1
	}
	$scope.contentShow = function(nav) {
		var navs = $scope.transient.currentNav
		return navs  &&  navs[ navs.length-1 ]===nav
	}
	
	//storage of state that would not be preserved if the user were to follow a
	//link to the current page state.
	$scope.transient = {};
	
	$scope.transient.nav = [
	                    { title:'Home'},
	              	    { title:'Browse'},
	              	    { title:'Search'},
	              	];
	$scope.transient.currentNav = [$scope.transient.nav[0].title];
	
	$scope.transient.tabs = [
		{ title:'Toxic Substances', isHome: false, items: [
			{title:"INFO-SHEET: Toxic Substances and Areas of Concern Projects for the Great Lakes Restoration Initiative", 
			   url:"http://cida.usgs.gov/glri/infosheets/GLRI_1_Toxic_Substances.pdf"}
		]},
		{ title:'Invasive Species', isHome: false, items: [
			{title:"INFO-SHEET: Combating Invasive Species Projects for the Great Lakes Restoration Initiative", 
			   url:"http://cida.usgs.gov/glri/infosheets/GLRI_2_invasive_species.pdf"}
		]},
		{ title:'Nearshore Health', isHome: false, items: [
			{title:"INFO-SHEET: Nearshore Health and Watershed Protection Projects for the Great Lakes Restoration Initiative", 
			   url:"http://cida.usgs.gov/glri/infosheets/GLRI_3_Nearshore.pdf"}
		]},
		{ title:'Habitat & Wildlife', isHome: false, items: [
			{title:"INFO-SHEET: Habitat & Wildlife Protection and Restoration", 
			   url:"http://cida.usgs.gov/glri/infosheets/GLRI_4_Habitat_Restore.pdf"}
		]},
		{ title:'Accountability', isHome: false, items: [
			{title:"INFO-SHEET: Tracking Progress and Working with Partners Projects for the Great Lakes Restoration Initiative", 
			   url:"http://cida.usgs.gov/glri/infosheets/GLRI_5_Tracking_progress_working_w_partners.pdf"}
		]}
	];
	
	$scope.transient.focusAreas = {}
	for (var t=0; t<$scope.transient.tabs.length; t++) {
		var tab = $scope.transient.tabs[t]
		$scope.transient.focusAreas[tab.title] =  {infosheet:tab.items[0].url, items:[]}
	}
	
	$scope.transient.currentItem = null;

	var rawResult = null;	// array of all the returned items, UNprocessed

	
	// Called at the bottom of this JS file
	var init = function() {
		loadProjectLists();
	};
	
	
	var loadProjectLists = function() {

		$http.get(buildDataUrl()).success(function(data, status, headers, config) {
			processProjectListResponse(data);
		}).error(function(data, status, headers, config) {
			alert("Unable to connect to ScienceBase.gov to find records.");
		});

	};
	
	
	var processProjectListResponse = function(unfilteredJsonData) {
		rawResult = unfilteredJsonData;
		
		if (unfilteredJsonData) {
			
			var items = unfilteredJsonData.items;

			for (var i = 0; i < items.length; i++) {
				
				var item = processItem(items[i]);
				var tags = item.tags;
				
				if (tags) {
					for (var j = 0; j < tags.length; j++) {
						var tag = tags[j];
						if ($scope.CONST.FOCUS_AREA_SCHEME == tag.scheme) {
							var name = tag.name;
							addProjectToTabList(item, tag.name);
						}
					}
				}
				
			}
		}
	};
	
	
	var processItem = function(item) {

		var link = item['link']['url'];
		item['url'] = link;
		item['mainLink'] = findLink(item["webLinks"], ["home", "html", "index page"], true);
		item['browseImage'] = findBrowseImage(item);

		//Have we loaded child records yet?  (hint: no)
		item['childRecordState'] = "notloaded";


		//build contactText
		var contacts = item['contacts'];
		var contactText = "";	//combined contact text
		var tags = item.tags;
		
		if (contacts) {
			var sep = "";
			for (var j = 0; j < contacts.length; j++) {
				var contact = contacts[j];
				var name = contact['name'];
				var type = contact['type'];

				if (type == null) type = "??";
				if (type == 'Principle Investigator') type = "PI";

				contactText+=sep + name + " (" + type + ") ";
				sep = ", ";
			}
		}

		if (contactText.length === 0) {
			contactText = "[No contact information listed]";
		}
		item.contactText = contactText;
		
		
		//Add template info
		item.templates = [];
		
		if (tags) {
			for (var j = 0; j < tags.length; j++) {
				var tag = tags[j];
				if ($scope.CONST.TEMPLATE_SCHEME == tag.scheme) {
					item.templates.push(tag.name);
				}
			}
		}

		return item;
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
	var findLink = function(linkArray, searchArray, defaultToFirst) {

		if (linkArray && linkArray.length > 0) {

			var retVal = {url: linkArray[0].uri, title: "Home Page"};

			for (var searchIdx = 0; searchIdx < searchArray.length; searchIdx++) {
				var searchlKey = searchArray[searchIdx];
				for (var linkIdx = 0; linkIdx < linkArray.length; linkIdx++) {
					if (linkArray[linkIdx].rel == searchlKey) {
						retVal.url = linkArray[linkIdx].uri;
						retVal.title = cleanTitle(linkArray[linkIdx].title, "Home Page");
						return retVal;
					} else if (linkArray[linkIdx].title == searchlKey) {
						retVal.url = linkArray[linkIdx].uri;
						retVal.title = cleanTitle(linkArray[linkIdx].title, "Home Page");
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
	var cleanTitle = function(proposedTitle, defaultTitle) {
		var p = proposedTitle;
		if (! (p) || p == "html" || p == "jpg" || p == "unspecified") {
			return defaultTitle;
		} else {
			return p;
		}
	};
	
	
	var findBrowseImage = function(item) {
		var webLinks = item.webLinks;
		if (webLinks) {
			for (var i = 0; i < webLinks.length; i++) {
				var link = webLinks[i];
				if (link.type == "browseImage") {
					return link.uri;
				}
			}
		}
		
		return null;
	};
	
	
	/**
	 * Adds an Item returned from the ScienceBase query to the tab data structure.
	 * 
	 * @param {type} sbItem
	 * @param {type} focusArea
	 * @returns {undefined}
	 */
	var addProjectToTabList = function(sbItem, focusArea) {
		var fa = $scope.transient.focusAreas[focusArea]
		fa.items.push({
			title: sbItem.title,
			id: sbItem.id,
			item: sbItem,
			contacts: sbItem.contactText,
			templates: sbItem.templates,
		});
	}
	
	$scope.focusAreaClick = function(focusArea) {
		console.log(focusArea)
		$scope.transient.currentTab = focusArea
		console.log($scope.transient.focusAreas[$scope.transient.currentTab].items)
	}
	
	
	$scope.menuClick = function(tabName) {
		if (tabName==='Home') {
			$scope.transient.currentItem = null;
		}
		if ( angular.isDefined(tabName) ) {
			ga('send', 'screenview', {
				  'screenName': tabName
			});
		}
	}
	
	$scope.loadProjectDetail = function(item) {
		$scope.transient.currentItem = item;
		if ( angular.isDefined(item) && angular.isDefined(item.title) ) {
			ga('send', 'screenview', {
				  'screenName': item.id +":"+ item.title
			});
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
//asdf		
		if (parentRecord.childRecordState == "closed") {
			//already loaded
			parentRecord.childRecordState = "complete";
		} else {
			var url = getBaseQueryUrl() + "folder=" + parentRecord.id;

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
	
	
	var getBaseQueryUrl = function() {
		return "../ScienceBaseService?";
	};

	
	var buildDataUrl = function() {
		var url = getBaseQueryUrl();
		url += "resource=" + encodeURI("Project&");
		url += "fields=" + encodeURI("tags,title,contacts,hasChildren,webLinks,purpose,body");
		
		return url;
	};

	init();
}]);
