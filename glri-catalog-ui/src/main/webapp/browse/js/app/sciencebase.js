'use strict';


GLRICatalogApp.service('ScienceBase', 
['$http', 'Status', 'FocusAreaManager', '$rootScope',
function($http, Status, FocusAreaManager, $rootScope){
	
	var ctx = this;
	
	
	ctx.loadProjectLists = function() {

		$http.get(ctx.buildDataUrl()).success(function(data, status, headers, config) {
			ctx.processProjectListResponse(data);
			Status.projectsLoadStatus = 'done';
		}).error(function(data, status, headers, config) {
			alert("Unable to connect to ScienceBase.gov to find records.");
		});
		
		$http.get(ctx.buildPubUrl()).success(function(data, status, headers, config) {
			ctx.processPublicationResponse(data, Status.allPublications);
			Status.publicationsLoadStatus = 'done';
		}).error(function(data, status, headers, config) {
			alert("Unable to connect to ScienceBase.gov to find publications.");
		});

	}
	
	
	ctx.processPublicationResponse = function(unfilteredJsonData, collection) {

		if (angular.isDefined(unfilteredJsonData) 
		 && angular.isDefined(unfilteredJsonData.items) ) {
			
			var items = unfilteredJsonData.items;

			for (var i = 0; i < items.length; i++) {
				var pub = ctx.processPublication(items[i])
				collection.push(pub)
			}
		}
		
		$rootScope.$broadcast('do-scopeApply');
	}
	
	
	ctx.processPublication = function(pub) {
		pub = ctx.processItem(pub);
		
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
	
	
	ctx.processProjectListResponse = function(unfilteredJsonData) {
		
		if (angular.isDefined(unfilteredJsonData) 
		 && angular.isDefined(unfilteredJsonData.items) ) {
			
			var items = unfilteredJsonData.items;

			for (var i = 0; i < items.length; i++) {
				
				var item = ctx.processItem(items[i]);
				var tags = item.tags;
				
				if (tags) {
					for (var j = 0; j < tags.length; j++) {
						var tag = tags[j];
						if (Status.CONST.FOCUS_AREA_SCHEME == tag.scheme) {
							FocusAreaManager.addProjectToFocusArea(item, tag.name);
						}
					}
				}
				
			}
		}
		
		$rootScope.$broadcast('do-scopeApply');
	}	
	
	ctx.processItem = function(item) {

		item.url  = item.link.url;
		item.mainLink    = ctx.findLink(item.webLinks, ["home", "html", "index page"], true);
		item.browseImage = ctx.findBrowseImage(item);
//		item.dateCreated = ctx.findDate(item.dates, "dateCreated")

		//Have we loaded child records yet?  (hint: no)
		item.childRecordState = "loading";
		item.publications = 'loading' // default to loading until we have the publications

		ctx.processContacts(item, true)
		
		//Add template info
		item.templates = [];
		
		var tags = item.tags;
		if (tags) {
			for (var j = 0; j < tags.length; j++) {
				var tag = tags[j];
				if (Status.CONST.TEMPLATE_SCHEME == tag.scheme) {
					item.templates.push(tag.name.replace('Template ', ''));
				}
			}
		}
		
		return item;
	}

	
	ctx.processContacts = function(item, includeHTML) {
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
	}
	
	
	ctx.findBrowseImage = function(item) {
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
	}
	
	
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
	ctx.findLink = function(linkArray, searchArray, defaultToFirst) {

		if (linkArray && linkArray.length > 0) {

			var retVal = {url: linkArray[0].uri, title: "Home Page"};

			for (var searchIdx = 0; searchIdx < searchArray.length; searchIdx++) {
				var searchlKey = searchArray[searchIdx];
				for (var linkIdx = 0; linkIdx < linkArray.length; linkIdx++) {
					if (linkArray[linkIdx].rel == searchlKey) {
						retVal.url = linkArray[linkIdx].uri;
						retVal.title = ctx.cleanTitle(linkArray[linkIdx].title, "Home Page");
						return retVal;
					} else if (linkArray[linkIdx].title == searchlKey) {
						retVal.url = linkArray[linkIdx].uri;
						retVal.title = ctx.cleanTitle(linkArray[linkIdx].title, "Home Page");
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
	}
	
	
	ctx.findDate = function(dates, type) {
		for (var d in dates) {
			var date = dates[d]
			if (date.type === type) {
				return date.dateString
			}
		}
		return "none"
	}
	

	ctx.loadChildItems = function(parentRecord) {

		if (parentRecord.publications !== 'loading') {
			return
		}

		if (parentRecord.childRecordState == "closed") {
			parentRecord.childRecordState = "complete";			//already loaded

		} else {
			parentRecord.childRecordState = "loading";
			var url = Status.CONST.BASE_QUERY_URL + "folder=" + parentRecord.id;
			url += "&fields=" + encodeURI("url,title,contacts,summary,dateCreated,facets")


			$http.get(url).success(function(data) {
				ctx.processPublicationResponse(data, parentRecord.publications=[]);
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
	}	
	
	
	/**
	 * Replaces boilerplate link titles from ScienceBase w/ a default one if the proposed one is generic.
	 * @param {type} proposedTitle
	 * @param {type} defaultTitle
	 * @returns The passed title or the default title.
	 */
	ctx.cleanTitle = function(proposedTitle, defaultTitle) {
		var p = proposedTitle;
		if (! (p) || p == "html" || p == "jpg" || p == "unspecified") {
			return defaultTitle;
		} else {
			return p;
		}
	}

	
	ctx.buildDataUrl = function() {
		var url = Status.CONST.BASE_QUERY_URL;
		url += "resource=" + encodeURI("Project&");
		url += "fields=" + encodeURI("tags,title,contacts,hasChildren,webLinks,purpose,body,dateCreated,parentId");
		
		return url;
	};
	ctx.buildPubUrl = function() {
		var url = Status.CONST.BASE_QUERY_URL;
		url += "resource=" + encodeURI("Publication&");
		url += "fields=" + encodeURI("url,title,contacts,summary,dateCreated,facets")
		return url;
	};

}])
