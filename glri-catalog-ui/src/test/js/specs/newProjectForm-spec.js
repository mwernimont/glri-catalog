var findTagsByKeyValue = function(tags, key, value) {
	var entries = []
	for (var t=0; t<tags.length; t++) {
		if (tags[t][key] === value) {
			entries.push( tags[t] )
		}
	}
	return entries
}

var schemeRoot = "https://www.sciencebase.gov/vocab/"

describe("newProjectForm tests", function() {

	describe("splitComma tests", function() {
	    it("properly handles undefined", function() {
	    	var split = splitComma();
	    	expect(typeof split).toBe('object');
	    	expect(split.length).toBe(0);
	    	expect(split).toEqual([]);
	    });
	    it("properly splits string with commas", function() {
	    	var split = splitComma('a,b,c');
	    	expect(split.length).toBe(3);
	    	expect(split).toEqual(['a','b','c']);
	    });
	});	
	
	describe("createTag tests", function() {
	    it("properly handles undefined", function() {
	    	var tag = createTag();
	    	expect(typeof tag).toBe('string');
	    	expect(tag.length).not.toBe(0);
	    	expect(tag.indexOf('undefined')).toBe(-1);
	    	expect(tag.indexOf('"name": ""')).not.toBe(-1);
	    });
	    it("creates a tag", function(){
	    	var tag = createTag("schema1","name1");
	    	expect(typeof tag).toBe('string');
	    	expect(tag.length).not.toBe(0);
	    	expect(tag.indexOf('"scheme": "https://www.sciencebase.gov/vocab/schema1"')).not.toBe(-1);
	    	expect(tag.indexOf('"name": "name1"')).not.toBe(-1);
	    	
	    	var jobj = jQuery.parseJSON(tag);
	    	expect(jobj.name).toBe('name1');
	    	
	    	//{"type": "Label","scheme": "https://www.sciencebase.gov/vocab/schema1","name": "name1"},	    	
	    })
	});	
	
	describe("concatTagsComma tests", function() {
	    it("properly handles undefined", function() {
	    	var concat = concatTagsComma();
	    	expect(typeof concat).toBe('string');
	    	expect(concat.length).toBe(0);
	    	expect(concat).toEqual('');
	    });
	    it("properly handles one selection", function() {
	    	var data = "name1";
	    	
	    	var tag = concatTagsComma("schema1",data);
	    	
	    	expect(typeof tag).toBe('string');
	    	expect(tag.length).not.toBe(0);
	    	expect(tag.indexOf('"scheme": "https://www.sciencebase.gov/vocab/schema1"')).not.toBe(-1);
	    	expect(tag.indexOf('"name": "name1"')).not.toBe(-1);
	    	
	    	var jobj = jQuery.parseJSON(tag);
	    	expect(jobj.name).toBe(data);
	    });
	    it("properly handles many selections", function() {
	    	var data = "name1,name2,name2";
	    	
	    	var tags = concatTagsComma("schema1",data);
	    	
	    	expect(typeof tags).toBe('string');
	    	expect(tags.length).not.toBe(0);
	    	expect(tags.indexOf('"scheme": "https://www.sciencebase.gov/vocab/schema1"')).not.toBe(-1);
	    	expect(tags.indexOf('"name": "name1"')).not.toBe(-1);
	    	
	    	var jobj = jQuery.parseJSON("["+tags+"]");
	    	data = data.split(',')
	    	for (var i=0; i<data.length; i++) {
	    		expect(jobj[i].name).toBe(data[i]);
	    	}
	    });
	});	

	
	describe("concatTagsSelect tests", function() {
	    it("properly handles undefined", function() {
	    	var concat = concatTagsSelect();
	    	expect(typeof concat).toBe('string');
	    	expect(concat.length).toBe(0);
	    	expect(concat).toEqual('');
	    });
	    it("properly handles one selection", function() {
	    	var data = [{display:"name1"}];
	    	
	    	var tag = concatTagsSelect("schema1",data);
	    	
	    	expect(typeof tag).toBe('string');
	    	expect(tag.length).not.toBe(0);
	    	expect(tag.indexOf('"scheme": "https://www.sciencebase.gov/vocab/schema1"')).not.toBe(-1);
	    	expect(tag.indexOf('"name": "name1"')).not.toBe(-1);
	    	
	    	var jobj = jQuery.parseJSON(tag);
	    	expect(jobj.name).toBe(data[0].display);
	    });
	    it("properly handles many selections", function() {
	    	var data = [{display:"name1"},{display:"name2"},{display:"name2"},];
	    	
	    	var tags = concatTagsSelect("schema1",data);
	    	
	    	expect(typeof tags).toBe('string');
	    	expect(tags.length).not.toBe(0);
	    	expect(tags.indexOf('"scheme": "https://www.sciencebase.gov/vocab/schema1"')).not.toBe(-1);
	    	expect(tags.indexOf('"name": "name1"')).not.toBe(-1);

	    	var jobj = jQuery.parseJSON("["+tags+"]");
	    	for (var i=0; i<data.length; i++) {
	    		expect(jobj[i].name).toBe(data[i].display);
	    	}
	    });
	});
	
	
	describe("buildBody tests", function() {
	    it("creates valid body of Work ", function() {
	    	var data = {work:'Test Work'}
	    	var body = buildBody(data);
	    	expect(typeof body).toBe('string')
	    	expect(body.indexOf(data.work)).not.toBe(-1);
	    	expect(body.indexOf('Objectives')).toBe(-1);
	    	expect(body.indexOf('Impact')).toBe(-1);
	    	expect(body.indexOf('Products')).toBe(-1);
	    	expect(body.indexOf(',')).toBe(-1); // HTML not JSON
	    });
	    it("creates valid body of Objectives ", function() {
	    	var data = {objectives:'Test Objective'}
	    	var body = buildBody(data);
	    	expect(typeof body).toBe('string')
	    	expect(body.indexOf(data.objectives)).not.toBe(-1);
	    	expect(body.indexOf('Work')).toBe(-1);
	    	expect(body.indexOf('Impact')).toBe(-1);
	    	expect(body.indexOf('Products')).toBe(-1);
	    	expect(body.indexOf(',')).toBe(-1); // HTML not JSON
	    });
	    it("creates valid body of Impact ", function() {
	    	var data = {impact:'Test Impact'}
	    	var body = buildBody(data);
	    	expect(typeof body).toBe('string')
	    	expect(body.indexOf(data.impact)).not.toBe(-1);
	    	expect(body.indexOf('Objectives')).toBe(-1);
	    	expect(body.indexOf('Work')).toBe(-1);
	    	expect(body.indexOf('Products')).toBe(-1);
	    	expect(body.indexOf(',')).toBe(-1); // HTML not JSON
	    });
	    it("creates valid body of Products ", function() {
	    	var data = {product:'Test Products'}
	    	var body = buildBody(data);
	    	expect(typeof body).toBe('string')
	    	expect(body.indexOf(data.product)).not.toBe(-1);
	    	expect(body.indexOf('Objectives')).toBe(-1);
	    	expect(body.indexOf('Impact')).toBe(-1);
	    	expect(body.indexOf('Work')).toBe(-1);
	    	expect(body.indexOf(',')).toBe(-1); // HTML not JSON
	    });
	    
	    it("creates valid body of Work, Objectives, and Products ", function() {
	    	var data = {work:'Test Work', objectives:'Test Objective', product:'Test Products'}

	    	var body = buildBody(data);
	    	expect(typeof body).toBe('string')
	    	expect(body.indexOf(data.work)).not.toBe(-1);
	    	expect(body.indexOf(data.objectives)).not.toBe(-1);
	    	expect(body.indexOf(data.product)).not.toBe(-1);
	    	expect(body.indexOf('Work')).not.toBe(-1);
	    	expect(body.indexOf('Objectives')).not.toBe(-1);
	    	expect(body.indexOf('Products')).not.toBe(-1);
	    	
	    	expect(body.indexOf('Impact')).toBe(-1);
	    	expect(body.indexOf(',')).toBe(-1); // HTML not JSON
	    });
	    it("creates valid body of Work, Objectives, Products and optional Impact ", function() {
	    	var data = {work:'Test Work', objectives:'Test Objective', product:'Test Products', impact:'Test Impact'}
	    	var body = buildBody(data);
	    	expect(typeof body).toBe('string')
	    	expect(body.indexOf(data.work)).not.toBe(-1);
	    	expect(body.indexOf(data.objectives)).not.toBe(-1);
	    	expect(body.indexOf(data.product)).not.toBe(-1);
	    	expect(body.indexOf(data.impact)).not.toBe(-1);
	    	expect(body.indexOf('Work')).not.toBe(-1);
	    	expect(body.indexOf('Objectives')).not.toBe(-1);
	    	expect(body.indexOf('Products')).not.toBe(-1);
	    	expect(body.indexOf('Impact')).not.toBe(-1);

	    	expect(body.indexOf(',')).toBe(-1); // HTML not JSON
	    });
		
	    // TODO test order once confirmed - currently Work, Objectives, Impact (optional), and Products
	});
	
	describe("buildTags tests", function() {
	    it("creates valid json tags with single entries ", function() {
			var data={focusArea:'Test Focus', spatial:'Test Spatial', entryType:'Test Entry', duration:'Test Duration',
				keywords:'Test Keyword',
				SiGL:[{display:'Test SiGL'}],
				water:[{display:'Test Water'}],
				templates:[{display:'Test Template'}],
			}
			var tags  = buildTags(data);
	    	var jobj  = jQuery.parseJSON('['+tags+']');
	    	var focus = findTagsByKeyValue(jobj, 'scheme', schemeRoot+VOCAB_FOCUS)
	    	expect(focus.length).toBe(1)
	    	expect(focus[0].name).toBe(data.focusArea)
	    	var keywords = findTagsByKeyValue(jobj, 'scheme', schemeRoot+VOCAB_KEYWORD)
	    	expect(keywords.length).toBe(4)
	    	var spatial = findTagsByKeyValue(keywords, 'name', data.spatial)
	    	expect(spatial.length).toBe(1)
	    	var entryType = findTagsByKeyValue(keywords, 'name', data.entryType)
	    	expect(entryType.length).toBe(1)
	    	var duration = findTagsByKeyValue(keywords, 'name', data.duration)
	    	expect(duration.length).toBe(1)
	    	var keyword = findTagsByKeyValue(keywords, 'name', data.keywords)
	    	expect(keyword.length).toBe(1)
	    	var sigl = findTagsByKeyValue(jobj, 'scheme', schemeRoot+VOCAB_SIGL)
	    	expect(sigl.length).toBe(1+1) // +1 for default GLRI
	    	expect(sigl[0].name).toBe(data.SiGL[0].display)
	    });
	    it("creates valid json tags with single GLRI entry ", function() {
			var data={SiGL:[{display:'GLRI'}]}
			var tags  = buildTags(data);
	    	var jobj  = jQuery.parseJSON('['+tags+']');
	    	var sigl = findTagsByKeyValue(jobj, 'scheme', schemeRoot+VOCAB_SIGL)
	    	expect(sigl.length).toBe(1) // only 1 for default GLRI
	    	expect(sigl[0].name).toBe(data.SiGL[0].display)
	    });
	    it("creates valid json tags with many entries ", function() {
			var data={focusArea:'Test Focus', spatial:'Test Spatial', entryType:'Test Entry', duration:'Test Duration',
					keywords:'Test Keyword1, Keyword2',
					SiGL:[{display:'Test SiGL1'},{display:'Test SiGL2'},{display:'Test SiGL3'}],
					water:[{display:'Test Water1'},{display:'Test Water2'}],
					templates:[{display:'Test Template'}],
			}
			var tags  = buildTags(data);
	    	var jobj  = jQuery.parseJSON('['+tags+']');
	    	var focus = findTagsByKeyValue(jobj, 'scheme', schemeRoot+VOCAB_FOCUS)
	    	expect(focus.length).toBe(1)
	    	expect(focus[0].name).toBe(data.focusArea)
	    	var keywords = findTagsByKeyValue(jobj, 'scheme', schemeRoot+VOCAB_KEYWORD)
	    	expect(keywords.length).toBe(5)
	    	var spatial = findTagsByKeyValue(keywords, 'name', data.spatial)
	    	expect(spatial.length).toBe(1)
	    	var entryType = findTagsByKeyValue(keywords, 'name', data.entryType)
	    	expect(entryType.length).toBe(1)
	    	var duration = findTagsByKeyValue(keywords, 'name', data.duration)
	    	expect(duration.length).toBe(1)
	    	var keyword1 = findTagsByKeyValue(keywords, 'name', splitComma(data.keywords)[0])
	    	expect(keyword1.length).toBe(1)
	    	var keyword2 = findTagsByKeyValue(keywords, 'name', splitComma(data.keywords)[1])
	    	expect(keyword2.length).toBe(1)
	    	var sigl = findTagsByKeyValue(jobj, 'scheme', schemeRoot+VOCAB_SIGL)
	    	expect(sigl.length).toBe(3+1) // +1 for default GLRI
	    	expect(sigl[0].name).toBe(data.SiGL[0].display)
	    	expect(sigl[1].name).toBe(data.SiGL[1].display)
	    	expect(sigl[2].name).toBe(data.SiGL[2].display)
	    	var water = findTagsByKeyValue(jobj, 'scheme', schemeRoot+VOCAB_WATER)
	    	expect(water.length).toBe(2)
	    	expect(water[0].name).toBe(data.water[0].display)
	    	expect(water[1].name).toBe(data.water[1].display)
	    });
		
	});
	
	describe("parseSinglePersonContact tests", function() {
		it("returns object for good email format",function() {
			var preparsed = "good email good@email.org";
			var contact = parseSinglePersonContact(preparsed);
			expect(contact.email).toBe("good@email.org");
			expect(contact).not.toEqual(jasmine.any(String));
			
			preparsed = "good email a@b.co";
			contact = parseSinglePersonContact(preparsed);
			expect(contact.email).toBe("a@b.co");
			expect(contact).not.toEqual(jasmine.any(String));
			
			preparsed = "dr. tiles should be ok a@b.co";
			contact = parseSinglePersonContact(preparsed);
			expect(contact.name).toBe("dr. tiles should be ok");
			expect(contact.email).toBe("a@b.co");
			expect(contact).not.toEqual(jasmine.any(String));
		});
		it("returns object for good name format",function() {
			var preparsed = "G N good@name.org"
			var contact = parseSinglePersonContact(preparsed)
			expect(contact.name).toBe("G N")
			expect(contact).not.toEqual(jasmine.any(String));
		});
		it("returns object for good name format - trim() white space",function() {
			preparsed = "   good name    good@name.org";
			contact = parseSinglePersonContact(preparsed);
			expect(contact.name).toBe("good name");
			expect(contact).not.toEqual(jasmine.any(String));
		});
		
		it("returns error message if the contact contains a comma",function() {
			var preparsed = "bad, parsing@co.com";
			var contact = parseSinglePersonContact(preparsed);
			expect(contact).toEqual(jasmine.any(String));	//A bad validation msg
		});
		
		it("returns error message for a bad email format",function() {
			preparsed = "bad email @email.bad";
			contact = parseSinglePersonContact(preparsed);
			expect(contact).toEqual(jasmine.any(String));	//A bad validation msg
			
			//This one requires an extra check b/c it finds an email, but something
			//else in the name looks like an email
			preparsed = "bad @email normal@email.com";
			contact = parseSinglePersonContact(preparsed);
			expect(contact).toEqual(jasmine.any(String));	//A bad validation msg
		});
		
		it("returns an error message for bad name format",function() {
			var preparsed = "bad@name.org"
			var contact = parseSinglePersonContact(preparsed)
			expect(contact).toEqual(jasmine.any(String));	//A bad validation msg
			expect(contact).not.toEqual(jasmine.any(Object));

			preparsed = "b bad@name.org";
			contact = parseSinglePersonContact(preparsed);
			expect(contact).toEqual(jasmine.any(String));	//A bad validation msg
			expect(contact).not.toEqual(jasmine.any(Object));
		});
		
		it("returns an error message for multiple email addresses",function() {
			var preparsed = "bad@name.org bob bad2@name.org"
			var contact = parseSinglePersonContact(preparsed)
			expect(contact).toEqual(jasmine.any(String));	//A bad validation msg

			preparsed = "bob bad@name.org bad2@name.org";
			contact = parseSinglePersonContact(preparsed);
			expect(contact).toEqual(jasmine.any(String));	//A bad validation msg
		});
	});
	
	describe("parseAndRemoveOneUrl tests", function() {
		it("returns correct values for happy path",function() {
			var preparsed = "Some Name http://some.org";
			var response = parseAndRemoveOneUrl(preparsed);
			expect(response.original).toBe(preparsed);
			expect(response.isOk).toBe(true);
			expect(response.remain).toBe("Some Name");
			expect(response.value).toBe("http://some.org");
			expect(response.errorMsg).toBeUndefined();
		});
		
		it("Two urls are not allowed",function() {
			var preparsed = "Some Name http://some.org http://some2.org";
			var response = parseAndRemoveOneUrl(preparsed);
			expect(response.original).toBe(preparsed);
			expect(response.isOk).toBe(false);
			expect(response.remain).toBe(preparsed);
			expect(response.value).toBeUndefined();
			expect(response.errorMsg.length).toBeGreaterThan(1);
		});
		
		it("Dot separated words look like urls and cause errors",function() {
			var preparsed = "Some Name some.org";
			var response = parseAndRemoveOneUrl(preparsed);
			expect(response.original).toBe(preparsed);
			expect(response.isOk).toBe(false);
			expect(response.remain).toBe(preparsed);
			expect(response.value).toBeUndefined();
			expect(response.errorMsg.length).toBeGreaterThan(1);
		});
		
		it("Schemes other than http and https cause errors",function() {
			var preparsed = "Some Name iuuq://some.org";
			var response = parseAndRemoveOneUrl(preparsed);
			expect(response.original).toBe(preparsed);
			expect(response.isOk).toBe(false);
			expect(response.remain).toBe(preparsed);
			expect(response.value).toBeUndefined();
			expect(response.errorMsg.length).toBeGreaterThan(1);
		});
		
		it("Urls cannot be too short",function() {
			var preparsed = "Some Name http://a.b";
			var response = parseAndRemoveOneUrl(preparsed);
			expect(response.original).toBe(preparsed);
			expect(response.isOk).toBe(false);
			expect(response.remain).toBe(preparsed);
			expect(response.value).toBeUndefined();
			expect(response.errorMsg.length).toBeGreaterThan(1);
		});
	});
	
	describe("parseAndRemoveOneEmail tests", function() {
		it("returns correct values for happy path",function() {
			var preparsed = "Some Name bob@bob.com";
			var response = parseAndRemoveOneEmail(preparsed);
			expect(response.original).toBe(preparsed);
			expect(response.isOk).toBe(true);
			expect(response.remain).toBe("Some Name");
			expect(response.value).toBe("bob@bob.com");
			expect(response.errorMsg).toBeUndefined();
		});
		
		it("returns error for email w/o dots",function() {
			var preparsed = "Some Name bob@com";
			var response = parseAndRemoveOneEmail(preparsed);
			expect(response.original).toBe(preparsed);
			expect(response.isOk).toBe(false);
			expect(response.remain).toBe(preparsed);
			expect(response.value).toBeUndefined();
			expect(response.errorMsg.length).toBeGreaterThan(1);
		});
		
		it("returns error for twitter-like ref",function() {
			var preparsed = "Some Name @somebodysname";
			var response = parseAndRemoveOneEmail(preparsed);
			expect(response.original).toBe(preparsed);
			expect(response.isOk).toBe(false);
			expect(response.remain).toBe(preparsed);
			expect(response.value).toBeUndefined();
			expect(response.errorMsg.length).toBeGreaterThan(1);
		});
		
		it("returns error for email that is too short",function() {
			var preparsed = "Some Name b@a.b";
			var response = parseAndRemoveOneEmail(preparsed);
			expect(response.original).toBe(preparsed);
			expect(response.isOk).toBe(false);
			expect(response.remain).toBe(preparsed);
			expect(response.value).toBeUndefined();
			expect(response.errorMsg.length).toBeGreaterThan(1);
		});
		
		it("returns error for two emails",function() {
			var preparsed = "Some Name bob@bob.com carl@carl.com";
			var response = parseAndRemoveOneEmail(preparsed);
			expect(response.original).toBe(preparsed);
			expect(response.isOk).toBe(false);
			expect(response.remain).toBe(preparsed);
			expect(response.value).toBeUndefined();
			expect(response.errorMsg.length).toBeGreaterThan(1);
		});
		
		it("returns error for an email plus something that looks like an email",function() {
			var preparsed = "Some Name bob@bob.com @carl";
			var response = parseAndRemoveOneEmail(preparsed);
			expect(response.original).toBe(preparsed);
			expect(response.isOk).toBe(false);
			expect(response.remain).toBe(preparsed);
			expect(response.value).toBeUndefined();
			expect(response.errorMsg.length).toBeGreaterThan(1);
		});
	});
	

	describe("parsePersonContacts tests", function() {
		
		it("returns single entry object array for good single entry",function() {
			var preparsed = "good email good@email.org";
			var contacts = parsePersonContacts(preparsed);
			expect(contacts.length).toEqual(1);
			expect(contacts[0].email).toBe("good@email.org");
			expect(contacts[0].name).toBe("good email");
			
			preparsed = "good email a@b.co";
			contacts = parsePersonContacts(preparsed);
			expect(contacts.length).toEqual(1);
			expect(contacts[0].email).toBe("a@b.co");
		});
		
		it("returns multiple entries as array for good comma separated entries",function() {
			var preparsed = "good email good@email.org, good2 email good2@email.org, good3 email good3@email.org";
			var contacts = parsePersonContacts(preparsed);
			expect(contacts.length).toEqual(3);
			expect(contacts[0].email).toBe("good@email.org");
			expect(contacts[0].name).toBe("good email");
			expect(contacts[1].email).toBe("good2@email.org");
			expect(contacts[1].name).toBe("good2 email");
			expect(contacts[2].email).toBe("good3@email.org");
			expect(contacts[2].name).toBe("good3 email");
		});
		
		it("returns an empty array for an empty / undefined contact string",function() {
			var preparsed = "";
			var contacts = parsePersonContacts(preparsed);
			expect(contacts.length).toEqual(0);
			
			var preparsed = "   ";
			var contacts = parsePersonContacts(preparsed);
			expect(contacts.length).toEqual(0);
		});
		
		it("returns error message for a bad single entry",function() {
			var preparsed = "bad email @";
			var contacts = parsePersonContacts(preparsed);
			expect(contacts).toEqual(jasmine.any(String));	//A bad validation msg
		});
		
		
		it("returns error message if one entry has a bad format",function() {
			var preparsed = "bob bob@co.com, bad email @";
			var contacts = parsePersonContacts(preparsed);
			expect(contacts).toEqual(jasmine.any(String));	//A bad validation msg
			
			var preparsed = "bad email @, bob bob@co.com";	//reverse order
			var contacts = parsePersonContacts(preparsed);
			expect(contacts).toEqual(jasmine.any(String));	//A bad validation msg
			
			preparsed = "bob bob@co.com, b bad@name.org";
			contacts = parsePersonContacts(preparsed);
			expect(contacts).toEqual(jasmine.any(String));	//A bad validation msg
		});
		
		it("returns error message if one entry is empty / extra commas",function() {
			var preparsed = "bob bob@co.com, ";
			var contacts = parsePersonContacts(preparsed);
			expect(contacts).toEqual(jasmine.any(String));	//A bad validation msg
			
			var preparsed = " , bob bob@co.com";	//reverse order
			var contacts = parsePersonContacts(preparsed);
			expect(contacts).toEqual(jasmine.any(String));	//A bad validation msg
			
			var preparsed = ",";
			var contacts = parsePersonContacts(preparsed);
			expect(contacts).toEqual(jasmine.any(String));	//A bad validation msg
			
			var preparsed = ", ,";
			var contacts = parsePersonContacts(preparsed);
			expect(contacts).toEqual(jasmine.any(String));	//A bad validation msg
			
			var preparsed = " , ";
			var contacts = parsePersonContacts(preparsed);
			expect(contacts).toEqual(jasmine.any(String));	//A bad validation msg
		});
	});
	
	
	describe("parseSingleOrganizationContact tests", function() {
		it("returns object for good name and email format",function() {
			var preparsed = "org name good@email.org";
			var contact = parseSingleOrganizationContact(preparsed);
			expect(contact.email).toBe("good@email.org");
			expect(contact.name).toBe("org name");
			expect(contact.logoUrl).toBeUndefined();
			
			preparsed = "org a@b.co";
			contact = parseSingleOrganizationContact(preparsed);
			expect(contact.email).toBe("a@b.co");
			expect(contact.name).toBe("org");
			expect(contact.logoUrl).toBeUndefined();
			
			preparsed = "I. B. M. names ok a@b.co";
			contact = parseSingleOrganizationContact(preparsed);
			expect(contact.email).toBe("a@b.co");
			expect(contact.name).toBe("I. B. M. names ok");
			expect(contact.logoUrl).toBeUndefined();
		});
		
		it("returns object for good name and url format",function() {
			var preparsed = "org name http://someorg.com";
			var contact = parseSingleOrganizationContact(preparsed);
			expect(contact.email).toBeUndefined();
			expect(contact.name).toBe("org name");
			expect(contact.logoUrl).toBe("http://someorg.com");
			
			preparsed = "org name http://www.someorg.com";
			contact = parseSingleOrganizationContact(preparsed);
			expect(contact.email).toBeUndefined();
			expect(contact.name).toBe("org name");
			expect(contact.logoUrl).toBe("http://www.someorg.com");
			
			preparsed = "org name https://www.someorg.com/home.jsp";
			contact = parseSingleOrganizationContact(preparsed);
			expect(contact.email).toBeUndefined();
			expect(contact.name).toBe("org name");
			expect(contact.logoUrl).toBe("https://www.someorg.com/home.jsp");
			
			preparsed = "org name http://www.someorg.com/home.jsp";
			contact = parseSingleOrganizationContact(preparsed);
			expect(contact.email).toBeUndefined();
			expect(contact.name).toBe("org name");
			expect(contact.logoUrl).toBe("http://www.someorg.com/home.jsp");
		});
		
		it("returns object for good name ONLY (email and url not required)",function() {
			var preparsed = "org name";
			var contact = parseSingleOrganizationContact(preparsed);
			expect(contact.email).toBeUndefined();
			expect(contact.name).toBe("org name");
			expect(contact.logoUrl).toBeUndefined();
			
			preparsed = "org name Last Name";
			contact = parseSingleOrganizationContact(preparsed);
			expect(contact.email).toBeUndefined();
			expect(contact.name).toBe("org name Last Name");
			expect(contact.logoUrl).toBeUndefined();
		});
		
		it("returns error message if the contact contains a comma",function() {
			var preparsed = "bad, parsing@co.com";
			var contact = parseSingleOrganizationContact(preparsed);
			expect(contact).toEqual(jasmine.any(String));	//A bad validation msg
		});
		
		it("returns object for good name, email and url format",function() {
			var preparsed = "org name hi@org.com https://someorg.com";
			var contact = parseSingleOrganizationContact(preparsed);
			expect(contact.email).toBe("hi@org.com");
			expect(contact.name).toBe("org name");
			expect(contact.logoUrl).toBe("https://someorg.com");
			
			preparsed = "org name hi@org.com https://www.someorg.com";
			contact = parseSingleOrganizationContact(preparsed);
			expect(contact.email).toBe("hi@org.com");
			expect(contact.name).toBe("org name");
			expect(contact.logoUrl).toBe("https://www.someorg.com");
			
			preparsed = "hi@org.com org name https://www.someorg.com/home.jsp";
			contact = parseSingleOrganizationContact(preparsed);
			expect(contact.email).toBe("hi@org.com");
			expect(contact.name).toBe("org name");
			expect(contact.logoUrl).toBe("https://www.someorg.com/home.jsp");
			
			preparsed = "hi@org.com org name http://www.someorg.com/home.jsp";
			contact = parseSingleOrganizationContact(preparsed);
			expect(contact.email).toBe("hi@org.com");
			expect(contact.name).toBe("org name");
			expect(contact.logoUrl).toBe("http://www.someorg.com/home.jsp");
			
			preparsed = "    hi@org.com    org name       http://www.someorg.com/home.jsp    ";
			contact = parseSingleOrganizationContact(preparsed);
			expect(contact.email).toBe("hi@org.com");
			expect(contact.name).toBe("org name");
			expect(contact.logoUrl).toBe("http://www.someorg.com/home.jsp");
		});
		
		it("returns trimmed values when there is lots of white space",function() {
			preparsed = "    hi@org.com    org name       http://www.someorg.com/home.jsp    ";
			contact = parseSingleOrganizationContact(preparsed);
			expect(contact.email).toBe("hi@org.com");
			expect(contact.name).toBe("org name");
			expect(contact.logoUrl).toBe("http://www.someorg.com/home.jsp");
		});
		
		
		it("returns an error message is there are multiple emails or urls",function() {
			var preparsed = "org name hi@org.com someorg.com hi@org.com";
			var contact = parseSingleOrganizationContact(preparsed);
			expect(contact).toEqual(jasmine.any(String));	//A bad validation msg
			
			var preparsed = "org name hi@org.com someorg.com http://www.someorg.com/home.jsp";
			var contact = parseSingleOrganizationContact(preparsed);
			expect(contact).toEqual(jasmine.any(String));	//A bad validation msg
			
			var preparsed = "http://www.someorg.com/home.jsp org name hi@org.com someorg.com";
			var contact = parseSingleOrganizationContact(preparsed);
			expect(contact).toEqual(jasmine.any(String));	//A bad validation msg
			
			var preparsed = "I.B.M Opps Extra URL hi@org.com someorg.com";
			var contact = parseSingleOrganizationContact(preparsed);
			expect(contact).toEqual(jasmine.any(String));	//A bad validation msg
		});
		
		it("returns error message for a bad email format",function() {
			var preparsed = "bad email @";
			var contact = parseSingleOrganizationContact(preparsed);
			expect(contact).toEqual(jasmine.any(String));	//A bad validation msg
			
			preparsed = "bad email bad@";
			contact = parseSingleOrganizationContact(preparsed);
			expect(contact).toEqual(jasmine.any(String));	//A bad validation msg
			
			preparsed = "bad email b@a.";
			contact = parseSingleOrganizationContact(preparsed);
			expect(contact).toEqual(jasmine.any(String));	//A bad validation msg
			
			//This one looks like a url if its not picked up as an email
			//address, so requires extra checking in the parser.
			preparsed = "bad email @email.bad";
			contact = parseSingleOrganizationContact(preparsed);
			expect(contact).toEqual(jasmine.any(String));	//A bad validation msg
		});
		
		it("returns error message for a bad url format",function() {
			var preparsed = "no protocal url someorg.org";
			var contact = parseSingleOrganizationContact(preparsed);
			expect(contact).toEqual(jasmine.any(String));	//A bad validation msg
			
			//a.b is too short to be a url, but should still cause a validation issue
			preparsed = "a.b looks bad contact@co.com";
			contact = parseSingleOrganizationContact(preparsed);
			expect(contact).toEqual(jasmine.any(String));	//A bad validation msg
			
			preparsed = "bad url but email is ok a.b someone@comp.com";
			contact = parseSingleOrganizationContact(preparsed);
			expect(contact).toEqual(jasmine.any(String));	//A bad validation msg
		});
		
		it("returns an error message for bad name format",function() {
			var preparsed = "bad@name.org"
			var contact = parseSingleOrganizationContact(preparsed)
			expect(contact).toEqual(jasmine.any(String));	//A bad validation msg
			expect(contact).not.toEqual(jasmine.any(Object));

			preparsed = "b bad@name.org";
			contact = parseSingleOrganizationContact(preparsed);
			expect(contact).toEqual(jasmine.any(String));	//A bad validation msg
			expect(contact).not.toEqual(jasmine.any(Object));
			
			preparsed = "b bad@name.org www.url.shouldnt.make.this.ok.com";
			contact = parseSingleOrganizationContact(preparsed);
			expect(contact).toEqual(jasmine.any(String));	//A bad validation msg
			expect(contact).not.toEqual(jasmine.any(Object));
		});
	});
	

	describe("parseOrganizationContacts tests", function() {
		
		it("returns single entry object array for good single entry",function() {
			var preparsed = "good org good@email.org http://somewhere.com";
			var contacts = parseOrganizationContacts(preparsed);
			expect(contacts).not.toEqual(jasmine.any(String));
			expect(contacts.length).toEqual(1);
			expect(contacts[0].email).toBe("good@email.org");
			expect(contacts[0].name).toBe("good org");
			expect(contacts[0].logoUrl).toBe("http://somewhere.com");
			
			preparsed = "a@b.co mixed order http://url.abc.com";
			contacts = parseOrganizationContacts(preparsed);
			expect(contacts).not.toEqual(jasmine.any(String));
			expect(contacts.length).toEqual(1);
			expect(contacts[0].email).toBe("a@b.co");
			expect(contacts[0].name).toBe("mixed order");
			expect(contacts[0].logoUrl).toBe("http://url.abc.com");
			
			preparsed = "only url ok http://url.abc.com";
			contacts = parseOrganizationContacts(preparsed);
			expect(contacts).not.toEqual(jasmine.any(String));
			expect(contacts.length).toEqual(1);
			expect(contacts[0].email).toBeUndefined();
			expect(contacts[0].name).toBe("only url ok");
			expect(contacts[0].logoUrl).toBe("http://url.abc.com");
			
			preparsed = "contact@abc.com only email ok";
			contacts = parseOrganizationContacts(preparsed);
			expect(contacts).not.toEqual(jasmine.any(String));
			expect(contacts.length).toEqual(1);
			expect(contacts[0].email).toBe("contact@abc.com");
			expect(contacts[0].name).toBe("only email ok");
			expect(contacts[0].logoUrl).toBeUndefined();
		});
		
		it("returns multiple entries as array for good comma separated entries",function() {
			var preparsed = "good org good@email.org http://somewhere.com, http://somewheres.com good org no2 good2@email.org ";
			var contacts = parseOrganizationContacts(preparsed);
			expect(contacts.length).toEqual(2);
			expect(contacts[0].email).toBe("good@email.org");
			expect(contacts[0].name).toBe("good org");
			expect(contacts[0].logoUrl).toBe("http://somewhere.com");
			expect(contacts[1].email).toBe("good2@email.org");
			expect(contacts[1].name).toBe("good org no2");
			expect(contacts[1].logoUrl).toBe("http://somewheres.com");
		});

		
		it("returns an empty array for an empty / undefined contact string",function() {
			var preparsed = "";
			var contacts = parseOrganizationContacts(preparsed);
			expect(contacts.length).toEqual(0);
			
			var preparsed = "   ";
			var contacts = parseOrganizationContacts(preparsed);
			expect(contacts.length).toEqual(0);
		});
		
		it("returns error message for a bad single entry",function() {
			var preparsed = "bad email @";
			var contacts = parseOrganizationContacts(preparsed);
			expect(contacts).toEqual(jasmine.any(String));	//A bad validation msg
			
			preparsed = "bad url a.b";
			contacts = parseOrganizationContacts(preparsed);
			expect(contacts).toEqual(jasmine.any(String));	//A bad validation msg
		});
		
		
		it("returns error message if one entry has a bad format",function() {
			var preparsed = "bob bob@co.com, bad email @";
			var contacts = parseOrganizationContacts(preparsed);
			expect(contacts).toEqual(jasmine.any(String));	//A bad validation msg
			
			var preparsed = "bad email @, bob bob@co.com";	//reverse order
			var contacts = parseOrganizationContacts(preparsed);
			expect(contacts).toEqual(jasmine.any(String));	//A bad validation msg
			
			preparsed = "bob bob@co.com, b bad@name.org";
			contacts = parseOrganizationContacts(preparsed);
			expect(contacts).toEqual(jasmine.any(String));	//A bad validation msg
			
			var preparsed = "bad url a.b, bob bob@co.com";	//reverse order
			var contacts = parseOrganizationContacts(preparsed);
			expect(contacts).toEqual(jasmine.any(String));	//A bad validation msg
		});
		
		it("returns error message if one entry is empty / extra commas",function() {
			var preparsed = "bob bob@co.com, ";
			var contacts = parseOrganizationContacts(preparsed);
			expect(contacts).toEqual(jasmine.any(String));	//A bad validation msg
			
			var preparsed = " , bob bob@co.com";	//reverse order
			var contacts = parseOrganizationContacts(preparsed);
			expect(contacts).toEqual(jasmine.any(String));	//A bad validation msg
			
			var preparsed = ",";
			var contacts = parseOrganizationContacts(preparsed);
			expect(contacts).toEqual(jasmine.any(String));	//A bad validation msg
			
			var preparsed = ", ,";
			var contacts = parseOrganizationContacts(preparsed);
			expect(contacts).toEqual(jasmine.any(String));	//A bad validation msg
			
			var preparsed = " , ";
			var contacts = parseOrganizationContacts(preparsed);
			expect(contacts).toEqual(jasmine.any(String));	//A bad validation msg
		});
	});
	
	
	describe("createContact tests", function() {

		it("returns json for a good person contact",function() {
			var contactObj = {name: "good email", email: "good@email.org"};
			var contact = createContact('type', contactObj);
			expect(contact.indexOf('"type":"type"')).not.toBe(-1);
			expect(contact.indexOf('"contactType":"person"')).not.toBe(-1);
			expect(contact.indexOf('"name":"good email"')).not.toBe(-1);
			expect(contact.indexOf('"email":"good@email.org"')).not.toBe(-1);
		});
		
		it("returns json for a good organization contact",function() {
			var contactObj = {name: "org", email: "good@email.org"};
			var contact = createContact("Cooperator/Partner", contactObj);
			expect(contact.indexOf('"type":"Cooperator/Partner"')).not.toBe(-1);
			expect(contact.indexOf('"contactType":"organization"')).not.toBe(-1);
			expect(contact.indexOf('"name":"org"')).not.toBe(-1);
			expect(contact.indexOf('"email":"good@email.org"')).not.toBe(-1);
		});
	});

	describe("createContacts tests", function() {
		it("returns empty string for bad email format",function() {
			var preparsed = "bad email @";
			var contact = createContacts('type',preparsed);
			expect(contact).toBe("");
		});
		it("bad source strings return empty results, regardless of order",function() {
			var preparsed = "good email good@email.org, bad@name.org"
			var contact = createContacts('type',preparsed)
			expect(contact).toBe("");
			
			preparsed = "bad@name.org, good email good@email.org"
			contact = createContacts('type',preparsed)
			expect(contact).toBe("");
			
		});
		it("returns json for many good contact format",function() {
			var preparsed = "good1 email good1@email.org, good2 email good2@email.org, good3 email good3@email.org";
			var contacts = createContacts('type',preparsed);
			expect(contacts.indexOf('"type":"type"')).not.toBe(-1);
			expect(contacts.indexOf('"contactType":"person"')).not.toBe(-1);
			expect(contacts.indexOf('"name":"good1 email"')).not.toBe(-1);
			expect(contacts.indexOf('"email":"good1@email.org"')).not.toBe(-1);
			expect(contacts.indexOf('"name":"good2 email"')).not.toBe(-1);
			expect(contacts.indexOf('"email":"good2@email.org"')).not.toBe(-1);
			expect(contacts.indexOf('"name":"good3 email"')).not.toBe(-1);
			expect(contacts.indexOf('"email":"good3@email.org"')).not.toBe(-1);
			
	    	var jobj = jQuery.parseJSON("["+contacts+"]");
	    	expect(typeof jobj).toBe('object')
	    	expect(jobj.length).toBe(3)
		});
	});
	
	describe("buildContacts tests", function() {
		it("returns json for required contacts ",function() {
			var data = {principal:"good1 email good1@email.org", chief:"good2 email good2@email.org"};
			var json = buildContacts(data);
	    	var jobj = jQuery.parseJSON("["+json+"]");
	    	expect(typeof jobj).toBe('object')
	    	expect(jobj.length).toBe(2)
	    	expect(jobj[0].type).toBe(CONTACT_PRINCIPAL);
	    	expect(jobj[1].type).toBe(CONTACT_CHIEF);
		});
		it("returns json for required contacts plus organizations",function() {
			var data = {principal:"good1 email good1@email.gov", chief:"good2 email good2@email.gov",
					organizations:"good org1 org1@email.org,good org2 org2@email.org,good org3 http://org3url.com"};
			var json = buildContacts(data);
	    	var jobj = jQuery.parseJSON("["+json+"]");
	    	expect(typeof jobj).toBe('object')
	    	expect(jobj.length).toBe(5)
	    	expect(jobj[0].type).toBe(CONTACT_PRINCIPAL);
	    	expect(jobj[1].type).toBe(CONTACT_CHIEF);
	    	expect(jobj[2].type).toBe(CONTACT_ORG);
			expect(jobj[4].logoUrl).toBe("http://org3url.com");
		});
		it("returns json for required contacts plue other contacts",function() {
			var data = {principal:"good1 email good1@email.gov", chief:"good2 email good2@email.gov",
					contacts:"contact gov1 contact1@email.gov,contact gov1 contact1@email.gov"};
			var json = buildContacts(data);
	    	var jobj = jQuery.parseJSON("["+json+"]");
	    	expect(typeof jobj).toBe('object')
	    	expect(jobj.length).toBe(4)
	    	expect(jobj[0].type).toBe(CONTACT_PRINCIPAL);
	    	expect(jobj[1].type).toBe(CONTACT_CHIEF);
	    	expect(jobj[2].type).toBe(CONTACT_TEAM);
		});
		it("returns json for required contacts plue organizations and other",function() {
			var data = {principal:"good1 email good1@email.gov", chief:"good2 email good2@email.gov",
					organizations:"good org1 org1@email.org,good org2 org2@email.org,good org2 org2@email.org",
					contacts:"contact gov1 contact1@email.gov,contact gov1 contact1@email.gov"};
			var json = buildContacts(data);
	    	var jobj = jQuery.parseJSON("["+json+"]");
	    	expect(typeof jobj).toBe('object')
	    	expect(jobj.length).toBe(7)
	    	expect(jobj[0].type).toBe(CONTACT_PRINCIPAL);
	    	expect(jobj[1].type).toBe(CONTACT_CHIEF);
	    	expect(jobj[2].type).toBe(CONTACT_ORG);
	    	expect(jobj[5].type).toBe(CONTACT_TEAM);
		});
	});
	
	describe("buildNewProject tests", function() {
	    it("creates valid json with parentId", function() {
	    	var data = {}
	    	var json = buildNewProject(data);
	    	var jobj = jQuery.parseJSON(json);
	    	expect(jobj.parentId).toBe('52e6a0a0e4b012954a1a238a')
	    });
	    it("creates valid json for title", function() {
	    	var data = {title:'Test Title'}
	    	var json = buildNewProject(data);
	    	var jobj = jQuery.parseJSON(json);
	    	expect(jobj.title).toBe('Test Title')
	    });
	    it("creates valid json for purpose", function() {
	    	var data = {purpose:'Test Purpose'}
	    	var json = buildNewProject(data);
	    	var jobj = jQuery.parseJSON(json);
	    	expect(jobj.purpose).toBe('Test Purpose')
	    });
	    it("creates valid json for username", function() {
	    	var data = {username:'Test User'}
	    	var json = buildNewProject(data);
	    	var jobj = jQuery.parseJSON(json);
	    	var tags = jobj.tags
	    	expect(typeof tags).toBe('object')
	    	expect(tags.length).not.toBe(0)
	    	
	    	var user = findTagsByKeyValue(tags, 'type', 'Creator')
	    	expect(user.length).toBe(1)
	    	expect(user[0].name).toBe('Test User')
	    });
	    it("creates valid json for start date", function() {
	    	var data = {startDate:'Test Date'}
	    	var json = buildNewProject(data);
	    	var jobj = jQuery.parseJSON(json);
	    	expect(typeof jobj.dates[0]).toBe('object')
	    	expect(jobj.dates.length).toBe(1)
	    	expect(jobj.dates[0].dateString).toBe('Test Date')
	    });
	    it("creates valid json for image url", function() {
	    	var data = {image:'http://image.url/image.gif'}
	    	var json = buildNewProject(data);
	    	var jobj = jQuery.parseJSON(json);
	    	expect(typeof jobj.dates[0]).toBe('object')
	    	expect(jobj.dates.length).toBe(1)
	    	expect(jobj.webLinks[0].uri).toBe(data.image)
	    });
	    it("creates valid json for start and end date", function() {
	    	var data = {startDate:'Test Start', endDate:'Test End'}
	    	var json = buildNewProject(data);
	    	var jobj = jQuery.parseJSON(json);
	    	expect(typeof jobj.dates[0]).toBe('object')
	    	expect(jobj.dates.length).toBe(2)
	    	expect(jobj.dates[0].dateString).toBe('Test Start')
	    	expect(jobj.dates[1].dateString).toBe('Test End')
	    });
	    it("creates valid json for contacts", function() {
	    	var data = {principal:"good1 email good1@email.gov", chief:"good2 email good2@email.gov",
				organizations:"good org1 org1@email.org,good org2 org2@email.org,good org2 org2@email.org,",
				contacts:"contact gov1 contact1@email.gov,contact gov1 contact1@email.gov,"};
	    	var json = buildNewProject(data);
	    	var jobj = jQuery.parseJSON(json);
	    	expect(typeof jobj.dates[0]).toBe('object')
	    	expect(jobj.contacts[0].type).toBe(CONTACT_PRINCIPAL);
	    });
	    it("creates valid json for body", function() {
	    	var data = {work:'Test Work', objectives:'Test Objective', product:'Test Products', impact:'Test Impact'}
	    	var json = buildNewProject(data);
	    	var jobj = jQuery.parseJSON(json);
	    	expect(typeof jobj.dates[0]).toBe('object')
	    	expect(jobj.body.indexOf(data.work)).not.toBe(-1);
	    });
	    it("creates valid json for tags", function() {
			var data={focusArea:'Test Focus', spatial:'Test Spatial', entryType:'Test Entry', duration:'Test Duration',
					keywords:'Test Keyword1, Keyword2',
					SiGL:[{display:'Test SiGL1'},{display:'Test SiGL2'},{display:'Test SiGL3'}],
					water:[{display:'Test Water1'},{display:'Test Water2'}],
					templates:[{display:'Test Template'}],
			}
	    	var json = buildNewProject(data);
	    	expect(json.indexOf(data.focusArea)).not.toBe(-1);
	    	var jobj = jQuery.parseJSON(json);
	    	expect(typeof jobj.dates[0]).toBe('object')
	    	var focus = findTagsByKeyValue(jobj.tags, 'scheme', schemeRoot+VOCAB_FOCUS)
	    	expect(focus.length).toBe(1)
	    	expect(focus[0].name).toBe(data.focusArea)
	    });
	    
	});	
    
});


//try {
//obj = jQuery.parseJSON( '{ "name": "John", }' );
//} catch (e) {
//alert(e);
//}