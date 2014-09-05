(function() {

GLRICatalogApp.directive("glriHome",[function(){
	return {
		restrict   : 'E', //AEC
		replace    : true,
		transclude : true,
		scope      : true,
		templateUrl: 'templates/contentHome.html',
	}	
}])

GLRICatalogApp.directive("glriDetail",[function(){
	return {
		restrict   : 'E', //AEC
		replace    : true,
		transclude : true,
		scope      : true,
		templateUrl: 'templates/contentBrowseDetail.html',
	}	
}])

GLRICatalogApp.directive("glriRecords",[function(){
	return {
		restrict   : 'E', //AEC
		replace    : true,
		transclude : true,
		scope      : true,
		templateUrl: 'templates/contentRecords.html',
	}	
}])

GLRICatalogApp.directive("glriAsianCarp",[function(){
	return {
		restrict   : 'E', //AEC
		replace    : true,
		transclude : true,
		scope      : true,
		templateUrl: 'templates/contentAsianCarp.html',
	}		
}])

GLRICatalogApp.directive("glriInvasive",[function(){
	return {
		restrict   : 'E', //AEC
		replace    : true,
		transclude : true,
		scope      : true,
		templateUrl: 'templates/contentInvasive.html',
	}		
}])
GLRICatalogApp.directive("glriProjectLists",[function(){
	return {
		restrict   : 'E', //AEC
		replace    : true,
		transclude : true,
		scope      : true,
		templateUrl: 'templates/contentProjectLists.html',
	}		
}])

		

GLRICatalogApp.directive("glriNavHome",[function(){
	return {
		restrict   : 'E', //AEC
		replace    : true,
		transclude : true,
		scope      : true,
		templateUrl: 'templates/navHome.html',
	}	
}])

}) ()
