(function() {

// nice utility directive
GLRICatalogApp.directive('preventDefault', function() {
	return function(scope, element, attrs) {
		$(element).click(function(event) {
			event.preventDefault();
			event.stopPropagation();
		});
	}
})
	
	
GLRICatalogApp.directive("glriHome",[function(){
	return {
		restrict   : 'E', //AEC
		replace    : true,
		transclude : true,
		scope      : true,
		templateUrl: 'templates/contentHome.html',
	}	
}])


GLRICatalogApp.directive("glriProjectDetail",['Status', 'Nav', function(status, nav){
	return {
		restrict   : 'E', //AEC
		replace    : true,
		transclude : true,
		scope      : {},
		templateUrl: 'templates/contentProjectDetail.html',
		
		controller : function($scope) {
			$scope.record = status.currentItem;
			$scope.nav = nav;
		}
	}	
}])


GLRICatalogApp.directive("glriFocusArea",
['Status', 'RecordManager', 'Nav', 'FocusAreaManager',
function(Status, RecordManager, nav, FocusAreaManager) {
	
	return {
		restrict   : 'E', //AEC
		replace    : true,
		transclude : true,
		templateUrl: 'templates/contentFocusArea.html',
		scope      : {}, //isolated scope
		
		controller : function($scope) {
			
			$scope.baseQueryUrl  = Status.CONST.BASE_QUERY_URL;
			$scope.status        = Status;
			$scope.nav			= nav;
			
			
			$scope.currentFocusArea = function() {
				return FocusAreaManager.currentFocusArea;
			}

			
			$scope.showDetail = function() {
				return isDefined(Status.currentItem);
			}
			$scope.showList = function() {
				return ! $scope.showDetail();
			}
			
			
			$scope.selectProject = function(projectItem) {
				RecordManager.setProjectDetail(projectItem);
				$scope.nav.addPath(projectItem.id)
			}
			
		}
	}
}]);


GLRICatalogApp.directive("glriPublications",
['Status', 'FocusAreaManager',
function(status, FocusAreaManager) {

	return {
		restrict   : 'E', //AEC
		replace    : true,
		transclude : true,
		scope      : true, // sub-scope
		templateUrl: 'templates/contentPublications.html',
		
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
		templateUrl: 'templates/contentAsianCarp.html',
	}		
}]);


GLRICatalogApp.directive("glriInvasive",[function(){
	return {
		restrict   : 'E', //AEC
		replace    : true,
		transclude : true,
		scope      : true,
		templateUrl: 'templates/contentInvasive.html',
	}		
}]);


GLRICatalogApp.directive("glriProjectLists",[function(){
	return {
		restrict   : 'E', //AEC
		replace    : true,
		transclude : true,
		scope      : true,
		templateUrl: 'templates/contentProjectLists.html',
	}		
}]);


GLRICatalogApp.directive("glriNavHome",[function(){
	return {
		restrict   : 'E', //AEC
		replace    : true,
		transclude : true,
		scope      : true,
		templateUrl: 'templates/navHome.html',
	}	
}]);


GLRICatalogApp.directive("glriLoading",['$parse', function($parse){
	return {
		restrict   : 'E', //AEC
		replace    : true,
		transclude : true,
		scope      : true, // sub-scope
		templateUrl: 'templates/glriLoading.html',
		
		link : function($scope, $el, $attrs) {
			$scope.isLoading = $parse($attrs.state)() === 'loading'

			$scope.$watch($attrs.state, function(foo) {
				$scope.isLoading = (foo === 'loading')
			})
		}
	}	
}]);


GLRICatalogApp.directive("glriNavSearch",['$parse', function($parse){
	return {
		restrict   : 'E', //AEC
		replace    : true,
		transclude : true,
		scope      : true, // sub-scope
		templateUrl: 'templates/navSearch.html',
		
		link : function($scope, $el, $attrs) {
//			$scope.isLoading = $parse($attrs.state)() === 'loading'
//
//			$scope.$watch($attrs.state, function(foo) {
//				$scope.isLoading = (foo === 'loading')
//			})
		}
	}	
}]);



GLRICatalogApp.directive("glriSearch",['$parse', function($parse){
	return {
		restrict   : 'E', //AEC
		replace    : true,
		transclude : true,
		scope      : true, // sub-scope
		templateUrl: 'templates/contentSearch.html',
		
		link : function($scope, $el, $attrs) {
//			$scope.isLoading = $parse($attrs.state)() === 'loading'
//
//			$scope.$watch($attrs.state, function(foo) {
//				$scope.isLoading = (foo === 'loading')
//			})
		}
	}	
}]);


//custom string date model instead of default date object impl
GLRICatalogApp.directive('uibDatepickerPopup', function (){
 return {
     restrict: 'EAC',
     require: 'ngModel',
     link: function(scope, elem, attrs, ngModel) {
         ngModel.$parsers.push(function toModel(date) {
         	var strDate = "";
         	if (date && typeof date === 'object') {
         		strDate = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
         	}
//         	console.log(strDate);
         	return strDate;
         });
     }
 }
});

}) ();
