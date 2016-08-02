'use strict';

if ( ! window.baseURL) {
	window.baseURL = "https://www.sciencebase.gov";
}



//angular does not check for null
function isDefined(obj) {
	return angular.isDefined(obj) && obj !== null;
}


var GLRICatalogApp = angular.module('GLRICatalogApp', ['ui.bootstrap','ngSanitize', 'ui.select']);


GLRICatalogApp.value('Status', {
	
	//State of loading from ScienceBase.  Possible values: 'loading or 'done'
	projectsLoadStatus     : 'loading',
	
	//State of loading from ScienceBase.  Possible values: 'loading' or 'done'
	publicationsLoadStatus : 'loading',

	// the currently selected project
	currentItem      : undefined,
	
	// not sure if this is used any longer, it was used to prevent cyclical nav settings
	isCaptureHistory : true,
	
	currentFocusArea: undefined,
	
	//A filtered (or all) list of projects to be displayed on the browse tab
	currentProjectList : [],
	
	// all the publication for a all projects
	allPublications    : [],
	
	
	CONST : {
		FOCUS_AREA_SCHEME : baseURL+"/vocab/category/Great%20Lakes%20Restoration%20Initiative/GLRIFocusArea",
		TEMPLATE_SCHEME   : baseURL+"/vocab/category/Great%20Lakes%20Restoration%20Initiative/GLRITemplates",
		BASE_QUERY_URL    : "ScienceBaseService?",
	},	

});

/**
 * A small service to find and cache the current username.
 * The entire app is reloaded if the user logs in, so its OK to cache the value
 * after we search for it.
 */
GLRICatalogApp.service('userService', function(){
	
	var _checked = false;
	var _userName = null;
	
	this._findUserName = function() {
		var un = $('#user-name');
		if (un) {
			this._userName = un.text();
		}
		return this._userName;
	};
	this.getUserName = function() {
		if (_userName != null || _checked) {
			return this._userName;
		} else {
			return this._findUserName();
		}
	};

});

