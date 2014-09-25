'use strict';

/* Controllers */
var GLRICatalogApp = angular.module('GLRICatalogApp', ['ui.bootstrap','ngSanitize']);


GLRICatalogApp.controller('CatalogCtrl',
['$scope', '$http', '$filter', '$location', 
function($scope, $http, $filter, $location) {

	$scope.CONST = {};
	$scope.CONST.FOCUS_AREA_SCHEME = "https://www.sciencebase.gov/vocab/category/Great%20Lakes%20Restoration%20Initiative/GLRIFocusArea";
	$scope.CONST.TEMPLATE_SCHEME = "https://www.sciencebase.gov/vocab/category/Great%20Lakes%20Restoration%20Initiative/GLRITemplates";

	
	var setPath = function(navs) {
		var path=""
		var sep=""
		for (var n in navs) {
			path += sep + navs[n]
			sep="/"
		}
		$location.path(path)
	}
	
	var isCaptureHistory = true
	var setCaptureHistory = function(state) {
		isCaptureHistory = state
	}
	

	var setNavRoot = function(nav) {
		$scope.transient.currentFA   = undefined
		$scope.transient.currentItem = undefined
		$scope.transient.currentNav = [nav];
	}	
	$scope.doNavRoot = function(nav) {
		setNavRoot(nav)
				
		if (nav === 'Search') {
			window.location.href='/glri-catalog';
		}
		setPath($scope.transient.currentNav)
	}
	var setNavAdd = function(nav) {
		var navs = $scope.transient.currentNav
		if ( angular.isDefined(navs) ) {
			navs.push(nav);
		}
	}
	$scope.doNavAdd = function(nav) {
		setNavAdd(nav)
		setPath($scope.transient.currentNav)
	}
	$scope.navShow = function(nav) {
		var navs = $scope.transient.currentNav
		return angular.isDefined(navs)  &&  navs.indexOf(nav)!=-1
	}
	$scope.contentShow = function(nav, index, detail) {
		var navs = $scope.transient.currentNav
		index = angular.isDefined(index) ?index :navs.length-1
		var show = angular.isDefined(navs)  &&  navs[index]===nav
		if (detail) {
			show = show &&   angular.isDefined($scope.transient.currentItem)
		} else {
			show = show && ! angular.isDefined($scope.transient.currentItem)
		}
		return show
	}


	// Called at the bottom of this JS file
	var init = function() {
		doNav(true)
		loadProjectLists();
	};
		
	
	//storage of state that would not be preserved if the user were to follow a
	//link to the current page state.
	$scope.transient = {allProjects:[]};
	
	$scope.transient.nav = [
	                    { title:'Home'},
	              	    { title:'Browse'},
	              	    { title:'Search'},
	              	];
	var doNav = function(init) {
	
	  try {
	
		setCaptureHistory(false)		
	
		if ($location.path() && $location.path().length>2) {
			var parts = location.hash.split(/\/+/)
			if (parts.length<=1) {
				$scope.doNavRoot('Home')
			}
			if (parts.length==2) {
				$scope.doNavRoot(parts[1])
			}
			if (parts.length>2) {
				if ($location.path().indexOf('Home')>0) {
					switch(parts.length) {
					case 3: var ofNote = parts[2]
						$scope.ofNoteClick(ofNote)
						break;
					default:
					}
				}
				if ($location.path().indexOf('Browse')>0) {
					if (init) {
						setNavRoot('Browse')
					}
					switch(parts.length) {
					case 4: var id = parts[3]
						var focusArea = parts[2]
						focusAreaActivate(focusArea)
						if (init) {
							setNavAdd(focusArea)
						}
						var url = "https://www.sciencebase.gov/catalog/item/"+id+"?format=json"
						$http.get(url).success(function(data, status, headers, config) {
							var item = processItem(data)
							setProjectDetail(item)
						}).error(function(data, status, headers, config) {
							alert("Unable to connect to ScienceBase.gov to find records.");
						});
						break;
					case 3: var focusArea = parts[2]
						focusAreaActivate(focusArea)
						break;
					default:
					}
				}
			}
		} else {
			$scope.doNavRoot($scope.transient.nav[0].title)
		}
	  } finally {
	  	setCaptureHistory(true)
	  }
	}
	window.onpopstate = function(event) {
		console.log('onpopstate')
		doNav()
		setTimeout(function(){$scope.$apply()},10)
	}
	
	$scope.transient.focusAreaOrder = ['fats','fais','fanh','fahw','facc']
	
	
	$scope.transient.focusAreas = {
		fats : {
			name:'Toxic Substances',
			description: "Toxic Substances and Areas of Concern Projects for the Great Lakes Restoration Initiative",
			infosheet:"http://cida.usgs.gov/glri/infosheets/GLRI_1_Toxic_Substances.pdf",
			items: [],
		},
		fais : {
			name:'Invasive Species',
			description: "Combating Invasive Species Projects for the Great Lakes Restoration Initiative",
			infosheet:"http://cida.usgs.gov/glri/infosheets/GLRI_2_invasive_species.pdf",
			items: [],
		},
		fanh : {
			name:'Nearshore Health',
			description:"Nearshore Health and Watershed Protection Projects for the Great Lakes Restoration Initiative",
			infoSheet:"http://cida.usgs.gov/glri/infosheets/GLRI_3_Nearshore.pdf",
			items: [],
		},
		fahw : {
			name:'Habitat & Wildlife',
			description:"Habitat & Wildlife Protection and Restoration",
			infosheet:"http://cida.usgs.gov/glri/infosheets/GLRI_4_Habitat_Restore.pdf",
			items: [],
		},
		facc : {
			name:'Accountability',
			description :"Tracking Progress and Working with Partners Projects for the Great Lakes Restoration Initiative",
			infosheet:"http://cida.usgs.gov/glri/infosheets/GLRI_5_Tracking_progress_working_w_partners.pdf",
			items: [],
		},
	}
	
	// reverse lookup
	$scope.transient.focusAreasByName = {}
	for (var fa in $scope.transient.focusAreas) {
		var focusArea = $scope.transient.focusAreas[fa]
		$scope.transient.focusAreasByName[focusArea.name] =  fa
	}
	
	$scope.transient.currentItem = undefined;

	var rawResult = undefined;	// array of all the returned items, UNprocessed

	
	var loadProjectLists = function() {

		$http.get(buildDataUrl()).success(function(data, status, headers, config) {
			processProjectListResponse(data);
		}).error(function(data, status, headers, config) {
			alert("Unable to connect to ScienceBase.gov to find records.");
		});

	};
	
	
	var processProjectListResponse = function(unfilteredJsonData) {
		rawResult = unfilteredJsonData;
		
		if (angular.isDefined(unfilteredJsonData) 
		 && angular.isDefined(unfilteredJsonData.items) ) {
			
			var items = unfilteredJsonData.items;

			for (var i = 0; i < items.length; i++) {
				
				var item = processItem(items[i]);
				var tags = item.tags;
				
				if (tags) {
					for (var j = 0; j < tags.length; j++) {
						var tag = tags[j];
						if ($scope.CONST.FOCUS_AREA_SCHEME == tag.scheme) {
							var focusArea = $scope.transient.focusAreasByName[tag.name]
							addProjectToTabList(item, focusArea);
						}
					}
				}
				
			}
		}
		
		setTimeout(function(){$scope.$apply()},10)
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
		var contactHtml = "";	//combined contact text
		var tags = item.tags;
		
		if (contacts) {
			var sep = "";
			for (var j = 0; j < contacts.length; j++) {
				var contact = contacts[j];
				var type = contact.type;
				if (type == 'Principle Investigator') {
					type = "PI";
				}
				var name   = contact.name
				var mailto = contact.name
				if ( angular.isDefined(contact.email) ) {
					mailto = '<a href="mailto:'+contact.email+'">' +contact.name+ '</a>'
				}
				contactText += sep + name + (type!=null ?" (" + type + ") " :"");
				contactHtml += sep + mailto + (type!=null ?" (" + type + ") " :"");
				sep = ", ";
			}
		}

		if (contactText.length === 0) {
			contactText = "[No contact information listed]";
		}
		item.contactText = contactText;
		item.contactHtml = contactHtml;
		
		
		//Add template info
		item.templates = [];
		
		if (tags) {
			for (var j = 0; j < tags.length; j++) {
				var tag = tags[j];
				if ($scope.CONST.TEMPLATE_SCHEME == tag.scheme) {
					item.templates.push(tag.name.replace('Template ', ''));
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
	 * If no matching link is found, undefined is returned.
	 * 
	 * @param {type} linkArray Array taken from ScienceBase search response webLinks.
	 * @param {type} searchArray List of link 'rel' or 'titles' to search for, in order.
	 * @param {type} defaultToFirst If nothing is found, return the first link if true.
	 * @returns {url, title} or undefined
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
				return undefined;
			}
		} else {
			return undefined;
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
		
		return undefined;
	};
	
	
	/**
	 * Adds an Item returned from the ScienceBase query to the tab data structure.
	 * 
	 * @param {type} sbItem
	 * @param {type} focusArea
	 * @returns {project}
	 */
	var addProjectToTabList = function(item, focusArea) {
		
		for (var d in item.dates) {
			var date = item.dates[d]
			if (date.type === "dateCreated") {
				item.dateCreated = date.dateString
				break
			}
		}
		
		var project = {
			title:      item.title,
			id:         item.id,
			item:       item,
			dateCreated:item.dateCreated,
			contacts:   item.contactText,
			templates:  item.templates,
		}
		
		var fa = $scope.transient.focusAreas[focusArea]
		fa.items.push(project)
		$scope.transient.allProjects.push(project)
		
		return project
	}


	var focusAreaActivate = function(focusArea) {
		console.log($scope.transient.currentFA +' -> '+ focusArea)
		$scope.transient.currentFA = focusArea
		$scope.transient.currentItem = undefined;
		
		setTimeout(function(){
			$('#focusAreas button').removeClass('active')
			$('#'+focusArea).addClass('active')
		}, 10)
	}

	$scope.ofNoteClick = function(ofNote) {
		setNavRoot('Home')
		$scope.doNavAdd(ofNote)
	}
	
	$scope.focusAreaClick = function(focusArea) {
		setNavRoot('Browse')
		$scope.doNavAdd(focusArea)
		focusAreaActivate(focusArea)
	}
	
	$scope.loadedFocusAreas = function(focusArea) {
 		return angular.isDefined(focusArea) 
 			&& angular.isDefined($scope.transient.focusAreas[focusArea])
 			&& angular.isDefined($scope.transient.focusAreas[focusArea].items)
 			&& $scope.transient.focusAreas[focusArea].items.length>0
 	}
	
	
	$scope.menuClick = function(tabName) {
		if (tabName==='Home') {
			$scope.transient.currentItem = undefined;
		}
		if ( angular.isDefined(tabName) ) {
			ga('send', 'screenview', {
				  'screenName': tabName
			});
		}
	}
	
	var setProjectDetail = function(item) {
		$scope.transient.currentItem = item;
		if ( angular.isDefined(item) && angular.isDefined(item.title) ) {
			ga('send', 'screenview', {
				  'screenName': item.id +":"+ item.title
			});
		}
	}
	$scope.loadProjectDetail = function(item) {
		setProjectDetail(item)
		$scope.doNavAdd(item.id)
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
		url += "fields=" + encodeURI("tags,title,contacts,hasChildren,webLinks,purpose,body,dates");
		
		return url;
	};
	
	
	var closeMenu = function() {
		$('#navPane').addClass('hidden-xs')
		$('#navPane').removeClass('menu-navPane')
	}
	var openMenu = function() {
		$('#navPane').removeClass('hidden-xs')
		$('#navPane').addClass('menu-navPane')
	}
	
	$scope.toggleNav = function() {
		if ( $('#navPane.hidden-xs').length>0 ) {
			openMenu()
			setTimeout(function(){
				$('body').one('click', closeMenu)
			},100)
		} else {
			closeMenu()
		}
	}

	init();
}]);
