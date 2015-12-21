$(document).ready(function() {
	// do not perform select2buttons actions during unit tests
	if ($("#dmPlan").length) {
	  $("#dmPlan").select2Buttons({noDefault: true});
	  $("#project_status").select2Buttons({noDefault: true});
	  $("#duration").select2Buttons({noDefault: true});
	  $("#entry_type").select2Buttons({noDefault: true});
	  $("#spatial").select2Buttons({noDefault: true});
	}
});


// custom string date model instead of default date object impl
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
//            	console.log(strDate);
            	return strDate;
            });
        }
    }
});


GLRICatalogApp.controller('NewProjectCtrl', 
['$scope', '$http', 'Status', 'ScienceBase',
function($scope, $http, Status, ScienceBase) {
	$scope.contactPattern = /^[\w\s]+ [\w\d\.]+@[\w\d]+\.\w+$/;
	$scope.newProject = {};
	$scope.login = {message:"",username:"",password:""}
	$scope.dateOptions = {
		  };	
	
	$scope.transient= Status;
	$scope.status = {showStart:false, showFinish:false, mode:'year'}
	
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
	}
	$('.form-date').change(function(event) {
		onDateChangeEvent(event.target);
	});
	var listenToDateClicks = function(field) {
		$(field+' .dropdown-menu button').click(function(){
//			console.log('click')
			setTimeout(function(){
				listenToDateClicks('.startDate')
				listenToDateClicks('.endDate')
			});
			onDateChangeEvent($(field+' input'));
		});
	}
	$scope.showCalendar = function(which) {
		if ('start'===which) { // TODO could be tightened up OOP
			$scope.status.showStart = !$scope.status.showStart
		} else if ('finish'===which) {
			$scope.status.showFinish = !$scope.status.showFinish
		}
		setTimeout(function(){
			listenToDateClicks('.startDate')
			listenToDateClicks('.endDate')
		});
	}
	
	
	var authFailed = window.authFailed = function() {
		$.cookie("JOSSO_TOKEN", null);
		$scope.login.token   = undefined;
		$scope.login.message = "Login failed, please varify your email and password.";
	}
	
	var authSuccess = function(token) {
		$scope.login.token = token
		var date = new Date();
		date.setTime(date.getTime() + (120 * 60 * 1000)); 
		$.cookie("JOSSO_TOKEN", token, { expires: date });
		$scope.newProject.username = $scope.login.username
	}
	
	$scope.authenticate = function() {
		$scope.login.message = "Authenticating...";
		
		$http.post('login',{},{params: {username:$scope.login.username, password:$scope.login.password}})
		.then(
			function(resp) {
				if ( ! resp.data || resp.data.length != 32) {
					authFailed();
				} else {
					authSuccess(resp.data)
				}
			},
			authFailed
		);
	}
	
	$scope.discard = function() {
		$scope.newProject = {};
	}

	
	var saveFailed = function(resp) {
		alert("There was a problem saving the project -> " + resp.data);
	}
	
	var scrollTo = function(el) {
		var container  = $('body')
	    var scrollToIt = $(el);
		var scrollTop = {
		    scrollTop: scrollToIt.parent().parent().offset().top-5
		}
		
		container.animate(scrollTop);
		
		return scrollTop.scrollTop
	}
	
	
	var displayMsg = function(clas,loc) {
		$("."+clas).css('top',loc+5).delay(500).fadeIn(500);
		setTimeout(function() {$("."+clas).fadeOut(500);}, 5000);
	}

	var checkRequiredFields = function() {
		var requiredFields = $('.form-required');
		
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
					var loc = scrollTo(field);
					displayMsg("form-msg-required", loc);
					return false;
				}
			}
		}
		return true;
	}
	
	
	$scope.save = function() {
		console.log($scope.newProject);

		if ("agree" !== $scope.newProject.dmPlan) {
			var loc = scrollTo($("#dmPlan"));
			displayMsg("form-msg-agree", loc);
		} else {
			if ( ! checkRequiredFields() ) {
				return;
			}
				
			var newProject = buildNewProject($scope.newProject);
			
			console.log(newProject);
			checkToken();
			if ($scope.login.token === undefined) {
				var loc = scrollTo($('#newProjectForm'));
				return;
			}
			
			$http.post('saveProject', newProject, {params:{auth:$scope.login.token}})
			.then(
				function(resp) {
					console.log(resp.data)
					if (resp.data === undefined) {
						saveFailed({data:"no response"})
					} else if (resp.data.indexOf("Missing") >= 0) {
						saveFailed(resp)
					} else {
						window.location = "index.jsp#/Browse/all/"+resp.data
					}
				},
				saveFailed
			)
		}
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
	
	var checkToken = function() {
		var token = $.cookie("JOSSO_TOKEN")
		if (token !== undefined && token.length==32) {
			$scope.login.token = token
		} else {
			$scope.login.token = undefined
		}
	}
	
	checkToken();
}]);


