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

GLRICatalogApp.directive("glriFocusArea",[function(){
	return {
		restrict   : 'E', //AEC
		replace    : true,
		transclude : true,
		scope      : true, // sub-scope
		templateUrl: '/glri-catalog/browse/templates/contentFocusArea.html',
		
		link : function($scope, $el, $attrs) {
			if ($attrs.focusArea==='all') {
				$scope.focusArea = 'all'
				$scope.projects  = $scope.transient.allProjects
			} else {
				$scope.focusArea = $scope.transient.focusAreas[$attrs.focusArea]
				$scope.projects  = $scope.transient.focusAreas[$attrs.focusArea].items
			}
		}
	}	
}])

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
