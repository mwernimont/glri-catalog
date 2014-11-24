'use strict';

GLRICatalogApp.service('RecordManager', 
['Status', 'ScienceBase',
function(Status, ScienceBase) {
	
	var ctx = this;
	

	ctx.setProjectDetail = function(projectItem) {
		Status.currentItem = projectItem;
		ScienceBase.loadChildItems(projectItem)
		
		if ( window.location.href.indexOf('locahost')===-1 ) {
			if ( isDefined(projectItem) 
			  && isDefined(projectItem.title) ) {
				ga('send', 'screenview', {
					'screenName': projectItem.id +":"+ projectItem.title
				});
			}
		} else {
			console.log("localhost - bipass ga submit"); 
		}
	}
	
}]);



GLRICatalogApp.directive('projectRecord',
[
function() {
	return {
		restrict   : 'E', //AEC
		replace    : true,
		transclude : true,
		scope      : true,
		templateUrl: 'templates/project-record.html',
		
		controller : function($scope) {
			
		}
	}	
}]);
