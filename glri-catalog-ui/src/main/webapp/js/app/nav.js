'use strict';

GLRICatalogApp.service('Nav', 
['$http', '$location', 'Status', 'FocusAreaManager', '$rootScope', 'ScienceBase', 'RecordManager',
function($http, $location, Status, FocusAreaManager, $rootScope, ScienceBase, RecordManager) {
	var DEFAULT_TARGET = "Home";
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
		} else if (nav.startsWith("Browse")) {
			ctx.setActiveCategory("Projects")
			FocusAreaManager.activate(DEFAULT_FOCUS_AREA);
		} else {
			$('#navBrowse .glri-navbtn-Browse').removeClass('active')
		}
		
		ctx.setPath(ctx.currentNav);
	}
	
	ctx.navBrowseCategory = function(cat) {
		if(cat == "Projects") {
			ctx.doNavRoot("Browse")
		} else {
			ctx.doNavRoot("Browse/Publications")
		}
	}
	
	ctx.setActiveCategory = function(cat) {
		setTimeout(function(){
			$('#navBrowse .glri-navbtn-Browse').addClass('active')
			$('#navBrowseCategories a').removeClass('active')
			$('.browse-cat-' + cat).addClass('active')
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
		
			if ($location.path() && $location.path().length>2) {
				var parts = $location.path().split(/\/+/);
				var rootIndex = 1;
				
				//default nav to home
				if (parts.length<=1) {
					ctx.doNavRoot(DEFAULT_TARGET);
				} else if (parts.length==2) {
					ctx.doNavRoot(parts[1]);
				} else {
					var basePath = parts[rootIndex];
					
					if (basePath == 'Home') {
						switch(parts.length) {
						case 3: var ofNote = parts[rootIndex + 1];
							$rootScope.$broadcast('do-ofNoteClick', { ofNote: ofNote });
							break;
						default:
						}
					}
					
					if(basePath == "Browse") {
						if(parts[rootIndex + 1] == "Publications") {
							ctx.doNavRoot(ctx.doNavRoot(parts[rootIndex + 1]));
						} else {
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
								break;
							case 3: var focusArea = parts[rootIndex + 1];
								FocusAreaManager.activate(focusArea);
								break;
							default:
							}
						}
					}
				}
			} else {
				ctx.doNavRoot(ctx.navNames[0]);
			}
		  } finally {
			Status.isCaptureHistory = true;
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

