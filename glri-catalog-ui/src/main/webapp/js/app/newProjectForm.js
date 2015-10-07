$(document).ready(function() {
	  $('.datepickers').datepicker({
		    todayBtn      : true,
		    autoclose     : true,
		    todayHighlight: true,
		    startView     : 'year',
		    format        : "mm-dd-yyyy",
	  });
	
	  $("#dmPlan").select2Buttons({noDefault: true});
	  $("#project_status").select2Buttons({noDefault: true});
	  $("#duration").select2Buttons({noDefault: true});
	  $("#entry_type").select2Buttons({noDefault: true});
	  $("#spatial").select2Buttons({noDefault: true});

	  $("#focus_area").select2Buttons({noDefault: true});
	  
	  $("#templates").select2({placeholder: "Select funding templates",});
	  $("#sigl").select2({placeholder: "Select SiGL keywords",});
	  $("#water").select2({placeholder: "Select Water Bodies",});
});

var GLRINewProjectApp = angular.module('GLRINewProjectApp', []);

GLRINewProjectApp.value('LOOKUPS', {
	Water_Features: "https://www.sciencebase.gov/vocab/53d178fde4b0536257c34170?/termsformat=json",
	Focus_Areaa: "https://www.sciencebase.gov/vocab/53ab40fee4b0282c77bc73c7/terms?format=json",
	Templates: "https://www.sciencebase.gov/vocab/53da7288e4b0fae13b6deb73/terms?format=json",
	SiGL_Keywords: "https://www.sciencebase.gov/vocab/53b43ce9e4b03f6519cab96c/terms?format=json",
});


GLRINewProjectApp.controller('NewProjectCtrl',
['$scope', '$http', 'LOOKUPS', 
function($scope, $http, LOOKUPS) {
	$scope.newProject = {};
	$scope.save = function() {
		console.log($scope.newProject);
	}
}]);
