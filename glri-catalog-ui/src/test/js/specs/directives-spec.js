// TODO this does not work unless require and system are available 
//var log = function () {
//	require('system').system.stderr.write(Array.prototype.join.call(arguments, ' ') + '\n');
//}

// psudo logging function to get testing runtime values
var log = function(msg) {
	expect('Logging: >>>> ' + msg +' <<<<      ignore this over here->').not.toBeDefined()
}


//TODO why do I have to place this here rather than adding it to the module ?
//TODO why is this necessary to get proper angular.$compile ?
var testCtrl = function($scope) {}

// simple placeholder NO-OP function
var NOOP = function(){}

// OpenLayers mock instance - there are few test we plan to target OpenLayers
var OpenLayers = {
	Control : {
		DragPan       : NOOP,
		DrawFeature   : function() { return {
			handler   : {callbacks:{}},
			events    : {register:NOOP},
			deactivate: NOOP,
		}},
		LayerSwitcher : NOOP,
		MousePosition : NOOP,
	},
	Handler : {
		RegularPolygon : NOOP,		
	},
	LonLat  : NOOP,
	Layer   : {
		ArcGIS93Rest:function() { return {
			setVisibility : NOOP,
			events        : {register:NOOP},
		}},
		WMS   : NOOP,
		Vector: NOOP,
	},
	Map     : function() { return {
		addControl   : NOOP,
		addLayers    : NOOP,
		setBaseLayer : NOOP,
		setCenter    : NOOP,
	}},
	Pixel   : NOOP,
}
OpenLayers.Control.LayerSwitcher


