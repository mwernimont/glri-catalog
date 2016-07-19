'use strict';

GLRICatalogApp.filter('publicationFocusAreaFilter', function() {

	// In the return function, we must pass in a single parameter which will be the data we will work on.
	// We have the ability to support multiple other parameters that can be passed into the filter optionally
	return function(publications, currentProjectList, focusArea) {
		if(!focusArea || focusArea.name == "All") {
			return publications
		} else {
			var filteredPublications = [];
			
			var currentProjects = []
			for(var i = 0; i < currentProjectList.length; i++) {
				var project =  currentProjectList[i].id;

				if(currentProjects.indexOf(project) < 0) {
					currentProjects.push(project)
				}
			}
			
			//TODO figure out how to link a publication to a project for the purposes of filtering

			return filteredPublications;
		}
	}

});

GLRICatalogApp.controller('CatalogCtrl',
['$scope', 'Status', 'Nav', 'FocusAreaManager', 'ScienceBase',
function($scope, Status, Nav, FocusAreaManager, ScienceBase) {

	$scope.nav            = Nav;
	$scope.status         = Status;
	$scope.focusAreas     = FocusAreaManager.areasByType;	
	
	// the display order set by the stake holder
	$scope.focusAreaOrder = FocusAreaManager.displayOrder;
		
	
	$scope.$on('do-ofNoteClick', function(event, args) {
		$scope.ofNoteClick(args.ofNote)
	});
	
	
	$scope.$on('do-scopeApply', function(event, args) {
		setTimeout(function(){$scope.$apply()},10)
	});

	
	$scope.ofNoteClick = function(ofNote) {
		Nav.setNavRoot('Home');
		Nav.doNavAdd(ofNote);
	}
	
	
	$scope.focusAreaClick = function(focusArea) {
		Nav.setFocusArea(focusArea);
		FocusAreaManager.activate(focusArea);
		Nav.updateFocusAreas(focusArea);
	}
	
	$scope.loadedFocusAreas = function(focusArea) {
 		return isDefined(focusArea) 
 			&& isDefined(FocusAreaManager.areasByType[focusArea])
 			&& isDefined(FocusAreaManager.areasByType[focusArea].items)
 			&& FocusAreaManager.areasByType[focusArea].items.length>0
 	}
	
	
	$scope.menuClick = function(tabName) {
		if (tabName==='Home') {
			Status.currentItem = undefined;
		}
	}	
	
	
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

	
	// Called at the bottom of this JS file
	var init = function() {
		Nav.doNav(true);
		ScienceBase.loadProjectLists();
	}
	

	init();
}]);