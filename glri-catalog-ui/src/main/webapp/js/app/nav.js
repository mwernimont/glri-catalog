'use strict';

GLRICatalogApp.service('Nav', 
['$http', '$location', 'Status', 'FocusAreaManager', '$rootScope', 'ScienceBase', 'RecordManager',
function($http, $location, Status, FocusAreaManager, $rootScope, ScienceBase, RecordManager) {
	var DEFAULT_FOCUS_AREA = "all";
	
	var ctx = this;
	window.Nav = ctx;
	
	ctx.currentNav = undefined;

	//Top level navigation tabs
	ctx.navNames = ['Home','Browse','Search']; 
	
	ctx.navBrowseCategories = ['Projects', "Publications"];
	
	ctx.setNavAdd = function(nav) {
		var navs = ctx.currentNav;
		if ( isDefined(navs) ) {
			navs.push(nav);
		}
	}
	
	
	ctx.doNavAdd = function(nav) {
		ctx.setNavAdd(nav);
		ctx.setPath(ctx.currentNav);
	}
	
	
	ctx.navShow = function(nav) {
		var navs = ctx.currentNav;
		
		return isDefined(navs)  &&  navs.indexOf(nav)!=-1
	}
	
	ctx.contentShow = function(nav, index, detail) {
		var show = ctx.isNav(nav,index)
		return show
	}
	
	
	ctx.isNav = function(nav, index) {
		var navs = ctx.currentNav;
		index = isDefined(index) ?index :navs.length-1;
		var isNav = isDefined(navs)  &&  navs[index]===nav;
		return isNav;
	}
	
	ctx.setNavRoot = function(nav) {
		FocusAreaManager.currentFocusArea = FocusAreaManager.areasByType['all'];
		Status.currentItem = undefined;
		ctx.currentNav = [nav];
	}
	
	ctx.doNavRoot = function(nav) {
		ctx.setNavRoot(nav);
		
		if(nav === "Publications") {
			ctx.setActiveCategory("Publications")
		} else if (nav === "Browse") {
			ctx.setActiveCategory("Projects")
			ctx.doNavAdd(DEFAULT_FOCUS_AREA);
		} else {
			$('#navBrowse .glri-navbtn-Browse').removeClass('active')
		}
		
		ctx.setPath(ctx.currentNav);
	}
	
	ctx.navBrowseCategory = function(cat) {
		if(cat == "Projects") {
			ctx.doNavRoot("Browse")
		} else {
			ctx.doNavRoot("Publications")
		}
	}
	
	ctx.setFocusArea = function(focusArea) {
		var parts = $location.path().split(/\/+/);
		var rootIndex = 1;
		var basePath = parts[rootIndex];
		Nav.setNavRoot(basePath)
		
		if(basePath == "Browse") {
			Nav.doNavAdd(focusArea);
		}
	}
	
	ctx.setActiveCategory = function(cat) {
		setTimeout(function(){
			$('#navBrowse .glri-navbtn-Browse').addClass('active')
			$('#navBrowseCategories a').removeClass('active')
			$('.browse-cat-' + cat).addClass('active')
		}, 10);
	}
	
	ctx.updateFocusAreas = function(focusArea) {
		setTimeout(function(){
			$('#focusAreas button').removeClass('active')
			$('#'+focusArea).addClass('active')
		}, 10);

		setTimeout(function(){
			$('#focusAreasForPubs button').removeClass('active')
			$('#'+focusArea).addClass('active')
		}, 10);
	}

	ctx.setPath = function(navs) {
		var path="";
		var sep="";
		for (var n in navs) {
			path += sep + navs[n];
			sep="/";
		}
		$location.path(path);
		ga('send', 'pageview', {'page': '/glri/#/'+path})
	}
	
	ctx.doNav = function(init) {
		try {
			Status.isCaptureHistory = false;

			var parts = $location.path().split(/\/+/);
			if (parts.length > 1) {
				var basePath = parts[1];

				switch(basePath) {
				case 'Home':
					ctx.goHome(parts, init);
					break;
				case 'Publications':
					ctx.goPubsList(parts, init);
					break;
				case 'Browse':
					ctx.goBrowse(parts, init);
					break;
				default:
					ctx.doNavRoot(parts[1]);
				}
			} else {
				ctx.doNavRoot(ctx.navNames[0]); //defaults to left nav name 
			}
		} finally {
			Status.isCaptureHistory = true;
		}
	}

	ctx.goHome = function(parts, init) {
		if(parts.length == 2) {
			ctx.doNavRoot('Home');
		} else { 
			var ofNote = parts[2];
			$rootScope.$broadcast('do-ofNoteClick', { ofNote: ofNote });
		}
	}
	
	ctx.goPubsList = function(parts, init) {
		FocusAreaManager.activate(DEFAULT_FOCUS_AREA);
		ctx.updateFocusAreas(DEFAULT_FOCUS_AREA);
		ctx.doNavRoot(parts[1]);
	}
	
	ctx.goBrowse = function(parts, init) {
		var rootIndex = 1;
		if (init) {
			ctx.setNavRoot("Browse");
		}
		ctx.setActiveCategory("Projects")
		switch(parts.length) {
		case 4: var id = parts[rootIndex + 2];
			var focusArea = parts[rootIndex + 1];
			FocusAreaManager.activate(focusArea);
			if (init) {
				ctx.setNavAdd(focusArea);
			}
			var url = baseURL+"/catalog/item/"+id+"?format=json"
			$http.get(url).success(function(data, status, headers, config) {
				var item = ScienceBase.processItem(data);
				RecordManager.setProjectDetail(item);
				$rootScope.$broadcast('do-scopeApply');

			}).error(function(data, status, headers, config) {
				alert("Unable to connect to ScienceBase.gov to find records.");
			});

			ctx.updateFocusAreas(focusArea);
			break;
		case 3: var focusArea = parts[rootIndex + 1];
			FocusAreaManager.activate(focusArea);
			ctx.updateFocusAreas(focusArea);
			break;
		default:
		}
	}
		
	window.onpopstate = function(event) {
		console.log('onpopstate')
		ctx.doNav()
		
		$rootScope.$broadcast('do-scopeApply');
	}	
	
	
	window.clickNav = function(){
		setTimeout(function(){ctx.doNav(true)},10)		
	}
}])

