GLRICatalogApp.service('Projects', 
[function(){
	var CONTACT_PRINCIPAL = "Principal Investigator";
	var CONTACT_CHIEF     = "Associate Project Chief";
	var CONTACT_ORG       = "Cooperator/Partner";
	var CONTACT_TEAM      = "Contact";
	
	var ctx = this;
	
	var concatIfExists = function(label, additional) {
		if (additional && additional.length>1) {
			return label + additional;
		}
		return "";
	};
	
	var splitComma = function(text) {
		if (text === undefined || typeof text !== 'string') {
			return [];
		}
		return text.split(/\s*,\s*/);
	};
	
	/**
	 * Populates the 'fill in' values of contact objects and returns a JSON string.
	 * @param {type} type
	 * @param {type} contact
	 * @returns {String}
	 */
	var createContact = function(type, contact) {
		if (contact === undefined) {
			return {};
		}
		
		var newContact = {
			name: contact.name,
			email: contact.email,
			active: true,
			type: type,
			contactType: "person"
		};
		
		if (CONTACT_ORG === type) {
			newContact.contactType= "organization";
		}
		
		return newContact;
	};
	
	/**
	 * Parses a contact string, which may contain may contacts, into a JSON string
	 * 
	 * @param {type} type
	 * @param {type} contactsStr
	 * @returctx.tring}
	 */
	var createContacts = function(type, contactsStr) {
		var contacts = [];
		
		if (CONTACT_ORG === type) {
			contacts = ctx.parseOrganizationContacts(contactsStr);
		} else {
			contacts = ctx.parsePersonContacts(contactsStr);
		}
		
		if (typeof contacts == 'string') {
			//Contact string could not be parsed and a validation msg is being returned
			return "";	//validation should have happened separately
		}
		
		var jsonContacts = [];
		for (var c=0; c<contacts.length; c++) {
			jsonContacts.push(createContact(type, contacts[c]) );
		}
		return jsonContacts;
	};
	
	var VOCAB_FOCUS    = "category/Great%20Lakes%20Restoration%20Initiative/GLRIFocusArea";
	var VOCAB_KEYWORD  = "GLRI/keyword";
	var VOCAB_SIGL     = "category/Great%20Lakes%20Restoration%20Initiative/SiGLProjectObjective";
	var VOCAB_TEMPLATE = "category/Great%20Lakes%20Restoration%20Initiative/GLRITemplates";
	var VOCAB_WATER    = "category/Great%20Lakes%20Restoration%20Initiative/GLRIWaterFeature";
	
	var toFullSchemeUri = function(scheme) {
		return "https://www.sciencebase.gov/vocab/" + scheme;
	};
		
	var createTag = function(scheme, name) {
		if (scheme === undefined) {
			scheme = "";
		}
		if (name === undefined) {
			name = "";
		}
	
		var tag = {
			type: "Label",
			scheme: toFullSchemeUri(scheme),
			name: name
		};
		
		return tag;
	};
	
	// split and process many tags separated by comma
	var concatTagsComma = function(scheme, tags) {
		if (!tags) {
			return [];
		}
		
		tags = splitComma(tags);		
		var commaTags = [];		
		for (var tag=0; tag<tags.length; tag++) {
			commaTags.push( createTag(scheme, tags[tag].trim()) );
		}
		return commaTags;
	};
	
	// select form control creates an object of multiple select values
	var concatTagsSelect = function(scheme, tags) {
		if (!tags) {
			return [];
		}
		
		var selectTags = [];
		for (var tag=0; tag<tags.length; tag++) {
			selectTags.push( createTag(scheme, tags[tag].display) );
		}
		return selectTags;
	};
	
	var buildBodyString = function(data) {
		var body = "";
		body += concatIfExists("<h4>Description of Work<\/h4> ", data.work);
		body += concatIfExists("<h4>Goals &amp; Objectives<\/h4> ", data.objectives);
		body += concatIfExists("<h4>Relevance &amp; Impact<\/h4> ", data.impact);
		body += concatIfExists("<h4>Planned Products<\/h4> ", data.product);
		return body;
	};
	
	var extractBodyValues = function(sbBody, glriProj) {
		extractFromBodyString(sbBody, glriProj, "work", "<h4>Description of Work<\/h4> ");
		extractFromBodyString(sbBody, glriProj, "objectives", "<h4>Goals &amp; Objectives<\/h4> ");
		extractFromBodyString(sbBody, glriProj, "impact", "<h4>Relevance &amp; Impact<\/h4> ");
		extractFromBodyString(sbBody, glriProj, "product", "<h4>Planned Products<\/h4> ");
	};
	 
	var extractFromBodyString = function(sbBody, glriProj, target, label) {
		var result = sbBody;
		var startIndex = sbBody.indexOf(label);
		
		result = result.substring(startIndex + label.length);
		
		var endIndex = result.indexOf("<h4");
		if(endIndex >= 0) {
			result = result.substring(0, endIndex);
		}
		if(result) {
			glriProj[target] = result.trim();
		}
	};
	
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
		var glri      = [];
		
		var glriTag = sigl.filter(function(obj){
			return obj.name === "GLRI";
		});
		
		if (glriTag.length === 0) {
			glri      = createTag(VOCAB_SIGL,"GLRI"); // ensure a default SiGL tag for GLRI if not added
		}
		var water     = concatTagsSelect(VOCAB_WATER,data.water);
		var templates = concatTagsSelect(VOCAB_TEMPLATE,data.templates);
		
		var glriId = {
			name: "Great Lakes Restoration Initiative"
		};
		
		var creator = {
			type: "Creator",
			name: data.username
		};
	
		return [].concat.apply([], [focus, keywords, sigl, glri, water, templates, spatial, entryType, duration, glriId, creator]);
	};
	
	var buildContacts = function(data) {
		var principal = createContacts(CONTACT_PRINCIPAL,data.principal);
		var chief     = createContacts(CONTACT_CHIEF,data.chief);
		var orgs      = createContacts(CONTACT_ORG,data.organizations ||""); // optional
		var contacts  = createContacts(CONTACT_TEAM,data.contacts ||""); // optional
		return [].concat.apply([], [principal, chief, orgs, contacts]);
	};
	
	var extractContact = function(sbContacts, glriProj, target, type) {
		var contactList = [];
		for(var i = 0; i < sbContacts.length; i++) {
			var c = sbContacts[i];
			if(c.type === type) {
				contactList.push(c);
			}
		}
		glriProj[target] = contactList;
	};
	
	var extractContacts = function(sbContacts, glriProj) {
		extractContact(sbContacts, glriProj, "principals", CONTACT_PRINCIPAL);
		extractContact(sbContacts, glriProj, "chiefs", CONTACT_CHIEF);
		extractContact(sbContacts, glriProj, "organizations", CONTACT_ORG);
		extractContact(sbContacts, glriProj, "contacts", CONTACT_TEAM);
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
	
	/*
	 * @See parseContacts
	 * @param {type} contactStr
	 * @returns {Array|String|undefined}
	 */
	ctx.parsePersonContacts = function(contactStr) {
		return parseContacts(contactStr, ctx.parseSinglePersonContact);
	};
	
	/*
	 * @See parseContacts
	 * @param {type} contactStr
	 * @returns {Array|String|undefined}
	 */
	ctx.parseOrganizationContacts = function(contactStr) {
		return parseContacts(contactStr, ctx.parseSingleOrganizationContact);
	};
	
	/* Parses an email out of a text string and returns an object.
	 * The response object has these properties:
	 * *original: The original text passed to this method
	 * *isOk: true if parsing succeeded w/o error.  The value may still be undefined, however.
	 * *remain: The remaining portion of original after removing url. Same as source if nothing found or parse error.
	 * *value: The url that was found in the original.  If no url was found value will be undefined.
	 * *errorMsg:  If isOk is false, this will contain an explination of the error for the user.  Undef otherwise.
	 */
	var parseAndRemoveOneEmail = function(sourceStr) {
		
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
	
	
	/* Returns an object with name and email fields if the contact can be parsed.
	 * For successful parses, an object is returned as {name,email}.
	 * Both name and email are required.  Multiple emails are not allowed.
	 * Returns a string w/ a validation message if it cannot parse.
	 */
	ctx.parseSinglePersonContact = function(contactStr) {
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
	ctx.parseSingleOrganizationContact = function(contactStr) {
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
		var urlParseResponse = ctx.parseAndRemoveOneUrl(parsedStr);
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
	
	
	/* Parses a url out of a text string and returns an object.
	 * The response object has these properties:
	 * *original: The original text passed to this method
	 * *isOk: true if parsing succeeded w/o error.  The value may still be undefined, however.
	 * *remain: The remaining portion of original after removing url. Same as source if nothing found or parse error.
	 * *value: The url that was found in the original.  If no url was found value will be undefined.
	 * *errorMsg:  If isOk is false, this will contain an explination of the error for the user.  Undef otherwise.
	 */
	ctx.parseAndRemoveOneUrl = function(sourceStr) {
		
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
	
	ctx.buildNewProject = function(data) {
		//Build required data
		var id = "";
		
		if (data.id) {
			id = data.id;
		}
		
		var body = buildBodyString(data);
		var tags = buildTags(data);
		var contacts = buildContacts(data);
				
		//Initial Structure holds all required data
		var newProject = {
			id: id,
			title: data.title,
			summary: "",
			body: body,
			purpose: data.purpose,
			parentId: "52e6a0a0e4b012954a1a238a", //TODO what is this ID!? Is it a hardcoded value from a specific data store? || Zack (9/9/16): It's the ID for GLRI in ScienceBase, sets the created item as a child of GLRI
			contacts: contacts,
			browseCategories: ["Project"],
			tags: tags,
			dates: [
				{
					type: "Start",
					dateString: data.startDate,
					label: "Project Start Date"
				}
			],
			facets: [
				{
					projectStatus: data.status,
					projectProducts: [],
					parts: [],
					className: "gov.sciencebase.catalog.item.facet.ProjectFacet"
				}
			]
		};
		
		//Build and append optional data
		var endDate   = {};
		if (data.endDate) { // TODO validation after start and year or full date
			endDate = {
				type: "End",
				dateString: data.endDate,
				label: "Project End Date"
			};
			
			newProject.dates.push(endDate);
		}
		
		var webLinks = {};
		if (data.image && data.image.trim().length > 0){	
			webLinks = [
				{
					title: "Tumbnail",
					type: "browseImage",
					typeLabel: "Browse Image",
					uri: data.image.trim(),
					hidden: false
				}
			];
			
			newProject.webLinks = webLinks;
		}		
		
		return newProject;
	};
	
	var extractTag = function(tags, glriProj, target, scheme, limitToValues) {
		for(var i = 0; i < tags.length; i++) {
			var fullScheme = toFullSchemeUri(scheme);
			if(tags[i].scheme === fullScheme) {
				if(limitToValues) { //only select a value that's also in this list if provided
					for(var v in limitToValues) {
						if(limitToValues[v] === tags[i].name) {
							glriProj[target] = tags[i].name;
							return;
						}
					}
				} else {
					glriProj[target] = tags[i].name;
					return;
				}
			}
		}
	};
	
	var extractTagsAsCsv = function(tags, glriProj, target, scheme, excludeValues) {
		var tagValues = [];
		
		for(var i = 0; i < tags.length; i++) {
			var fullScheme = toFullSchemeUri(scheme);
			if(tags[i].scheme === fullScheme) {
				var tagVal = tags[i].name;
				var exclude = false;
				
				if(excludeValues) {
					for(var j = 0; j < excludeValues.length; j++) {
						if(excludeValues[j] == tagVal) {
							exclude = true;
							break;
						}
					}
				}
				
				if(!exclude) {
					tagValues.push(tagVal)
				}
			}
		}
		
		var tagsAsList = "";
		for(var t in tagValues) {
			tagsAsList += tagValues[t] + ", ";
		}
		tagsAsList = tagsAsList.substring(0, tagsAsList.length-2);
		
		glriProj[target] = tagsAsList;
	};
	
	var extractTagsAsArray = function(tags, glriProj, target, scheme) {
		var tagValues = [];
		
		for(var i = 0; i < tags.length; i++) {
			var fullScheme = toFullSchemeUri(scheme);
			if(tags[i].scheme === fullScheme) {
				var tagVal = tags[i].name;
				tagValues.push({key: tagVal, display: tagVal})
			}
		}
		
		glriProj[target] = tagValues;
	};
	
	var getSelectOptions = function(id) {
		var list = [];
		
		$("#" + id + " option").each(function(){
		    list.push($(this).val());
		});
		return list;
	};
	
	/**
	 * Converts a science base project item into the the json format that is currently
	 * used on the project form. 
	 */
	ctx.convertToGlriProject = function(sbProj) {		
		var glriProj = {
			dmPlan: "agree", //TODO, should users be required to Agree to terms again for edits?
			title: sbProj.title,
			purpose: sbProj.purpose,
			status: sbProj.facets[0].projectStatus,
			id: sbProj.id
		};
		
		//find thumbnail
		for(var i = 0; i < sbProj.webLinks.length; i++) {
			var link = sbProj.webLinks[i];
			if(link.type == "browseImage") {
				glriProj.image = link.uri;
			}
		}
		
		//find start/end dates
		for(var i = 0; i < sbProj.dates.length; i++) {
			var dt = sbProj.dates[i];
			if(dt.type == "Start") {
				glriProj.startDate = dt.dateString;
				glriProj.startDateNg = dt.dateString;
			}
			if(dt.type == "End") {
				glriProj.endDate = dt.dateString;
				glriProj.endDateNg = dt.dateString;
			}
		}
		
		//find creator to get username
		for(var i = 0; i < sbProj.tags.length; i++) {
			var tag = sbProj.tags[i];
			if(tag.type == "Creator") {
				glriProj.username = tag.name;
			}
		}
		
		var tags = sbProj.tags;
		
		extractTag(tags, glriProj, "focusArea", VOCAB_FOCUS);
		extractTag(tags, glriProj, "spatial", VOCAB_KEYWORD, getSelectOptions("spatial"));
		extractTag(tags, glriProj, "entryType", VOCAB_KEYWORD, getSelectOptions("entry_type"));
		extractTag(tags, glriProj, "duration", VOCAB_KEYWORD, getSelectOptions("duration"));
		
		// comma separated keywords
		extractTagsAsCsv(tags, glriProj, "keywords", VOCAB_KEYWORD, [glriProj.spatial, glriProj.entryType, glriProj.duration]);
		
		// multi-select tags
		extractTagsAsArray(tags, glriProj, "SiGL", VOCAB_SIGL);
		extractTagsAsArray(tags, glriProj, "water", VOCAB_WATER);
		extractTagsAsArray(tags, glriProj, "templates", VOCAB_TEMPLATE);
		
		extractBodyValues(sbProj.body, glriProj);
		
		extractContacts(sbProj.contacts, glriProj);
		
		return glriProj;
	};
}]);