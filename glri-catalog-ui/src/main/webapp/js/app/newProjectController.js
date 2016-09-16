GLRICatalogApp.controller('ProjectCtrl', 
['$scope', '$http', '$filter', '$location', 'Status', 'ScienceBase', "Projects", "FocusAreaManager",
function($scope, $http, $filter, $location, Status, ScienceBase, projectsService, focusAreaManager) {
	$scope.contactPattern = /^[\w\s]+ [\w\d\.]+@[\w\d]+\.\w+$/;
	$scope.project = {
		principal: [
			
		],
		chiefs: [
			
		],
		contacts: [
			
		],
		organizations: [
			
		],
		tags: [
			
		]
	};
	
	$scope.startDateMode = 'day';
	$scope.startDateFormat = 'yyyy-MM-dd';
	$scope.endDateMode = 'day';
	$scope.endDateFormat = 'yyyy-MM-dd';
	
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
	var dateRx2 = new RegExp(/^\d\d\d\d\/\d\d\/\d\d$/);
	
	var onDateChangeEvent = function(target) {		
		var value = $(target).val();
				
		//Erase invalid dates
		if(!validDate(value)) {
			var date = "";
		} else {
			var date = new Date(value);
			date.setMinutes(date.getMinutes() + date.getTimezoneOffset());
		}
		
		var model = $(target).attr("model").split('.');
		$scope[model[0]][model[1]] = date;
	};
	
	var validDate = function(value){
		if (yearRx.test(value) || dateRx.test(value) || dateRx2.test(value)) {
			return true;
		}
		return false;
	};
	
	$('.form-date').change(function(event) {
		onDateChangeEvent(event.target);
	});
	
	$scope.updateDateFormat = function(type, format){
		if(type === "start"){
			$scope.startDateFormat = format;
			$scope.project.startDateNg = $scope.project.startDate;
		} else if(type === "finish") {
			$scope.endDateFormat = format;
			$scope.project.endDateNg = $scope.project.endDate;
		}
	};
	
	var listenToDateClicks = function(field) {
		$(field+' .dropdown-menu button').click(function(){
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
		window.location = "index.jsp#/Browse/all/";
	};
	
	$scope.addContact = function(target, type) {
		var contactType = "person";
		
		if(type === "Cooperator/Partner"){
			contactType = "organization";
		}
		
		target.push({
			active: true,
			name: "", 
			email: "", 
			type: type, 
			contactType: contactType});
	};
	
	$scope.removeContact = function(target, index, required) {
		var type = target[index].type;
		target.splice(index, 1);
		
		if(required && target.length === 0){
			$scope.addContact(target, type);
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
		if(element === undefined || element.length === 0){
			return null;
		}
		
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
		
		var absPos = vPos - parentVertPos - msgElement.height()*3;
		
		msgElement.css('top',absPos).fadeIn(400);
		setTimeout(function() {msgElement.fadeOut(400);}, 7000);
	};

	var doValidation = function(form) {
		
		//Do required fields first
		var requiredFields = $('.form-required');
		
		//Handle default required field validation
		for (var f=0; f<requiredFields.length; f++) {
			var field = requiredFields[f];
			var modelBinding = $(field).attr('model') // have to check for the custom date field first
			if (!modelBinding) {
				modelBinding = $(field).attr('ng-model');
			}
			if (modelBinding !== undefined) {
				var model = modelBinding.split('.')
				var value = $scope[model[0]][model[1]]
				if (value === undefined || value.length === 0) {
					scrollTo(field);
					displayMsg("form-msg-required", field);
					$(field).css('border', '2px solid red');
					setTimeout(function() {
						$(field).css('border', '1px solid #ccc');
					},7100);
					return false;
				}
			}
		}
		
		//Make sure body fields do not include h4 start/end tags
		var h4ErrorField;
		angular.forEach(projectsService.getBodyFieldMappings(), function(mapping) {
			var value = $scope.project[mapping.dataField];
			if(value.toLowerCase().indexOf("<h4>") >= 0 || value.toLowerCase().indexOf("</h4>") >= 0) {
				h4ErrorField = $("textarea[ng-model='project."+mapping.dataField+"']")
			}			
		});
		if(h4ErrorField) {
			scrollTo(h4ErrorField);
			displayMsg("form-msg-no-h4", h4ErrorField);
			return false;
		}
				
		//Handle additional required field validation that is not covered by above		
		if(!form.$valid && form.$error){
			for(var key in form.$error){
				if(key !== "date"){
					if(Array.isArray(form.$error[key])){
						var name = form.$error[key][0].$name;
						var elem = angular.element("[name='" + name + "']");
						if(elem !== undefined && elem.length > 0){
							//Proper highlighting for radio selections
							if(elem.attr("uib-btn-radio") !== undefined && elem.attr("uib-btn-radio").length > 0){
								if(elem.parent() !== undefined && elem.parent().length > 0)
								{
									elem = elem.parent();
									elem.css('border-radius', '4px');
									setTimeout(function() {
										elem.css('border', '2px solid white');
									},7100);
								}
							} else {
								setTimeout(function() {
									elem.css('border', '1px solid #ccc');
								},7100);
							}
							
							elem.css('border', '2px solid red');
							scrollTo(elem);							
							
							if(key === "email") {
								displayMsg("form-msg-email", elem);
							} else if(key === "url") {
								displayMsg("form-msg-url", elem);
							} else {
								displayMsg("form-msg-required", elem);
							}
						}
						return false;
					}
				}
			}
		}
		
		//Additional Validation Error that was not caught by the above
		if(!form.$valid){
			var elem = angular.element("#save");
			displayMsg("form-msg-other", elem);
			return false;
		}
		
		return true;
	};
	
	$scope.save = function(form) {
		if ("agree" !== $scope.project.dmPlan) {
			var field = $("#dmPlan");
			scrollTo(field);
			displayMsg("form-msg-agree", field);
			return;
		}
		if ( ! doValidation(form) ) {
			return;
		}
		
		var glriNewProject = projectsService.buildNewProject($scope.project);
		var project = undefined;
				
		if($scope.editMode){
			project = applyJSONChanges(glriNewProject, $scope.cleanSbProject);
		} else {
			project = glriNewProject;
		}
		
		console.log(project);
		
		$http.post('saveProject', project)
		.then(
			function(resp) {
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
		);
	};
		
	var applyJSONChanges = function(changes, original) {
		var returnJson = JSON.parse(JSON.stringify(original));
		
		//Clean contact information that is empty before sending to ScienecBase
		cleanContacts(changes);
		
		//Apply array changes
		for (var key in changes) {
			if (changes.hasOwnProperty(key)) {
				if(returnJson.hasOwnProperty(key)) {
					if(!Array.isArray(changes[key]) && !Array.isArray(returnJson[key])){
						returnJson[key] = changes[key];
					} else {
						returnJson[key] = changes[key].concat(original[key]);
					}
				} else {
					returnJson[key] = changes[key];
				}
			}
		}
		
		//Remove JSON that is used only by GLRI or that will be regenerated by ScienceBase
		if(returnJson.hasOwnProperty("userCanEdit")){
			delete returnJson["userCanEdit"];
		}
		
		if(returnJson.hasOwnProperty("contactText")){
			delete returnJson["contactText"];
		}
		
		if(returnJson.hasOwnProperty("contactHtml")){
			delete returnJson["contactHtml"];
		}
		
		if(returnJson.hasOwnProperty("provenance")){
			delete returnJson["provenance"];
		}
		
		if(returnJson.hasOwnProperty("previewImage")){
			delete returnJson["previewImage"];
		}
		
		if(returnJson.hasOwnProperty("systemType")){
			delete returnJson["systemType"];
		}
		
		if(returnJson.hasOwnProperty("childRecordState")){
			delete returnJson["childRecordState"];
		}
		
		if(returnJson.hasOwnProperty("publications")){
			delete returnJson["publications"];
		}
		
		if(returnJson.hasOwnProperty("url")){
			delete returnJson["url"];
		}
		
		if(returnJson.hasOwnProperty("browseImage")){
			delete returnJson["browseImage"];
		}
		
		if(returnJson.hasOwnProperty("resource")){
			delete returnJson["resource"];
		}
				
		if(returnJson.hasOwnProperty("hasChildren")){
			delete returnJson["hasChildren"];
		}
		
		if(returnJson.hasOwnProperty("link")){
			delete returnJson["link"];
		}
		
		if(returnJson.hasOwnProperty("relatedItems")){
			delete returnJson["relatedItems"];
		}
		
		if(returnJson.hasOwnProperty("alternateTitles")){
			delete returnJson["alternateTitles"];
		}
				
		if(returnJson.hasOwnProperty("templates")){
			delete returnJson["templates"];
		}
		
		if(returnJson.hasOwnProperty("distributionLinks")){
			delete returnJson["distributionLinks"];
		}
				
		return returnJson;
	};
	
	var cleanContacts = function(project){
		if(project.hasOwnProperty("contacts") && Array.isArray(project.contacts)){
			for(var i=0; i<project.contacts.length; i++){
				var contact = project.contacts[i];
				if(contact.hasOwnProperty("organization") && isEmptyObject(contact.organization)){
					delete contact.organization;
				}
				
				if(contact.hasOwnProperty("primaryLocation")){
				
					var noStreet = false, noMail = false;
					var location = contact.primaryLocation;

					if(location.hasOwnProperty("streetAddress") && isEmptyObject(contact.primaryLocation.streetAddress)){
						noStreet = true;
						delete contact.primaryLocation.streetAddress;
					}

					if(location.hasOwnProperty("mailAddress") && isEmptyObject(contact.primaryLocation.mailAddress)){
						noMail = true;
						delete contact.primaryLocation.mailAddress;
					}

					if(noStreet && noMail) {
						delete contact.primaryLocation;
					}
				}
			}
		}
	};
	
	var isEmptyObject = function(obj){
		for(var prop in obj) {
			if(obj.hasOwnProperty(prop))
				return false;
		}

		return true && JSON.stringify(obj) === JSON.stringify({});
	};
		
	var loadAndBindProject = function(pid) {
		$scope.loading = true;
		ScienceBase.getItemPromise(pid).success(function(data, status, headers, config) {
			$scope.loading = false;	
			setTimeout(function() {
				$scope.sbProject = ScienceBase.processItem(data);
				console.log(JSON.parse(JSON.stringify($scope.sbProject)));
				$scope.project = projectsService.convertToGlriProject($scope.sbProject);
				console.log(JSON.parse(JSON.stringify($scope.project)));
				$scope.cleanSbProject = cleanSBProject();
				console.log(JSON.parse(JSON.stringify($scope.cleanSbProject)));
				$scope.$apply();
			}, 100);
		});
	};
	
	//Helper function to initialize certain parts of the form for new projects
	var initializeNewProject = function() {
		$scope.addContact($scope.project.principal, "Principal Investigator");
		$scope.addContact($scope.project.chiefs, "Associate Project Chief");
	};
	
	//Helper function to remove anything from the arrays of the original SB project that we extracted
	var cleanSBProject = function() {
		var tempProject = projectsService.buildNewProject($scope.project);
		var cleanProject = JSON.parse(JSON.stringify($scope.sbProject));
										
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
		initializeNewProject();
	}
}]);
