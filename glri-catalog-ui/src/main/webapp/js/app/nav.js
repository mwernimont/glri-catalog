'use strict';

GLRICatalogApp.service('Nav', 
['$http', '$location', 'Status', 'FocusAreaManager', '$rootScope', 'ScienceBase', 'RecordManager',
function($http, $location, status, FocusAreaManager, $rootScope, ScienceBase, RecordManager) {
	
	var ctx = this;
	window.Nav = ctx;
	
	ctx.currentNav = undefined;

	//Top level navigation tabs
	ctx.navNames = ['Home','Browse','Search'];
	
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
//		if (detail) {
//			show = show &&   isDefined(status.currentItem);
//		} else {
//			show = show && ! isDefined(status.currentItem);
//		}
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
		status.currentItem = undefined;
		ctx.currentNav = [nav];
	}
	
	ctx.doNavRoot = function(nav) {
		ctx.setNavRoot(nav);
		
		if (nav === 'Browse') {
			FocusAreaManager.activate('all');
		}
		ctx.setPath(ctx.currentNav);
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
		
			status.isCaptureHistory = false;		
		
			if ($location.path() && $location.path().length>2) {
				var parts = location.hash.split(/\/+/);
				
				//remove a possible last empty item - can be caused by a trailing slash
				if (parts.length > 1 && parts[parts.length - 1] == "") {
					parts.splice(-1, 1);
				}
				
				if (parts.length<=1) {
					ctx.doNavRoot('Home');
				}
				if (parts.length==2) {
					ctx.doNavRoot(parts[1]);
				}
				if (parts.length>2) {
					if ($location.path().indexOf('Home')>0) {
						switch(parts.length) {
						case 3: var ofNote = parts[2];
							$rootScope.$broadcast('do-ofNoteClick', { ofNote: ofNote });
							break;
						default:
						}
					}
					if ($location.path().indexOf('Browse')>0) {
						if (init) {
							ctx.setNavRoot('Browse');
						}
						switch(parts.length) {
						case 4: var id = parts[3];
							var focusArea = parts[2];
							FocusAreaManager.activate(focusArea);
							if (init) {
								ctx.setNavAdd(focusArea);
							}
							var url = "https://www.sciencebase.gov/catalog/item/"+id+"?format=json"
							$http.get(url).success(function(data, status, headers, config) {
								var item = ScienceBase.processItem(data);
								RecordManager.setProjectDetail(item);
								$rootScope.$broadcast('do-scopeApply');

							}).error(function(data, status, headers, config) {
								alert("Unable to connect to ScienceBase.gov to find records.");
							});
							break;
						case 3: var focusArea = parts[2]
							FocusAreaManager.activate(focusArea);
							break;
						default:
						}
					}
				}
			} else {
				ctx.doNavRoot(ctx.navNames[0]);
			}
		  } finally {
		  	status.isCaptureHistory = true;
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