// commence testing directives file
describe("simple content directives: ", function() {

	var $scope, http, intialTemplateCacheSize, jsonCache
	
	// json files to pre-load
	var jsonFiles = ['vocab','projects','publications'];
	
	// simple default template for testing directive template injection
	var defaultTmpl  = '<div ng-controller="testCtrl" attribute>elements</div>';

	// template files to pre-load
	var templates    = [
	                    'navHome',
	                    'navSearch',
	                    'contentHome',
	                    'contentAsianCarp',
	                    'contentInvasive',
	                    'contentSearch',
	                    
	                    'contentProjectDetail',
	                    'contentFocusArea',
	                    'contentPublications',
	                    'contentProjectLists',
	                    'glriLoading',
	                    
	                    'project-record',
	                    'pager',
	                    'pager-controls',
	                   ]

	
	// helper function for constructing test templates
	var insert = function(field, value, template) {
		if ( isDefined(value) ) {
			return template.replace(field,value)
		}
		return template
	}
	
	
	// in order to test angularjs controllers and directive the HTML must be 'compiled'
    var compileTemplate = function(scope, config, callback) {
    	// default template
        var template = isDefined(config.template) ?config.template :defaultTmpl;

        template = insert('attribute', config.attribute, template)
        template = insert('elements',  config.elements,  template)
        
        // inject the template into angular to compile
        inject(function($compile) {
            var el = $compile(template)(scope)[0]
            // angular does this when in apps but not in tests
            scope.$digest()
            callback( $(el) )
        })
    }
	

	// build the module, preserve the scope, and pre-load template HTML files
	beforeEach(function () {
		module("GLRICatalogApp")
		
		inject(function($rootScope,$http,$httpBackend){
			$scope = $rootScope
			http   = $httpBackend
		})
		
		inject(function($templateCache) {
			intialTemplateCacheSize = $templateCache.info().size
			
			var templateUrl  = 'templates/'
			var templatePath = 'src/main/webapp/' + templateUrl

			templates.forEach(function(template) {
				var req    = new XMLHttpRequest()
			    req.onload = function() {
			    	$templateCache.put(templateUrl + template + ".html", this.responseText)
//			    	expect(this.responseText.indexOf('HTTP ERROR: 404') === -1).toBeTruthy()
			    }
			    // Note that the relative path may be different from your unit test HTML file.
			    // Using `false` as the third parameter to open() makes the operation synchronous.
			    req.open("get", templatePath + template + ".html", false)
			    req.send()
			})
		})
		
		inject( function() {
			var jsonPath  = 'src/test/resources/';
			jsonCache     = {};
			
			jsonFiles.forEach(function(file) {
				var req    = new XMLHttpRequest()
			    req.onload = function() {
			    	jsonCache[file] = this.responseText
			    	
//			    	expect(this.responseText.indexOf('HTTP ERROR: 404')).toBe(-1)
			    }
			    // Note that the relative path may be different from your unit test HTML file.
			    // Using `false` as the third parameter to open() makes the operation synchronous.
			    req.open("get", jsonPath + file + ".json", false)
			    req.send()
			})
		})

	})

	
	// simple test to ensure that the templates HTML files have been pre-loaded
	// when angular makes a fetch call for a template it is already present
	it('should load directive templates' , inject(function($templateCache) {
		// initial template count
		expect( $templateCache ).toBeDefined();
		expect( intialTemplateCacheSize ).toBeDefined();
		// final template count
		expect( $templateCache.info().size ).not.toBe(intialTemplateCacheSize)
		expect( $templateCache.info().size ).toBe(intialTemplateCacheSize + templates.length)
	}))
	
	
	// simple test to ensure that the json files have been pre-loaded
	it('should load json test data' , inject(function($templateCache) {
		// initial template count
		expect( jsonCache ).toBeDefined()
		expect( intialTemplateCacheSize !== $templateCache.info().size  ).toBeTruthy()
		expect( Object.keys(jsonCache).length ).toBe(jsonFiles.length)
	}))
	

	// ensure that the prevent-default directive prevents default and propagation
	it(' - <div prevent-default> directive attribute - should call event.preventDefault() and event.stopPropogation() for click events' , inject(function() {
		compileTemplate($scope, {template:'<button prevent-default>ButtonLabel</button>'}, function(el) {
			var preventDefault  = spyOn(Event.prototype, "preventDefault")
			var stopPropagation = spyOn(Event.prototype, "stopPropagation")

			el.simulate('click', {})
			
			expect(preventDefault).toHaveBeenCalled()
			expect(stopPropagation).toHaveBeenCalled()
		})
	}))


	it(' - <glri-nav-home> directive - should inject template content' , inject(function() {
		compileTemplate($scope, {elements:'<glri-nav-home></glri-nav-home>'}, function(el) {
			var html = el.html()
			expect( html.indexOf('id="navHome"') > 0 ).toBeTruthy()
		})
	}))
	
	
	it(' - <glri-home> contect directive - should inject template content' , inject(function() {
		compileTemplate($scope, {elements:'<glri-home></glri-home>'}, function(el) {
			var html = el.html()
			expect( html.indexOf('id="contentHome"') > 0 ).toBeTruthy()
		})
	}))

		
	it(' - <glri-asian-carp> contect directive - should inject template content' , inject(function() {
		compileTemplate($scope, {elements:'<glri-asian-carp></glri-asian-carp>'}, function(el) {
			var html = el.html()
			expect( html.indexOf('id="contentAsianCarp"') > 0 ).toBeTruthy()
		})
	}))
	
	
	it(' - <glri-invasive> contect directive - should inject template content' , inject(function() {
		compileTemplate($scope, {elements:'<glri-invasive></glri-invasive>'}, function(el) {
			var html = el.html()
			expect( html.indexOf('id="contentInvasive"') > 0 ).toBeTruthy()
		})
	}))

	
	it(' - <glri-nav-search> directive - should inject template content' , inject(function() {
		
		var vocab = angular.fromJson(jsonCache.vocab);
		expect(vocab).toBeDefined()
		
		http.when('GET', 'ScienceBaseVocabService?parentId=53da7288e4b0fae13b6deb73&format=json')
		.respond(vocab);
				
		compileTemplate($scope, {elements:'<glri-nav-search></glri-nav-search>'}, function(el) {
			http.flush()
			var html = el.html()
			expect( html.indexOf('id="sb-query-form"') ).not.toBe(-1)
			
			expect( html.indexOf("Failed to load template list") ).toBe(-1)

			// test a term is in the HTML
			expect( html.indexOf("Template 84") ).not.toBe(-1)
			// test that all terms are in the HTML
			vocab.list.forEach(function(term) {
				expect( html.indexOf(term.name) ).not.toBe(-1)
			})
		})
	}))
	
	
	it(' - <glri-project-detail> directive - should inject template content' , inject(function() {
		
		var projects = angular.fromJson(jsonCache.projects);
		expect(projects).toBeDefined()
		var project  = projects.items[0]
		$scope.status = {currentItem : project}
		project.contactHtml = "contactASDF"
		project.url = "http://sbURL"
				
		compileTemplate($scope, {elements:'<glri-project-detail></glri-project-detail>'}, function(el) {
			var html = el.html()
			expect( html.indexOf('id="contentBrowseDetail"') ).not.toBe(-1)
			
			// test that some of the content is rendered
			expect( html.indexOf(project.title) ).not.toBe(-1)
			expect( html.indexOf(project.purpose) ).not.toBe(-1)
			expect( html.indexOf(project.contactHtml) ).not.toBe(-1)
			expect( html.indexOf('href="'+project.url) ).not.toBe(-1)
			
			expect( html.indexOf(project.body) ).toBe(-1) // this is not found because of HTML encoding
		})
	}))

	
	it(' - <glri-loading> directive loading - should show injected template content' , inject(function() {
		$scope.loadState = 'loading'
				
		compileTemplate($scope, {elements:'<glri-loading state="loadState"></glri-loading>'}, function(el) {
			var html = el.html()
			
			expect( html.indexOf("progress-bar") ).not.toBe(-1)
			expect( html.indexOf("ng-hide") ).toBe(-1)
		})
	}))

	
	it(' - <glri-loading> directive loaded - should hide injected template content' , inject(function() {
		$scope.loadState = 'done'
				
		compileTemplate($scope, {elements:'<glri-loading state="loadState"></glri-loading>'}, function(el) {
			var html = el.html()
			expect( html.indexOf("progress-bar") ).not.toBe(-1)
			expect( html.indexOf("ng-hide") ).not.toBe(-1)
		})
	}))

	
	it(' - <glri-publications> contect directive - should inject template content' , inject(function(Status) {
		
		var pubs = angular.fromJson(jsonCache.publications);
		expect(pubs).toBeDefined()
		$scope.publications =  pubs.items
		Status.allPublications = pubs.items
		
		compileTemplate($scope, {elements:'<glri-publications></glri-publications>'}, function(el) {
			var html = el.html()
			//log(html)
			expect( html.indexOf('id="contentPublications"') > 0 ).toBeTruthy()
			
			var count = (html.match(/_blank/g) || []).length;
			expect(count).toBe(pubs.items.length)
		})
	}))

	
	// TODO this might no longer have a link to show
	it(' - <glri-project-lists> contect directive - should inject template content' , inject(function(Status) {
		compileTemplate($scope, {elements:'<glri-project-lists></glri-project-lists>'}, function(el) {
			var html = el.html()
			log(html)
			expect( html.indexOf('id="projectLists"') > 0 ).toBeTruthy()
		})
	}))
	
	
	// TODO requires more tests
	it(' - <glri-search> results contect directive - should inject template content' , inject(function() {
		compileTemplate($scope, {elements:'<glri-search></glri-search>'}, function(el) {
			var html = el.html()
			expect( html.indexOf('id="searchResults"') > 0 ).toBeTruthy()
		})
	}))

	
	// TODO this could be used for focusarea tests
	it(' - <glri-project-lists> contect directive - should inject template content' , inject(function(Status) {
		
		var projects = angular.fromJson(jsonCache.projects);
		expect(projects).toBeDefined()
				
		compileTemplate($scope, {elements:'<glri-project-lists></glri-project-lists>'}, function(el) {
			var html = el.html()
			log(html)
			expect( html.indexOf('id="projectLists"') > 0 ).toBeTruthy()
			
//			var count = (html.match(/_blank/g) || []).length;
//			expect(count).toBe(pubs.items.length)
		})
	}))
	
	
})


