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
});


GLRICatalogApp.controller('NewProjectCtrl', 
['$scope', '$http', 'Status', 'ScienceBase',
function($scope, $http, Status, ScienceBase) {
	$scope.contactPattern = /^[\w\s]+ [\w\d\.]+@[\w\d]+\.\w+$/;
	$scope.transient = {};
	$scope.newProject = {};
	
	$scope.transient= Status;
	
	$scope.discard = function() {
		$scope.newProject = {};
	}
	
	$scope.save = function() {
		console.log($scope.newProject);

		if ("agree" !== $scope.newProject.dmPlan) {
			alert("You must agree to the Data Managment Plan in order to submit a new GLRI Project.");
		} else {
			
			var newProject = buildNewProject($scope.newProject);
			
			console.log(newProject);
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
		name  = contact.replace(email[0],'').trim();
	}
	if ( name!==undefined && name.length>1 &&
			email!==undefined && email[0]!==undefined && email[0].length>=5 ) {
		return {name:name, email:email[0]}
	}
	return undefined
}


var splitComma = function(text) {
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

var concatContacts = function(type, contacts) {
	var contacts = splitComma(contacts)
	
	var jsonContacts = ""
	for (var c=0; c<contacts.length; c++) {
		jsonContacts += createContact(type, contacts[s])
	}
	return jsonContacts + ","
}
/* sample contact details
		      {
		         "name": "Kurt P Kowalski",
		         "oldPartyId": 5668,
		         "type": "Principal Investigator",
		         "contactType": "person",
		         "email": "kkowalski@usgs.gov",
		         "active": true,
		         "jobTitle": "Research Ecologist",
		         "firstName": "Kurt",
		         "middleName": "P",
		         "lastName": "Kowalski",
		         "organization": {
		            "displayText": "Great Lakes Science Center"
		         },
		         "primaryLocation": {
		            "name": "Kurt P Kowalski/BRD/USGS/DOI - Primary Location",
		            "buildingCode": "BDA",
		            "faxPhone": "7349948780",
		            "streetAddress": {
		               "line1": "1451 Green Rd",
		               "city": "Ann Arbor",
		               "state": "MI",
		               "zip": "48105",
		               "country": "US"
		            },
		            "mailAddress": {
		               "line1": "1451 Green Road",
		               "city": "Ann Arbor",
		               "state": "MI",
		               "zip": "48105",
		               "country": "USA"
		            }
		         }
		      },
		      {
		         "name": "Russell M Strach",
		         "oldPartyId": 15119,
		         "type": "Associate Project Chief",
		         "contactType": "person",
		         "email": "rstrach@usgs.gov",
		         "active": true,
		         "jobTitle": "Center Director",
		         "firstName": "Russell",
		         "middleName": "M",
		         "lastName": "Strach",
		         "organization": {
		            "displayText": "Great Lakes Science Center"
		         },
		         "primaryLocation": {
		            "name": "Russell M Strach/BRD/USGS/DOI - Primary Location",
		            "buildingCode": "BDA",
		            "faxPhone": "7342147201",
		            "streetAddress": {
		               "line1": "1451 Green Rd",
		               "city": "Ann Arbor",
		               "state": "MI",
		               "zip": "48105",
		               "country": "US"
		            },
		            "mailAddress": {
		               "line1": "1451 Green Road",
		               "city": "Ann Arbor",
		               "state": "MI",
		               "zip": "48105",
		               "country": "USA"
		            }
		         }
		      },
		      {
		         "name": "Great Lakes Science Center",
		         "oldPartyId": 17264,
		         "type": "Lead Organization",
		         "contactType": "organization",
		         "active": true,
		         "aliases": [
		            "GREAT LAKES SCIENCE CENTER",
		            "GREAT LAKES SCI CTR"
		         ],
		         "fbmsCodes": [
		            "GGEMND0000"
		         ],
		         "logoUrl": "http://my.usgs.gov/static-cache/images/dataOwner/v1/logosMed/USGSLogo.gif",
		         "smallLogoUrl": "http://my.usgs.gov/static-cache/images/dataOwner/v1/logosSmall/USGSLogo.gif",
		         "organization": {},
		         "primaryLocation": {
		            "name": "Great Lakes Science Center [BDA]",
		            "buildingCode": "BDA",
		            "streetAddress": {
		               "line1": "1451 Green Rd",
		               "city": "Ann Arbor",
		               "state": "MI",
		               "zip": "48105",
		               "country": "USA"
		            },
		            "mailAddress": {
		               "line1": "1451 Green Road",
		               "city": "Ann Arbor",
		               "state": "MI",
		               "zip": "48105",
		               "country": "USA"
		            }
		         }
		      },
		      {
		         "name": "Michigan Tech Research Institute",
		         "type": "Cooperator/Partner",
		         "contactType": "organization",
		         "organization": {},
		         "primaryLocation": {
		            "streetAddress": {},
		            "mailAddress": {}
		         }
		      },
		      {
		         "name": "U.S. Fish and Wildlife Service",
		         "oldPartyId": 18274,
		         "type": "Cooperator/Partner",
		         "contactType": "organization",
		         "active": true,
		         "logoUrl": "http://www.fws.gov/home/graphics/logo2005.gif",
		         "organization": {},
		         "primaryLocation": {
		            "name": "U.S. Fish and Wildlife Service - Location",
		            "streetAddress": {},
		            "mailAddress": {}
		         }
		      }
 */	

var VOCAB_FOCUS    = "category/Great%20Lakes%20Restoration%20Initiative/GLRIFocusArea"
var VOCAB_KEYWORD  = "GLRI/keyword"
var VOCAB_SIGL     = "category/Great%20Lakes%20Restoration%20Initiative/SiGLProjectObjective"
var VOCAB_TEMPLATE = "category/Great%20Lakes%20Restoration%20Initiative/GLRITemplates"
var VOCAB_WATER    = "category/Great%20Lakes%20Restoration%20Initiative/GLRIWaterFeature"

	
var createTag = function(scheme, name) {
	var tag =
		'{'+
		'    "type": "Label",'+
		'    "scheme": "https://www.sciencebase.gov/vocab/'+scheme+'",'+
		'    "name": "'+name+'"'+
		'},'
	return tag;
}
var concatTagsComma = function(scheme, tags) {
	tags = splitComma(tags)
	
	var commaTags = ""
	for (var tag=0; tag<tags.length; tag++) {
		commaTags += createTag(scheme, tags[tag].trim())
	}
	return commaTags
}
var concatTagsSelect = function(scheme, tags) {
	var selectTags = ""
	for (var tag=0; tag<tags.length; tag++) {
		selectTags += createTag(scheme, tags[tag].display)
	}
	return selectTags
}


var buildNewProject = function(data) {
	
	var body = "";
	body += concatIfExists("<h4>Description of Work<\/h4> ", data.work);
	body += concatIfExists("<h4>Goals &amp; Objectives<\/h4> ", data.objectives);
	body += concatIfExists("<h4>Relevance &amp; Impact<\/h4> ", data.impact);
	body += concatIfExists("<h4>Planned Products<\/h4> ", data.product);
	
	var principal = concatContacts(CONTACT_PRINCIPAL,data.principal);
	var chief     = concatContacts(CONTACT_CHIEF,data.chief);
	var orgs      = concatContacts(CONTACT_ORG,data.organizations);
	var contacts  = concatContacts(CONTACT_TEAM,data.contacts);
	
	var focus     = concatTagsComma(VOCAB_FOCUS,data.focusArea);
	var keywords  = concatTagsComma(VOCAB_KEYWORD,data.keywords);
	var spatial   = concatTagsComma(VOCAB_KEYWORD,data.spatial);
	var entryType = concatTagsComma(VOCAB_KEYWORD,data.entryType);
	var duration  = concatTagsComma(VOCAB_KEYWORD,data.duration);
	
	var sigl      = concatTagsSelect(VOCAB_SIGL,data.SiGL);
	var water     = concatTagsSelect(VOCAB_WATER,data.water);
	var templates = concatTagsSelect(VOCAB_TEMPLATE,data.templates);

	var newProject =
	'{'+
	'	   "title": "' +data.title+ '",'+
	'	   "summary": "",'+
	'	   "body": "' +body+ '",'+
	'	   "purpose": "' +data.purpose+ '",'+
	'	   "parentId": "52e6a0a0e4b012954a1a238a",'+
	'	   "contacts": [' + principal + chief + orgs + contacts + '],'+
	'	   "browseCategories": ["Project"],'+
	'	   "tags": [' + focus+ keywords + sigl + water + templates + spatial + entryType + duration +
	'	      {'+
	'	         "name": "Great Lakes Restoration Initiative"'+
	'	      }'+
	'	   ],'+
	'	   "dates": ['+
	'	      {'+
	'	         "type": "Start",'+
	'	         "dateString": "'+data.startDate+'",'+
	'	         "label": "Project Start Date"'+
	'	      },'+
	'	      {'+
	'	         "type": "End",'+
	'	         "dateString": "'+data.endDate+'",'+
	'	         "label": "Project End Date"'+
	'	      }'+
	'	   ],'+
	'	   "facets": ['+
	'	      {'+
	'	         "projectStatus": "'+data.status+'",'+
	'	         "projectProducts": [],'+
	'	         "parts": [],'+
	'	         "className": "gov.sciencebase.catalog.item.facet.ProjectFacet"'+
	'	      }'+
	'	   ],'+
	'	   "previewImage": {'+
	'	      "thumbnail": {'+
	'	         "uri": "'+data.image+'",'+
	'	         "title": "Thumbnail"'+
	'	      },'+
	'	      "small": {'+
	'		     "uri": "'+data.image+'",'+
	'	         "title": "Thumbnail"'+
	'	      },'+
	'	      "from": "webLinks"'+
	'	   },'+
    '}'	
	
	return newProject
}
