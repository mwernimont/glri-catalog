'use strict';

GLRICatalogApp.service('Nav', 
['$http', '$location', 'Status', 'FocusAreaManager', '$rootScope', 'ScienceBase', 'RecordManager',
function($http, $location, Status, FocusAreaManager, $rootScope, ScienceBase, RecordManager) {
	var DEFAULT_FOCUS_AREA = "all";
	
	var ctx = this;
	
	//Top level navigation tabs
	ctx.navNames = ['Home','Browse','Search']; 
	ctx.navBrowseCategories = ['Projects', "Publications"];
	
	ctx.isBasePath = function(path) {
		return $location.path().startsWith("/" + path);
	}
	
	ctx.isAtPath = function(path) {
		return $location.path().endsWith(path) || $location.path().endsWith(path + "/")
	}
	
	ctx.navBrowseCategory = function(cat) {
		if(cat == "Projects") {
			ctx.setPath("Browse")
		} else {
			ctx.setPath("Publications")
		}
	}
	
	ctx.setFocusArea = function(focusArea) {
		ctx.setPath("Browse/" + focusArea);
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

	ctx.setPath = function(path) {
		$location.path(path);
		ga('send', 'pageview', {'page': '/glri/#/'+path})
	}
	
	ctx.addPath = function(part) {
		var currentPath = $location.path();
		if(!currentPath.endsWith("/")) {
			currentPath += "/";
		}
		currentPath += part;
		ctx.setPath(currentPath);
	}
	
	/**
	 * Note, most of this method is doing custom rerouting under certain circumstances. The default case is to do nothing
	 * and let Angular route to the directive. Most functionality in this entire service involving changing view state should
	 * be moved to their respective directives.
	 */
	ctx.doNav = function() {
		Status.isCaptureHistory = false;
		
		//reset any custom nav renderings
		$('#navBrowse .glri-navbtn-Browse').removeClass('active')
		
		try {
			var parts = $location.path().split(/\/+/);
			var basePath = parts.length > 1 ? parts[1] : '';
			
			switch(basePath) {
			case '':
				ctx.setPath("Home");
				break;
			case 'Publications':
				ctx.goPubsList(parts);
				break;
			case 'Browse':
				ctx.goBrowse(parts);
				break;
			default:
			}
		} finally {
			Status.isCaptureHistory = true;
		}
	}

	ctx.goPubsList = function(parts) {
		ctx.setActiveCategory("Publications")
	}
	
	ctx.goBrowse = function(parts) {
		var rootIndex = 1;
		ctx.setActiveCategory("Projects")
		
		switch(parts.length) {
		case 4: var id = parts[rootIndex + 2];
			var focusArea = parts[rootIndex + 1];
			FocusAreaManager.activate(focusArea);
			ScienceBase.getItemPromise(id).success(function(data, status, headers, config) {
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
			ctx.setFocusArea(DEFAULT_FOCUS_AREA);
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

