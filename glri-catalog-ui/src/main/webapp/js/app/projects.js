GLRICatalogApp.service('Projects', 
[function(){
	var CONTACT_PRINCIPAL = "Principal Investigator";
	var CONTACT_CHIEF     = "Associate Project Chief";
	var CONTACT_ORG       = "Cooperator/Partner";
	var CONTACT_TEAM      = "Contact";
	
	var allowedSpatialValues = ["Has Spatial", "No Spatial"];
	var allowedEntryTypeValues = ["New Project", "Project Update"];
	var allowedDurationValues = ["Single effort (1 year or less)", "Short term (2 to 5 years)", "Long term (greater than 5 years)"];
	
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
		
	var VOCAB_FOCUS    = "category/Great%20Lakes%20Restoration%20Initiative/GLRIFocusArea";
	var VOCAB_KEYWORD  = "GLRI/keyword";
	var VOCAB_SIGL     = "category/Great%20Lakes%20Restoration%20Initiative/SiGLProjectObjective";
	var VOCAB_TEMPLATE = "category/Great%20Lakes%20Restoration%20Initiative/GLRITemplates";
	var VOCAB_WATER    = "category/Great%20Lakes%20Restoration%20Initiative/GLRIWaterFeature";
	var VOCAB_SPATIAL = "category/Great%20Lakes%20Restoration%20Initiative/GLRISpatialLocation";
	var VOCAB_DURATION = "category/Great%20Lakes%20Restoration%20Initiative/GLRIProjectDuration";
	
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
			if(tags[tag].trim().length > 0)
			{
				commaTags.push( createTag(scheme, tags[tag].trim()) );
			}
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
		var spatial   = createTag(VOCAB_SPATIAL,data.spatial);
		var entryType = createTag(VOCAB_KEYWORD,data.entryType);
		var duration  = createTag(VOCAB_DURATION,data.duration);
		
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
		var contactsList = [].concat(data.principal, data.chiefs, data.organizations, data.contacts);
		
		//Strip out any JSON added by Angular
		return JSON.parse(angular.toJson(contactsList));
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
		extractContact(sbContacts, glriProj, "principal", CONTACT_PRINCIPAL);
		extractContact(sbContacts, glriProj, "chiefs", CONTACT_CHIEF);
		extractContact(sbContacts, glriProj, "organizations", CONTACT_ORG);
		extractContact(sbContacts, glriProj, "contacts", CONTACT_TEAM);
	};
	
	ctx.buildNewProject = function(data) {
		//Build required data			
		var body = buildBodyString(data);
		var tags = buildTags(data);
		var contacts = buildContacts(data);
				
		//Initial Structure holds all required data
		var newProject = {
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
					dateString: data.startDate.toISOString().slice(0,10),
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
		if (data.id) {
			newProject.id = data.id;
		}
		
		var endDate   = {};
		if (data.endDate) { // TODO validation after start and year or full date
			endDate = {
				type: "End",
				dateString: data.endDate.toISOString().slice(0,10),
				label: "Project End Date"
			};
			
			newProject.dates.push(endDate);
		}
		
		var webLinks = {};
		if (data.image && data.image.trim().length > 0){	
			webLinks = [
				{
					title: "Thumbnail",
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
		if(sbProj.hasOwnProperty("webLinks")){
			for(var i = 0; i < sbProj.webLinks.length; i++) {
				var link = sbProj.webLinks[i];
				if(link.type == "browseImage") {
					glriProj.image = link.uri;
				}
			}
		}
		
		//find start/end dates
		for(var i = 0; i < sbProj.dates.length; i++) {
			var dt = sbProj.dates[i];
			if(dt.type == "Start") {
				glriProj.startDate = new Date(dt.dateString);
				glriProj.startDateNg = new Date(dt.dateString);
				
				//Fix date timezones
				glriProj.startDate.setMinutes(glriProj.startDate.getMinutes() + glriProj.startDate.getTimezoneOffset());
				glriProj.startDateNg.setMinutes(glriProj.startDate.getMinutes() + glriProj.startDateNg.getTimezoneOffset());
			}
			if(dt.type == "End") {
				glriProj.endDate = new Date(dt.dateString);
				glriProj.endDateNg = new Date(dt.dateString);
				
				//Fix date timezones
				glriProj.endDate.setMinutes(glriProj.endDate.getMinutes() + glriProj.endDate.getTimezoneOffset());
				glriProj.endDateNg.setMinutes(glriProj.endDateNg.getMinutes() + glriProj.endDateNg.getTimezoneOffset());
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
		extractTag(tags, glriProj, "spatial", VOCAB_SPATIAL, allowedSpatialValues);
		extractTag(tags, glriProj, "entryType", VOCAB_KEYWORD, allowedEntryTypeValues);
		extractTag(tags, glriProj, "duration", VOCAB_DURATION, allowedDurationValues);
		
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