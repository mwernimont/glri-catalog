GLRICatalogApp.controller('ProjectCtrl', 
['$scope', '$http', '$filter', '$location', 'Status', 'ScienceBase', "Projects", "FocusAreaManager",
function($scope, $http, $filter, $location, Status, ScienceBase, projectsService, focusAreaManager) {
	$scope.contactPattern = /^[\w\s]+ [\w\d\.]+@[\w\d]+\.\w+$/;
	$scope.project = {};
	$scope.dateOptions = {
		  };	
	$scope.focusAreas = focusAreaManager.areasByType;
	
	$scope.transient= Status;
	$scope.status = {showStart:false, showFinish:false, mode:'year'};
	
	$scope.validation = {};
	$scope.validation.singleMsg = "";
	
	$scope.editMode = false;
	
	$scope.loading = false;
	
	// custom year accept along with full date format with default impl
	var yearRx = new RegExp(/^\d\d\d\d$/);
	var dateRx = new RegExp(/^\d\d\d\d-\d\d-\d\d$/);
	var onDateChangeEvent = function(target) {
//		console.log(target);
		var value = $(target).val();
		
		if (yearRx.test(value) || dateRx.test(value)) {
			var model = $(target).attr("model").split('.');
			$scope[model[0]][model[1]] = value;
//			console.log(value)
		}
	};
	$('.form-date').change(function(event) {
		onDateChangeEvent(event.target);
	});
	var listenToDateClicks = function(field) {
		$(field+' .dropdown-menu button').click(function(){
//			console.log('click')
			setTimeout(function(){
				listenToDateClicks('.startDate');
				listenToDateClicks('.endDate');
			});
			onDateChangeEvent($(field+' input'));
		});
	};
	$scope.showCalendar = function(which) {
		if ('start'===which) { // TODO could be tightened up OOP
			$scope.status.showStart = !$scope.status.showStart;
		} else if ('finish'===which) {
			$scope.status.showFinish = !$scope.status.showFinish;
		}
		setTimeout(function(){
			listenToDateClicks('.startDate');
			listenToDateClicks('.endDate');
		});
	};
	
	$scope.discard = function() {
		$scope.project = {};
	};
	
	$scope.addContact = function(target, type) {
		target.push({name: "", email: "", type: type});
	};
	
	$scope.removeContact = function(target, index, required) {
		var type = target[index].type;
		target.splice(index, 1);
		
		if(required && target.length === 0){
			target.push({name: "", email: "", type: type});
		}
	};
	
	var saveFailed = function(resp) {
		alert("There was a problem saving the project -> " + resp.data);
	};
	
	/** 
	 * Scolls so that the el component is 200 px down from the top of the screen.
	 * The actual location from the top is passed back (may be less than 200 for
	 * components very close to the top.
	 */
	var scrollTo = function(element) {
		var container  = $('html,body');
	    element = $(element);	//JQuery wrapped element (if not wrapped already)
		var useEl = element;	//actual element offset from (may be a parent element)
		var vPos = 0;	//Vert pixel position to scroll to
		var TOP_OFFSET_GOAL = 200;	//Goal is to make the element be this far down the screen
		
		//useEl = findOffsetParent(jqEl);
		useEl = findVisibleElement(element);
		vPos = useEl.offset().top;
		
		//if the element is to close of top, just scroll to the top.
		if (vPos < TOP_OFFSET_GOAL) {
			vPos = 0;
		} else {
			vPos = vPos - TOP_OFFSET_GOAL;
		}
		
		var scrollTop = {
		    scrollTop: vPos
		};
		
		//container.scrollTop(0);
		container.animate(scrollTop);
	};
	/**
	 * Returns the nearest parent element that is visible (may be this element).
	 * This is needed b/c Angular often hides the nominal input field and wraps
	 * it w/ its own html.  The undisplayed input has no valid position.
	 * 
	 * @param {type} element
	 * @returns {$} Nearest visible element, up the chain (may be element)
	 */
	var findVisibleElement = function(element) {
		//If the element is positioned only relative to the root, hunt for a parent that has position
		element = $(element);
		while (!element.is(':visible') && element.parent() != null) {
			element = element.parent();
		}
		return element;
	};
	
	/**
	 * Displays the div spec'ed by the msgElementId next to refElement
	 */
	var displayMsg = function(msgElementId, refElement) {
		
		var vPos = findVisibleElement(refElement).offset().top;
		
		var msgElement = $('#' + msgElementId);
		
		//The element must be visible before its offset can be calculated...
		msgElement.css('display', 'block');
		
		var msgParent = msgElement.offsetParent();	//Assumes there is only one level of positioned nesting
		var parentVertPos = msgParent.offset().top;
		
		//Turn display off and let it fade in...
		msgElement.css('display', 'none');
		
		var absPos = vPos - parentVertPos;
		
		msgElement.css('top',absPos).delay(500).fadeIn(500);
		setTimeout(function() {msgElement.fadeOut(500);}, 10000);
	};

	var doValidation = function() {
		
		//Do required fields first
		var requiredFields = $('.form-required');
		var contactFields = $('.contact');
		var singleUrlFileds = $('.single-url');
		
		//All required fields handled here, regardless of type
		for (var f=0; f<requiredFields.length; f++) {
			var field = requiredFields[f]
			var modelBinding = $(field).attr('model') // have to check for the custom date field first
			if (!modelBinding) {
				modelBinding = $(field).attr('ng-model')
			}
			if (modelBinding !== undefined) {
				var model = modelBinding.split('.')
				var value = $scope[model[0]][model[1]]
				if (value === undefined || value.length === 0) {
					scrollTo(field);
					displayMsg("form-msg-required", field);
					return false;
				}
			}
		}
		
		//Validate urls only if non-empty (if req'ed, handled above)
		for (var f=0; f<singleUrlFileds.length; f++) {
			var field = singleUrlFileds[f];
			var modelBinding = $(field).attr('model'); // have to check for the custom date field first
			if (!modelBinding) {
				modelBinding = $(field).attr('ng-model');
			}
			if (modelBinding !== undefined) {
				var model = modelBinding.split('.');
				var value = $scope[model[0]][model[1]];
				
				if (value != undefined && value.length != 0) {
					var response = projectsService.parseAndRemoveOneUrl(value);
					var msg = undefined;
					
					if (response.isOk) {
						if (response.value == undefined) {
							msg = "No url was found in this field";
						}
					} else {
						msg = response.errorMsg;
					}
						
					
					if (typeof msg == 'string') {
						$scope.validation.singleMsg = msg;
						scrollTo(field);
						displayMsg("form-msg-validate", field);
						return false;
					}
				}
			}
		}
		
		//Validate contacts only if non-empty (if req'ed, handled above)
		for (var f=0; f<contactFields.length; f++) {
			var field = contactFields[f];
			var modelBinding = $(field).attr('model'); // have to check for the custom date field first
			if (!modelBinding) {
				modelBinding = $(field).attr('ng-model');
			}
			if (modelBinding !== undefined) {
				var model = modelBinding.split('.');
				var value = $scope[model[0]][model[1]];
				
				if (value != undefined && value.length != 0) {
					var msg = null;
					if ($(field).hasClass("single-person")) {
						msg = projectsService.parseSinglePersonContact(value);
					} else if ($(field).hasClass("multi-person")) {
						msg = projectsService.parsePersonContacts(value);
					} else if ($(field).hasClass("single-organization")) {
						msg = projectsService.parseSingleOrganizationContact(value);
					} else if ($(field).hasClass("multi-organization")) {
						msg = projectsService.parseOrganizationContacts(value);
					}
					
					if (typeof msg == 'string') {
						$scope.validation.singleMsg = msg;
						scrollTo(field);
						displayMsg("form-msg-validate", field);
						return false;
					}
				}
			}
		}
		
		return true;
	};
	
	$scope.save = function() {
		if ("agree" !== $scope.project.dmPlan) {
			var field = $("#dmPlan");
			scrollTo(field);
			displayMsg("form-msg-agree", field);
			return;
		}
		if ( ! doValidation() ) {
			return;
		}
				
		var glriNewProject = projectsService.buildNewProject($scope.project);
		var project = undefined;
				
		if($scope.editMode){
			applyJSONChanges(glriNewProject, $scope.cleanSbProject);
			project = $scope.cleanSbProject;
		} else {
			project = glriNewProject;
		}
		
		console.log(project);
		/* Hey would you look at that, disabling posts again
		$http.post('saveProject', project)
		.then(
			function(resp) {
				console.log(resp.data);
				if (resp.data === undefined) {
					saveFailed({data:"No response received from the server"});
				} else if (/^[0-9|a-f]*$/.test(resp.data)) {
					//Success!
					window.location = "index.jsp#/Browse/all/"+resp.data;
				} else {
					saveFailed({
						data:"The submission failed. " +
							"Please double check the project fields and try again. " +
							"If the problem persists, email the Page Contact, listed at the bottom of the page.  " +
							"Here is the response from the server for reference: " + resp.data});
				}
			},
			saveFailed
		);*/
	};
	
	var applyJSONChanges = function(changes, original) {
		for (var key in changes) {
			if (changes.hasOwnProperty(key)) {
				if(original.hasOwnProperty(key)) {
					if(!Array.isArray(changes[key]) && !Array.isArray(original[key])){
						original[key] = changes[key];
					} else {
						original[key] = changes[key].concat(original[key]);
					}
				}
			}
		}
	};
		
	var radiofySelect2 = function() {
		$("#dmPlan").select2Buttons({noDefault: true}).refreshSelect2Button();
		$("#project_status").select2Buttons({noDefault: true}).refreshSelect2Button();
		$("#duration").select2Buttons({noDefault: true}).refreshSelect2Button();
		$("#entry_type").select2Buttons({noDefault: true}).refreshSelect2Button();
		$("#spatial").select2Buttons({noDefault: true}).refreshSelect2Button();
		$("#focus_area").select2Buttons({noDefault: true}).refreshSelect2Button();
	};

	var loadAndBindProject = function(pid) {
		$scope.loading = true;
		ScienceBase.getItemPromise(pid).success(function(data, status, headers, config) {
			$scope.loading = false;	
			setTimeout(function() { //need this timeout to give select2 a chance to render
				$scope.sbProject = ScienceBase.processItem(data);
				console.log($scope.sbProject);
				$scope.project = projectsService.convertToGlriProject($scope.sbProject);
				console.log($scope.project);
				//$scope.cleanSbProject = cleanSBProject();
				//console.log($scope.cleanSbProject);
				$scope.$apply();
				setTimeout(radiofySelect2, 200);
			}, 200);
		});
	};
	
	//Helper function to remove anything from the arrays of the original SB project that we extracted
	var cleanSBProject = function() {
		var tempProject = projectsService.buildNewProject($scope.project);
		var cleanProject = JSON.parse(JSON.stringify($scope.sbProject));
		
		console.log("CONTACT COMPARISON: ");
		console.log(tempProject.contacts);
		console.log(cleanProject.contacts);
				
		for (var key in cleanProject) {
			if (cleanProject.hasOwnProperty(key)) {
				if(tempProject.hasOwnProperty(key)) {
					if(Array.isArray(cleanProject[key]) && Array.isArray(tempProject[key])){
						removeDuplicateObjects(cleanProject[key], tempProject[key]);
					}
				}
			}
		}
		
		return cleanProject;
	};
	
	//Helper function to remove objects from arr1 that also exist in arr2
	var removeDuplicateObjects = function(arr1, arr2){
		for(var i = 0; i < arr1.length; i++){
			var doSplice = false;
			
			for(var j = 0; j < arr2.length; j++){
				var arr1Obj = arr1[i];
				var arr2Obj = arr2[j];				
				
				if(angular.equals(arr1Obj, arr2Obj)){
					doSplice = true;
				}				
			}
			
			if(doSplice){
				arr1.splice(i, 1);
				i--;
			}
		}
	};
		
	//check to see if we have a project ID, if so, load/bind the project data and set this form to edit mode
	var parts = $location.path().split(/\/+/);
	if(parts.length > 2 && parts[2]) {
		$scope.editMode = true;
		var id = parts[2];
		loadAndBindProject(id);
	} else {
		setTimeout(radiofySelect2, 100);
	}
	
	
}]);
