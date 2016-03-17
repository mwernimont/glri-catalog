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
	$scope.status = {showStart:false, showFinish:false, mode:'year'};
	
	$scope.validation = {};
	$scope.validation.singleMsg = "";
	
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
		$.cookie("JOSSO_USER", null);
		$scope.login.username   = undefined;
		$scope.newProject.username = undefined;
		$scope.login.message = "Login failed, please varify your email and password.";
	}
	
	var authSuccess = function(user, token) {
		var date = new Date();
		date.setTime(date.getTime() + (120 * 60 * 1000));
 		$.cookie("JOSSO_USER", user, { expires: date });
		$.cookie("JOSSO_TOKEN", token, { expires: date });
		$scope.newProject.username = user
		$scope.login.token = token;
	}
	
	$scope.authenticate = function() {
		$scope.login.message = "Authenticating...";
		
		$http.post('login',{username:$scope.login.username, password:$scope.login.password})
		.then(
			function(resp) {
				if ( ! resp.data || resp.data.length != 32) {
					authFailed();
				} else {
					authSuccess($scope.login.username,resp.data)
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
		setTimeout(function() {$("."+clas).fadeOut(500);}, 10000);
	}

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
					var loc = scrollTo(field);
					displayMsg("form-msg-required", loc);
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
					var response = parseAndRemoveOneUrl(value);
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
						var loc = scrollTo(field);
						displayMsg("form-msg-validate", loc);
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
						msg = parseSinglePersonContact(value);
					} else if ($(field).hasClass("multi-person")) {
						msg = parsePersonContacts(value);
					} else if ($(field).hasClass("single-organization")) {
						msg = parseSingleOrganizationContact(value);
					} else if ($(field).hasClass("multi-organization")) {
						msg = parseOrganizationContacts(value);
					}
					
					if (typeof msg == 'string') {
						$scope.validation.singleMsg = msg;
						var loc = scrollTo(field);
						displayMsg("form-msg-validate", loc);
						return false;
					}
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
			return;
		}
		if ( ! doValidation() ) {
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
					saveFailed({data:"no response"});
				} else if (resp.data.indexOf("Missing") >= 0) {
					saveFailed(resp);
				} else if (resp.data.indexOf('JSONObject["id"] not found') >=0) {
					saveFailed({
						data:"The submission failed for an unknown reason. " +
							"Please double check the submission fields and try again. " +
							"If the problem persists, email the Page Contact, listed at the bottom of the page."});
				} else {
					window.location = "index.jsp#/Browse/all/"+resp.data
				}
			},
			saveFailed
		)	
	};
	
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
		var user = $.cookie("JOSSO_USER")
		if (token !== undefined && token.length==32) {
			$scope.login.token = token
			$scope.login.username = user
			$scope.newProject.username = user
		} else {
			$scope.login.token = undefined
			$scope.newProject.username = undefined
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

/*
 * @See parseContacts
 * @param {type} contactStr
 * @returns {Array|String|undefined}
 */
var parsePersonContacts = function(contactStr) {
	return parseContacts(contactStr, parseSinglePersonContact);
};

/*
 * @See parseContacts
 * @param {type} contactStr
 * @returns {Array|String|undefined}
 */
var parseOrganizationContacts = function(contactStr) {
	return parseContacts(contactStr, parseSingleOrganizationContact);
};

/*
 * Parses a list of comma delimited contacts, passing each piece to the singleItemParseFunction.
 * 
 * For successful parses, an array of contacts are returned, the requirements and
 * structure of each item is determined by the passed singleItemParseFunction.
 * 
 * If The string is empty, all whitespace, or undefined, an empty array is returned.
 * If any contact results in a parse error, a String validation message is returned
 * instead of an array.
 * 
 * @param String contactStr Comma delimited contact string
 * @param function singleItemParseFunction Function used to parse a single contact.
 * @returns {Array|String|undefined}
 */
var parseContacts = function(contactStr, singleItemParseFunction) {
	
	//initial cleanup / empty check
	if (contactStr == undefined) return [];
	contactStr = contactStr.trim();
	if (contactStr.length == 0) return [];
	
	var contactStrArray = contactStr.split(",");
	var contacts = new Array();
	for (var i =0; i<contactStrArray.length; i++) {
		var single = singleItemParseFunction(contactStrArray[i]);
		
		if (typeof single == 'string') {
			return single;	//this is a validation message
		} else {
			contacts.push(single);
		}
	}
	
	return contacts;
};

/* Returns an object with name and email fields if the contact can be parsed.
 * For successful parses, an object is returned as {name,email}.
 * Both name and email are required.  Multiple emails are not allowed.
 * Returns a string w/ a validation message if it cannot parse.
 */
var parseSinglePersonContact = function(contactStr) {
	var parsedStr = contactStr;	//preserve org for validation msgs
	var name  = "";
	var msgSuffix = "Individual contacts are separated by commas.";
	
	if (parsedStr.indexOf(",") > -1) {
		return "Only one entry is allowed for the contact '" + contactStr + "'. " + msgSuffix;
	}
	
	//Find, store and removed an email address
	var emailParseResponse = parseAndRemoveOneEmail(parsedStr);
	parsedStr = emailParseResponse.remain;
	if (! emailParseResponse.isOk) {
		return emailParseResponse.errorMsg + " - For contact '" + contactStr + "'. " + msgSuffix;	
	}
	
	if (parsedStr.match(/@+/)) {
		return "Something looks like an email address for the contact '" + contactStr + "'. " + msgSuffix;
	}
	
	name = parsedStr;	//everything else has been carved out of the str.
	
	
	if (name==undefined || name.length == 0) {
		return "No contact name was found for contact '" + contactStr + "'. " + msgSuffix;
	} else if (name.length <= 1) {
		return "A contact name longer than a single character is required for '" + contactStr + "'. " + msgSuffix;
	} else if (emailParseResponse.value == undefined) {
		return "No email was found for contact '" + contactStr + "'. " + msgSuffix;
	} else {
		return {name:name, email:emailParseResponse.value};
	}
};

/* Returns an object with name, email and url fields if the contact can be parsed.
 * For successful parses, an array of contacts are returned, each as {name,email,url}.
 * Name is required, as well as either or both an email or url.
 * Multiple emails and urls are not allowed.
 * Returns a string w/ a validation message if it cannot parse.
 */
var parseSingleOrganizationContact = function(contactStr) {
	var parsedStr = contactStr;	//preserve org for validation msgs
	var name  = "";
	var msgSuffix = "Individual organizations are separated by commas.";
	
	if (parsedStr.indexOf(",") > -1) {
		return "Only one entry is allowed for the contact '" + contactStr + "'. " + msgSuffix;
	}
	
	//Find, store and removed an email address
	var emailParseResponse = parseAndRemoveOneEmail(parsedStr);
	parsedStr = emailParseResponse.remain;
	if (! emailParseResponse.isOk) {
		return emailParseResponse.errorMsg + " - For organization '" + contactStr + "'. " + msgSuffix;	
	}
	
	//Find, store and removed a url
	var urlParseResponse = parseAndRemoveOneUrl(parsedStr);
	parsedStr = urlParseResponse.remain;
	if (! urlParseResponse.isOk) {
		return urlParseResponse.errorMsg + " - For organization '" + contactStr + "'. " + msgSuffix;	
	}
	
	if (parsedStr.match(/@+/)) {
		return "Something looks like an email address for the organization '" + contactStr + "'. " + msgSuffix;
	}
	
	name = parsedStr;	//everything else has been carved out of the str.
	
	
	
	if (name==undefined || name.length == 0) {
		return "No name was found for the organization '" + contactStr + "'. " + msgSuffix;
	} else if (name.length <= 1) {
		return "An organization name longer than a single character is required for '" + contactStr + "'. " + msgSuffix;
	} else {
		var contact = new Object();
		contact.name = name;
		if (emailParseResponse.value) { contact.email = emailParseResponse.value; }
		if (urlParseResponse.value) { contact.logoUrl = urlParseResponse.value; }
		return contact;
	}
};

/* Parses an email out of a text string and returns an object.
 * The response object has these properties:
 * *original: The original text passed to this method
 * *isOk: true if parsing succeeded w/o error.  The value may still be undefined, however.
 * *remain: The remaining portion of original after removing url. Same as source if nothing found or parse error.
 * *value: The url that was found in the original.  If no url was found value will be undefined.
 * *errorMsg:  If isOk is false, this will contain an explination of the error for the user.  Undef otherwise.
 */
parseAndRemoveOneEmail = function(sourceStr) {
	
	var parseResponse = {
		original: sourceStr,
		isOk: false,	/* assume failure */
		remain: sourceStr,	/* assume nothing parsed out */
		value: undefined,
		errorMsg: undefined
	};
	
	//Find, store and removed a url
	//Check that potential urls don't contained '@', which would be a failed email match
	var email = sourceStr.match(/\b\S+@\S+\.\S+\b/g);
	if (email) {
		if (email.length == 1) {
			email = email[0];
			
			if (email.length>=6) {
				//Carve out the url that we found
				parseResponse.remain  = sourceStr.replace(email,'').trim();

				parseResponse.isOk = true;
				parseResponse.value = email;
			} else {
				parseResponse.errorMsg = "The email address '" + email + "' looks too short to be an email";
			}
		} else {
			parseResponse.errorMsg = "Only one email address is allowed";
		}
	} else {
		//No url found
		parseResponse.isOk = true;
	}
	
	if (parseResponse.isOk && parseResponse.remain.match(/@/g)) {
		//Ugh.  Things were fine, but something looks url-ish in the remainder
		parseResponse.errorMsg = "Something looks like an invalid email address";
		parseResponse.value = undefined;
		parseResponse.isOk = false;	//reset
		parseResponse.remain  = sourceStr;	//reset
	}
	
	return parseResponse;
};

/* Parses a url out of a text string and returns an object.
 * The response object has these properties:
 * *original: The original text passed to this method
 * *isOk: true if parsing succeeded w/o error.  The value may still be undefined, however.
 * *remain: The remaining portion of original after removing url. Same as source if nothing found or parse error.
 * *value: The url that was found in the original.  If no url was found value will be undefined.
 * *errorMsg:  If isOk is false, this will contain an explination of the error for the user.  Undef otherwise.
 */
parseAndRemoveOneUrl = function(sourceStr) {
	
	var parseResponse = {
		original: sourceStr,
		isOk: false,	/* assume failure */
		remain: sourceStr,	/* assume nothing parsed out */
		value: undefined,
		errorMsg: undefined
	};
	
	//Find, store and removed a url
	//Check that potential urls don't contained '@', which would be a failed email match
	var url = sourceStr.match(/\b(?:http|https):\/\/[^\s@]+\.[^\s@]+\b/g);
	if (url) {
		if (url.length == 1) {
			url = url[0];
			
			if (url.length >= 11) {
				//Carve out the url that we found
				parseResponse.remain  = sourceStr.replace(url,'').trim();

				parseResponse.isOk = true;
				parseResponse.value = url;
			} else {
				parseResponse.errorMsg = "The url '" + url + "' looks too short to be a url";
			}
		} else {
			parseResponse.errorMsg = "Only one url is allowed";
		}
	} else {
		//No url found
		parseResponse.isOk = true;
	}
	
	if (parseResponse.isOk && parseResponse.remain.match(/[^\s@]+\.[^\s@]+/g)) {
		//Ugh.  Things were fine, but something looks url-ish in the remainder
		parseResponse.errorMsg = "Something looks like an invalid url";
		parseResponse.value = undefined;
		parseResponse.isOk = false;	//reset
		parseResponse.remain  = sourceStr;	//reset
	}
	
	return parseResponse;
};

var splitComma = function(text) {
	if (text === undefined || typeof text !== 'string') {
		return []
	}
	return text.split(/\s*,\s*/);
}


var CONTACT_PRINCIPAL = "Principal Investigator";
var CONTACT_CHIEF     = "Associate Project Chief";
var CONTACT_ORG       = "Cooperator/Partner";
var CONTACT_TEAM      = "Contact";

/**
 * Populates the 'fill in' values of contact objects and returns a JSON string.
 * @param {type} type
 * @param {type} contact
 * @returns {String}
 */
var createContact = function(type, contact) {
	
	if (contact === undefined) {
		return "";
	}
	
	contact.active = true;
	contact.type = type;
	contact.contactType= "person";
	if (CONTACT_ORG === type) {
		contact.contactType= "organization";
	}
	
	return angular.toJson(contact);
};

/**
 * Parses a contact string, which may contain may contacts, into a JSON string
 * 
 * @param {type} type
 * @param {type} contactsStr
 * @returns {String}
 */
var createContacts = function(type, contactsStr) {
	var contacts = [];
	
	if (CONTACT_ORG === type) {
		contacts = parseOrganizationContacts(contactsStr);
	} else {
		contacts = parsePersonContacts(contactsStr);
	}
	
	if (typeof contacts == 'string') {
		//Contact string could not be parsed and a validation msg is being returned
		return "";	//validation should have happened separately
	}
	
	var jsonContacts = [];
	for (var c=0; c<contacts.length; c++) {
		jsonContacts.push( createContact(type, contacts[c]) );
	}
	return concatStrings(jsonContacts);
};

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
	var glri      = ""
	if (sigl.indexOf('GLRI') < 0) {
		glri      = createTag(VOCAB_SIGL,"GLRI"); // ensure a default SiGL tag for GLRI if not added
	}
	var water     = concatTagsSelect(VOCAB_WATER,data.water);
	var templates = concatTagsSelect(VOCAB_TEMPLATE,data.templates);

	return concatStrings([focus, keywords, sigl, glri, water, templates, spatial, entryType, duration])
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
	
	var webLink = "";
	if (data.image && data.image.trim().length > 0)
	webLink = ',"webLinks": [{'+
		'"title": "Thumbnail",'+
		'"type": "browseImage",'+
		'"typeLabel": "Browse Image",'+
		'"uri": "'+data.image.trim()+'",'+
		'"hidden": false'+
	'}]';
	
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
	       '{"type": "Creator","name": "'+ data.username +'"}'+
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
	    ']'+ webLink +
    '}'
	
	return newProject
}
