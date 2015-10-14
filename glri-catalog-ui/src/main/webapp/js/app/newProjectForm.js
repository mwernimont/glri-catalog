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
		
/**	  
	  $("#templates").select2({placeholder: "Select funding templates",});
	  $("#sigl").select2({placeholder: "Select SiGL keywords",});
	  $("#water").select2({placeholder: "Select Water Bodies",});
*/
});


GLRICatalogApp.controller('NewProjectCtrl', 
['$scope', '$http', 'Status', 'ScienceBase',
function($scope, $http, Status, ScienceBase) {
	$scope.newProject = {};
	
	$scope.transient= Status;
	
	$scope.save = function() {
		console.log($scope.newProject);
	}
	
	var select2focusArea = function(){
		if ( Status.focus_areas.length > 1 ) {
			var options = "";
			for (f in Status.focus_areas) { // value=" + focus.display + "
				options += "<option>"+Status.focus_areas[f].display+"</option>"
			}
			$("#focus_area").html(options);
			$("#focus_area").select2Buttons({noDefault: true});
		} else {
			setTimeout(select2focusArea,100);
		}
	}
	setTimeout(select2focusArea,100)
	
	
}]);