/*
	GLRICatalogApp.directive("glriFocusArea",
	['$http', 'Status', 'RecordManager', 'ScienceBase', 'Nav', 'FocusAreaManager',
	function($http, Status, RecordManager, ScienceBase, Nav, FocusAreaManager) {
		
		return {
			restrict   : 'E', //AEC
			replace    : true,
			transclude : true,
			templateUrl: 'templates/contentFocusArea.html',
			scope      : {}, //isolated scope
			
			controller : function($scope) {
				
				$scope.baseQueryUrl  = Status.CONST.BASE_QUERY_URL;
				$scope.status        = Status;
				
				
				$scope.currentFocusArea = function() {
					return FocusAreaManager.currentFocusArea;
				}

				
				$scope.showDetail = function() {
					return isDefined(Status.currentItem);
				}
				$scope.showList = function() {
					return ! $scope.showDetail();
				}
				
				
				$scope.selectProject = function(projectItem) {
					RecordManager.setProjectDetail(projectItem);
					
					// TODO this might not be necessary any longer with the addition of 'all' focus area
					// Nav to browse should automatically be Browse/all
					if ( Nav.isNav('Browse') ) {
						Nav.setNavAdd('all')
					}
					
					Nav.doNavAdd(projectItem.id)
				}
				
			}
		}
	}]);
*/

