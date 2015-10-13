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
//	  $scope.transient = {templates: [{key:'1',display:'foo', sort:'2'},{key:'2',display:'bar',sort:'0'}] };
	
	$scope.save = function() {
		console.log($scope.newProject);
	}
}]);
