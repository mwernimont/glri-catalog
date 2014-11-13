(function() {

// nice utility directive
GLRICatalogApp.directive('preventDefault', function() {
	return function(scope, element, attrs) {
		$(element).click(function(event) {
			event.preventDefault();
		});
	}
})
	
	
	
GLRICatalogApp.directive("glriHome",[function(){
	return {
		restrict   : 'E', //AEC
		replace    : true,
		transclude : true,
		scope      : true,
		templateUrl: '/glri-catalog/browse/templates/contentHome.html',
	}	
}])

GLRICatalogApp.directive("glriProjectDetail",[function(){
	return {
		restrict   : 'E', //AEC
		replace    : true,
		transclude : true,
		scope      : true,
		templateUrl: '/glri-catalog/browse/templates/contentProjectDetail.html',
	}	
}])

GLRICatalogApp.directive("glriFocusArea",['$http', function($http){
	
	return {
		restrict   : 'E', //AEC
		replace    : true,
		transclude : true,
		scope      : {
			selectedFocusArea : '=focusArea',
			filteredProjects : '=projects',
			loadStatus : '=projectLoadStatus',
			baseQueryUrl : '=baseQueryUrl'
		}, //isolated scope bringing in only transient
		templateUrl: '/glri-catalog/browse/templates/contentFocusArea.html',
		controller : function($scope) {
			
			$scope.transient = {};
			$scope.transient.currentItem = undefined;
			
			$scope.selectProject = function(projectItem) {
				$scope.transient.currentItem = projectItem;
				loadChildItems(projectItem);
			};
			
//			$scope.setProjectDetail = function(item) {
//				$scope.transient.currentItem = item;
//				loadChildItems(item)
//				if ( angular.isDefined(item) && angular.isDefined(item.title) ) {
//					ga('send', 'screenview', {
//						  'screenName': item.id +":"+ item.title
//					});
//				}
//			};
//			
//			$scope.loadProjectDetail = function(item) {
//				setProjectDetail(item)
//				if ( isNav('Browse') ) {
//					setNavAdd('all')
//				}
//				$scope.doNavAdd(item.id)
//			};
			

			loadChildItems = function(parentRecord) {

				if (parentRecord.publications !== 'loading') {
					return
				}

				if (parentRecord.childRecordState == "closed") {
					parentRecord.childRecordState = "complete";			//already loaded

				} else {
					parentRecord.childRecordState = "loading";
					var url = $scope.baseQueryUrl + "folder=" + parentRecord.id;
					url += "&fields=" + encodeURI("url,title,contacts,summary,dateCreated,facets")


					$http.get(url).success(function(data) {
						processPublicationResponse(data, parentRecord.publications=[]);
						//var childItems = processPub(data.items);
						//childItems = $filter('orderBy')(childItems, $scope.userState.orderProp);

						//parentRecord.childItems = childItems;

						parentRecord.childRecordState = "complete";

						if (parentRecord.publications.length===0) {
							parentRecord.publications = undefined
						}

					}).error(function(data, status, headers, config) {
						parentRecord.childRecordState = "failed";
						alert("Unable to connect to ScienceBase.gov to find child records.");
					});
				}
			};
			
			var processPublicationResponse = function(unfilteredJsonData, collection) {

				if (angular.isDefined(unfilteredJsonData) 
				 && angular.isDefined(unfilteredJsonData.items) ) {

					var items = unfilteredJsonData.items;

					for (var i = 0; i < items.length; i++) {
						var pub = processPublication(items[i])
						collection.push(pub)
					}
				}

				setTimeout(function(){$scope.$apply()},10)
			}

			var processPublication = function(pub) {
				pub = processItem(pub);

				pub.item = pub // self link for publications

				var citation
				for (var f in pub.facets) {
					var facet = pub.facets[f]
					if (facet.facetName === "Citation") {
						citation = facet.note.replace(/;(\S)/g,"; $1")
					}
				}
				pub.citation = citation

				return pub
			}
			
			
			var processItem = function(item) {

				item.url  = item.link.url;
				item.mainLink    = findLink(item.webLinks, ["home", "html", "index page"], true);
				item.browseImage = findBrowseImage(item);
		//		item.dateCreated = findDate(item.dates, "dateCreated")

				//Have we loaded child records yet?  (hint: no)
				item.childRecordState = "loading";

				processContacts(item, true)

				//Add template info
				item.templates = [];

				var tags = item.tags;
				if (tags) {
					for (var j = 0; j < tags.length; j++) {
						var tag = tags[j];
						if ($scope.CONST.TEMPLATE_SCHEME == tag.scheme) {
							item.templates.push(tag.name.replace('Template ', ''));
						}
					}
				}

				item.publications = 'loading' // default to loading until we have the publications

				return item;
			};
			
			var processContacts = function(item, includeHTML) {
				//build contactText
				var contacts = item.contacts;
				var contactText = "";	//combined contact text
				var contactHtml = "";	//combined contact text

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

				if (includeHTML) {
					item.contactHtml = contactHtml;
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
			
		}

	};	
}]);

GLRICatalogApp.directive("glriPublications",[function(){
	return {
		restrict   : 'E', //AEC
		replace    : true,
		transclude : true,
		scope      : true, // sub-scope
		templateUrl: '/glri-catalog/browse/templates/contentPublications.html',
		
		link : function($scope, $el, $attrs) {
			$scope.publications  = $scope.transient.allPublications
		}
	}	
}])

GLRICatalogApp.directive("glriAsianCarp",[function(){
	return {
		restrict   : 'E', //AEC
		replace    : true,
		transclude : true,
		scope      : true,
		templateUrl: '/glri-catalog/browse/templates/contentAsianCarp.html',
	}		
}])

GLRICatalogApp.directive("glriInvasive",[function(){
	return {
		restrict   : 'E', //AEC
		replace    : true,
		transclude : true,
		scope      : true,
		templateUrl: '/glri-catalog/browse/templates/contentInvasive.html',
	}		
}])
GLRICatalogApp.directive("glriProjectLists",[function(){
	return {
		restrict   : 'E', //AEC
		replace    : true,
		transclude : true,
		scope      : true,
		templateUrl: '/glri-catalog/browse/templates/contentProjectLists.html',
	}		
}])

		

GLRICatalogApp.directive("glriNavHome",[function(){
	return {
		restrict   : 'E', //AEC
		replace    : true,
		transclude : true,
		scope      : true,
		templateUrl: '/glri-catalog/browse/templates/navHome.html',
	}	
}])


GLRICatalogApp.directive("glriLoading",['$parse', function($parse){
	return {
		restrict   : 'E', //AEC
		replace    : true,
		transclude : true,
		scope      : true, // sub-scope
		templateUrl: '/glri-catalog/browse/templates/glriLoading.html',
		
		link : function($scope, $el, $attrs) {
			$scope.isLoading = $parse($attrs.state)() === 'loading'

			$scope.$watch($attrs.state, function(foo) {
				$scope.isLoading = (foo === 'loading')
			})
		}
	}	
}])

}) ()
