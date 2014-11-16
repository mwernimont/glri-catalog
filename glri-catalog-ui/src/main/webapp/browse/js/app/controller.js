'use strict';


GLRICatalogApp.controller('CatalogCtrl',
['$scope', '$http', '$filter', 'Status', 'Nav', 'FocusAreaManager', 'ScienceBase',
function($scope, $http, $filter, Status, Nav, FocusAreaManager, ScienceBase) {

	$scope.nav        = Nav;
	$scope.status     = Status;
	$scope.focusAreas = FocusAreaManager.areasByType;	
	
	// the display order set by the stake holder
	$scope.focusAreaOrder =  FocusAreaManager.displayOrder;
		
	
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
		Nav.setNavRoot('Browse')
		Nav.doNavAdd(focusArea);
		FocusAreaManager.activate(focusArea);
	}
	
	
	$scope.loadedFocusAreas = function(focusArea) {
 		return angular.isDefined(focusArea) 
 			&& angular.isDefined(FocusAreaManager.areasByType[focusArea])
 			&& angular.isDefined(FocusAreaManager.areasByType[focusArea].items)
 			&& FocusAreaManager.areasByType[focusArea].items.length>0
 	}
	
	
	$scope.menuClick = function(tabName) {
		if (tabName==='Home') {
			Status.currentItem = undefined;
		}
		if ( angular.isDefined(tabName) ) {
			ga('send', 'screenview', {
				  'screenName': tabName
			});
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