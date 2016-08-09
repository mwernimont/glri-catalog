'use strict';


//Collection of possible FocusAreas using the keys in focusAreaOrder.
GLRICatalogApp.service('FocusAreaManager', 
['Status',
function(Status) {
	
	var ctx = this;
	
	
	//A focus area objects (see focusAreas) that is currently selected on the browse tab
	ctx.currentFocusArea = undefined;
	
	
	// the display order set by the stake holder
	ctx.displayOrder = ['all','fats','fais','fanh','fahw','facc']
	
	
	ctx.areasByType  = {
		all : {
			name:'All',
			description: "Projects for all focus areas",
			infosheet:undefined,
			items: []
		},
		fats : {
			name:'Toxic Substances',
			description: "Toxic Substances and Areas of Concern Projects for the Great Lakes Restoration Initiative",
			infosheet:"http://cida.usgs.gov/glri/infosheets/GLRI_1_Toxic_Substances.pdf",
			items: [],
		},
		fais : {
			name:'Invasive Species',
			description: "Combating Invasive Species Projects for the Great Lakes Restoration Initiative",
			infosheet:"http://cida.usgs.gov/glri/infosheets/GLRI_2_invasive_species.pdf",
			items: [],
		},
		fanh : {
			name:'Nearshore Health',
			description:"Nearshore Health and Watershed Protection Projects for the Great Lakes Restoration Initiative",
			infosheet:"http://cida.usgs.gov/glri/infosheets/GLRI_3_Nearshore.pdf",
			items: [],
		},
		fahw : {
			name:'Habitat & Wildlife',
			description:"Habitat & Wildlife Protection and Restoration",
			infosheet:"http://cida.usgs.gov/glri/infosheets/GLRI_4_Habitat_Restore.pdf",
			items: [],
		},
		facc : {
			name:'Accountability',
			description :"Tracking Progress and Working with Partners Projects for the Great Lakes Restoration Initiative",
			infosheet:"http://cida.usgs.gov/glri/infosheets/GLRI_5_Tracking_progress_working_w_partners.pdf",
			items: [],
		}
	};
	
	
	// reverse lookup reference
	ctx.areasByName = {};
	
	// reverse lookup builder
	Object.keys(ctx.areasByType).forEach(function(fa){
		var focusArea = ctx.areasByType[fa];
		ctx.areasByName[focusArea.name] = fa;
	});


	ctx.activate = function(focusArea) {
		
		//asdf move to project manager?
		Status.currentItem = undefined;

		ctx.currentFocusArea = ctx.areasByType[focusArea];
		
		if ( ! ctx.currentFocusArea ) {
			return ctx.activate('all');
		}
		
		//asdf move to project manager?
		Status.currentFocusArea = ctx.currentFocusArea;
		Status.currentProjectList = ctx.currentFocusArea.items;
	};
	
	
	/**
	 * Adds an Item returned from the Science Base query to the tab data structure.
	 * 
	 * @param {type} project - A processed SB Item that is a project
	 * @param {type} focusAreaNames - A single focus area or an array of focus areas
	 * @returns {project}
	 */
	ctx.addProjectToFocusArea = function(project, focusAreaNames) {
		
		//asdf this is a bit strange
		if (focusAreaNames.length) {	//treat as an array
			for (var i = 0; i < focusAreaNames.length; i++) {
				var focusArea = ctx.areasByName[focusAreaNames[i]];
				var fa = ctx.areasByType[focusArea];
				fa.items.push(project);
			}
		} else {	//treat as a string
			var focusArea = ctx.areasByName[focusAreaNames];
			var fa = ctx.areasByType[focusArea];
			fa.items.push(project);
		}

		ctx.areasByType['all'].items.push(project);
		
		return project;
	}	
	
}]);