var concatIfExists = function(label, additional) {
	if (additional && additional.length>1) {
		return label + additional;
	}
	return "";
}


var parseContact = function(contact) {
	var name  = ""
	var email = contact.match(/\S+@\S+/);
	if (email && email[0]) {
		email = email[0]
		name  = contact.replace(email,'').trim();
	}
	if ( name!==undefined && name.length>1
			&& email!==undefined && email.length>=5 ) {
		return {name:name, email:email}
	}
	return undefined
}


var splitComma = function(text) {
	if (text === undefined || typeof text !== 'string') {
		return []
	}
	return text.split(/\s*,\s*/);
}


var CONTACT_PRINCIPAL = "Principal Investigator"
var CONTACT_CHIEF     = "Associate Project Chief"
var CONTACT_ORG       = "Cooperator/Partner"
var CONTACT_TEAM      = "Contact"

var createContact = function(type, contact) {
	var contact = parseContact(contact)
	
	if (contact === undefined) {
		return ""
	}
	
	contact.active = true
	contact.type = type
	contact.contactType= "person"
	if (CONTACT_ORG === type) {
		contact.contactType= "organization"
	}
	
	return angular.toJson(contact)
}

var createContacts = function(type, contacts) {
	var contacts = splitComma(contacts)
	
	var jsonContacts = []
	for (var c=0; c<contacts.length; c++) {
		jsonContacts.push( createContact(type, contacts[c]) )
	}
	return concatStrings(jsonContacts)
}

var VOCAB_FOCUS    = "category/Great%20Lakes%20Restoration%20Initiative/GLRIFocusArea"
var VOCAB_KEYWORD  = "GLRI/keyword"
var VOCAB_SIGL     = "category/Great%20Lakes%20Restoration%20Initiative/SiGLProjectObjective"
var VOCAB_TEMPLATE = "category/Great%20Lakes%20Restoration%20Initiative/GLRITemplates"
var VOCAB_WATER    = "category/Great%20Lakes%20Restoration%20Initiative/GLRIWaterFeature"

	
var createTag = function(scheme, name) {
	if (scheme === undefined) {
		scheme = "";
	}
	if (name === undefined) {
		name = "";
	}
	var tag =
		'{'+
		    '"type": "Label",'+
		    '"scheme": "https://www.sciencebase.gov/vocab/'+scheme+'",'+
		    '"name": "'+name+'"'+
		'}'
	return tag;
}
// split and process many tags separated by comma
var concatTagsComma = function(scheme, tags) {
	tags = splitComma(tags)
	
	var commaTags = []
	for (var tag=0; tag<tags.length; tag++) {
		commaTags.push( createTag(scheme, tags[tag].trim()) )
	}
	return concatStrings(commaTags)
}
// select form control creates an object of multiple select values
var concatTagsSelect = function(scheme, tags) {
	if (!tags) {
		return ""
	}
	var selectTags = []
	for (var tag=0; tag<tags.length; tag++) {
		selectTags.push( createTag(scheme, tags[tag].display) )
	}
	return concatStrings(selectTags)
}

