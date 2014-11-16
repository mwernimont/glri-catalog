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


GLRICatalogApp.directive("glriFocusArea",
['$http', 'Status', 'ProjectManager', 'ScienceBase', 'Nav',
function($http, Status, ProjectManager, ScienceBase, Nav) {
	
	return {
		restrict   : 'E', //AEC
		replace    : true,
		transclude : true,
		templateUrl: '/glri-catalog/browse/templates/contentFocusArea.html',
		scope      : {}, //isolated scope
		
		controller : function($scope) {
			
			$scope.baseQueryUrl  = Status.CONST.BASE_QUERY_URL;
			$scope.status        = Status;

			
			$scope.showDetail = function() {
				return angular.isDefined(Status.currentItem);
			}
			$scope.showList = function() {
				return ! $scope.showDetail();
			}
			
			
			$scope.selectProject = function(projectItem) {
				ProjectManager.setProjectDetail(projectItem);
				
				// TODO this might not be necessary any longer with the addition of 'all' focus area
				// Nav to browse should automatically be Browse/all
				if ( Nav.isNav('Browse') ) {
					Nav.setNavAdd('all')
				}
				
				Nav.doNavAdd(projectItem.id)
			}
			
		}
	}
}]);


GLRICatalogApp.directive("glriPublications",
['Status',
function(status) {

	return {
		restrict   : 'E', //AEC
		replace    : true,
		transclude : true,
		scope      : true, // sub-scope
		templateUrl: '/glri-catalog/browse/templates/contentPublications.html',
		
		link : function($scope, $el, $attrs) {
			$scope.publications  = status.allPublications
		}
	}	
}]);


GLRICatalogApp.directive("glriAsianCarp",[function(){
	return {
		restrict   : 'E', //AEC
		replace    : true,
		transclude : true,
		scope      : true,
		templateUrl: '/glri-catalog/browse/templates/contentAsianCarp.html',
	}		
}]);


GLRICatalogApp.directive("glriInvasive",[function(){
	return {
		restrict   : 'E', //AEC
		replace    : true,
		transclude : true,
		scope      : true,
		templateUrl: '/glri-catalog/browse/templates/contentInvasive.html',
	}		
}]);


GLRICatalogApp.directive("glriProjectLists",[function(){
	return {
		restrict   : 'E', //AEC
		replace    : true,
		transclude : true,
		scope      : true,
		templateUrl: '/glri-catalog/browse/templates/contentProjectLists.html',
	}		
}]);


GLRICatalogApp.directive("glriNavHome",[function(){
	return {
		restrict   : 'E', //AEC
		replace    : true,
		transclude : true,
		scope      : true,
		templateUrl: '/glri-catalog/browse/templates/navHome.html',
	}	
}]);


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
}]);


}) ();
