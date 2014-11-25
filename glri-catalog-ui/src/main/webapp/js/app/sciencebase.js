'use strict';


GLRICatalogApp.service('ScienceBase', 
['$http', 'Status', 'FocusAreaManager', '$rootScope',
function($http, Status, FocusAreaManager, $rootScope){
	
	var ctx = this;
	
	
	//These are the Google Analytics custom metrics for each search param.
	//To log search usage, each search should register that a search was done
	//and what type of search it was (actual search values are not tracked).
	//location is split into either loc_type or name based on the value.
	ctx.modelAnalytics = {
		search: 1,
		text_query: 2,
		loc_type: 3,
		loc_name: 4,
		focus: 5,
		spatial: 6,
		template: 7
	};

	
	
	ctx.fetchData = function(resource, success) {
		$http.get( ctx.buildUrl(resource) )
		.success(function(data, status, headers, config) {
			success(data);
		})
		.error(function(data, status, headers, config) {
			alert("Unable to connect to ScienceBase.gov to find " +errorText+ ".");
		});
	}
	
	
	ctx.loadProjectLists = function() {
		ctx.fetchData("Project", function(data){
			ctx.processProjectListResponse(data);
			Status.projectsLoadStatus = 'done';
		});
		ctx.fetchData("Publication", function(data){
			ctx.processPublicationResponse(data, Status.allPublications);
			Status.publicationsLoadStatus = 'done';
		});
	}
	
	
	ctx.processPublicationResponse = function(unfilteredJsonData, collection) {

		if (isDefined(unfilteredJsonData) 
		 && isDefined(unfilteredJsonData.items) ) {
			
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
		
		if (isDefined(unfilteredJsonData) 
		 && isDefined(unfilteredJsonData.items) ) {
			
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
		return unfilteredJsonData.items;
	}	
	
	
	ctx.processItem = function(item) {

		//The system type is set of special items like 'folder's, which we don't want in the results
		var sysTypes = item.systemTypes ?item.systemTypes :[];
		var sysType  = sysTypes[0] ?sysTypes[0].toLowerCase() :'standard';
		
		//Resource type / browserCategory has its own faceted search
		item.resource = "unknown";
		if (item.browseCategories && item.browseCategories[0]) {
			item.resource = item.browseCategories[0].toLowerCase();
		}
		
		//don't include folders unless they are projects
		if (sysType != 'folder' || (sysType == 'folder' && item.resource == 'project')) {
		
			item.url         = item.link.url; // TODO should this find proper link?
			item.mainLink    = ctx.findLink(item.webLinks, ["home", "html", "index page"], true);
			item.browseImage = ctx.findBrowseImage(item);
		//		item.dateCreated = ctx.findDate(item.dates, "dateCreated")
		
			//Simplify the systemTypes
			item.systemType  = sysType;
			
			//Have we loaded child records yet?  (hint: no)
			item.childRecordState = "notloaded";
			item.publications     = 'loading'; // default to loading until we have the publications
		
			ctx.processContacts(item, true)
			
			// Add template info
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
		}		
		return item;
	}

	
	//build contactText
	ctx.processContacts = function(item, includeHTML, max) {
		var contacts = item.contacts;
		var contactText = "";	//combined contact text
		var contactHtml = "";	//combined contact text
		
		if ( isDefined(contacts) ) {
			if ( ! isDefined(max) ) {
				max = contacts.length;
			}
			var sep = "";
			for (var j = 0; j < contacts.length; j++) {
				if (j < max) {
					var contact = contacts[j];
					var type    = contact.type!==null ?contact.type :"??";
					if (type === 'Principle Investigator') {
						type    = "PI";
					}
					var name    = contact.name
					var mailto  = contact.name
					if ( isDefined(contact.email) ) {
						mailto  = '<a href="mailto:'+contact.email+'">' +contact.name+ '</a>'
					}
					contactText += sep + name   + (type!=null ?" (" + type + ") " :"");
					contactHtml += sep + mailto + (type!=null ?" (" + type + ") " :"");
					sep = ", ";
					
				} else if (j === max) {
					contactText+= "and others.  "
				} else {
					break;
				}
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
// asdf used by browse
//		if (parentRecord.publications !== 'loading') {
//			return
//		}

		if (parentRecord.childRecordState == "closed") {
			//already loaded
			parentRecord.childRecordState = "complete";			//already loaded
		} else {
			parentRecord.childRecordState = "loading";
			
			var url = Status.CONST.BASE_QUERY_URL + "folder=" + parentRecord.id;
			url += "&fields=" + encodeURI("url,title,contacts,summary,dateCreated,facets")


			$http.get(url).success(function(data) {
				ctx.processPublicationResponse(data, parentRecord.childItems=[]);
				//var childItems = processPub(data.items);
				//childItems = $filter('orderBy')(childItems, $scope.userState.orderProp);

				//parentRecord.childItems = childItems;

				parentRecord.childRecordState = "complete";

				parentRecord.publications = (parentRecord.childItems.length===0) ?undefined :parentRecord.childItems;

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

	
	ctx.buildUrl = function(resource) {
		var url = Status.CONST.BASE_QUERY_URL+ "resource="+encodeURI(resource+"&")
			+"fields=" +encodeURI("url,summary,tags,title,contacts,hasChildren,webLinks,purpose,body,dateCreated,parentId,facets");
		return url;
	}
	ctx.buildSearchUrl = function(model) {
		var url = Status.CONST.BASE_QUERY_URL;
		
		//Add a general entry for the search happening
		var gaMetrics = {metric1:1};
		
		var sep=""; // the first entry gets no separator (see below)
		$.each(model, function(key, value) {
			if (value === '' || value === 'Any') {
				return;
			}
				
			var actualKey = key;	//for some param we use different keys based on the value
			
			if (key === "location") {
				if (value.indexOf(":") > -1) {
					//this is a location name like "Lake:Lake Michigan'
					actualKey = "loc_name";
				} else {
					//this is a location type like "Lake"
					actualKey = "loc_type";
				}
			}
			
			if (ctx.modelAnalytics[actualKey]) {
				gaMetrics['metric' + ctx.modelAnalytics[actualKey]] = 1;
			}
			url += sep+ encodeURI(actualKey) +"="+ encodeURI(value);
			sep = "&"; // each additional will get this separator
		});

		//Reports to Google Analytics that a search was done on which set of
		//fields, but doesn't include what the search values were.
		ga('send', 'event', 'action', 'search', gaMetrics);
		
		return url;
	}

}])