var concatStrings = function(strings) {
	var sep = ""
	var all = ""
	for (var c=0; c<strings.length; c++ ) {
		if (strings[c] === "") continue
		all += sep + strings[c]
		sep = ","
	}
	return all
}

var buildBody = function(data) {
	var body = "";
	body += concatIfExists("<h4>Description of Work<\/h4> ", data.work);
	body += concatIfExists("<h4>Goals &amp; Objectives<\/h4> ", data.objectives);
	body += concatIfExists("<h4>Relevance &amp; Impact<\/h4> ", data.impact);
	body += concatIfExists("<h4>Planned Products<\/h4> ", data.product);
	return body
}

var buildTags = function(data) {
	// single entry tags
	var focus     = createTag(VOCAB_FOCUS,data.focusArea);
	var spatial   = createTag(VOCAB_KEYWORD,data.spatial);
	var entryType = createTag(VOCAB_KEYWORD,data.entryType);
	var duration  = createTag(VOCAB_KEYWORD,data.duration);
	// comma separated tags
	var keywords  = concatTagsComma(VOCAB_KEYWORD,data.keywords);
	// multi-select tags
	var sigl      = concatTagsSelect(VOCAB_SIGL,data.SiGL);
	var water     = concatTagsSelect(VOCAB_WATER,data.water);
	var templates = concatTagsSelect(VOCAB_TEMPLATE,data.templates);

	return concatStrings([focus, keywords, sigl, water, templates, spatial, entryType, duration])
}

var buildContacts = function(data) {
	var principal = createContacts(CONTACT_PRINCIPAL,data.principal);
	var chief     = createContacts(CONTACT_CHIEF,data.chief);
	var orgs      = createContacts(CONTACT_ORG,data.organizations ||""); // optional
	var contacts  = createContacts(CONTACT_TEAM,data.contacts ||""); // optional
	return concatStrings([principal, chief, orgs, contacts]);
}


var buildNewProject = function(data) {
	
	var body = buildBody(data);
	var tags = buildTags(data);
	var contacts = buildContacts(data);
	
	var endDate   = "";
	if (data.endDate) { // TODO validation after start and year or full date
		endDate =
        ',{'+
	        '"type": "End",'+
	        '"dateString": "'+data.endDate+'",'+
	        '"label": "Project End Date"'+
        '}'
	}
	
	
	var newProject =
	'{'+
	    '"title": "' +data.title+ '",'+
	    '"summary": "",'+
	    '"body": "' +body+ '",'+
	    '"purpose": "' +data.purpose+ '",'+
	    '"parentId": "52e6a0a0e4b012954a1a238a",'+
	    '"contacts": [' + contacts + '],'+
	    '"browseCategories": ["Project"],'+
	    '"tags": [' + tags + ',' +
	       '{"name": "Great Lakes Restoration Initiative"},'+
	       '{"type": "Creater","name": "'+ data.username +'"}'+
	    '],'+
	    '"dates": ['+
	        '{'+
	            '"type": "Start",'+
	            '"dateString": "'+data.startDate+'",'+
	            '"label": "Project Start Date"'+
	        '}'+ endDate +
	    '],'+
	    '"facets": ['+
	        '{'+
	            '"projectStatus": "'+data.status+'",'+
	            '"projectProducts": [],'+
	            '"parts": [],'+
	            '"className": "gov.sciencebase.catalog.item.facet.ProjectFacet"'+
	        '}'+
	    '],'+
	    '"previewImage": {'+
	        '"thumbnail": {'+
	            '"uri": "'+data.image+'",'+
	            '"title": "Thumbnail"'+
	        '},'+
	        '"small": {'+
	            '"uri": "'+data.image+'",'+
	            '"title": "Thumbnail"'+
	        '},'+
	        '"from": "webLinks"'+
	    '}'+
    '}'
	
	return newProject
}
