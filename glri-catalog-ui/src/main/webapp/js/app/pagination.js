'use strict';



//Pagination

GLRICatalogApp.service('Pagination',
[
function(){
	var ctx = this;

	ctx.records = [];
	
	ctx.pageRecordsPerPageOptions = [5, 10, 15];
	ctx.pageSize    = ctx.pageRecordsPerPageOptions[0];
	ctx.pageCurrent = 0;
	ctx.pageCount   = 0;
	ctx.pageList    = [];	//array of numbers, 0 to pageCount - 1.  Used by ng-repeat
	ctx.pageRecords = [];
	
	ctx.gotoNextPage = function() {
		if (ctx.pageHasNext()) {
			ctx.pageCurrent++;
			ctx.updatePageRecords();
		}
	}
	
	
	ctx.gotoPreviousPage = function() {
		if (ctx.pageHasPrevious()) {
			ctx.pageCurrent--;
			ctx.updatePageRecords();
		}
	}
	
	
	ctx.gotoPage = function(pageNumber) {
		if (pageNumber > -1 && pageNumber < ctx.pageCount) {
			ctx.pageCurrent = pageNumber;
			ctx.updatePageRecords();
		}
	}
	
	
	ctx.setPageSize = function(size) {
		ctx.pageSize = size;
		ctx.updatePageRecords();
	}
	
	
	ctx.calcPageCount = function() {
		if (ctx.records) {
			return Math.ceil(ctx.records.length/ctx.pageSize);
		} else {
			return 0;
		}
    }
	
	
	ctx.pageHasNext     = function() {
		return 		(ctx.pageCurrent + 1) < ctx.pageCount;
	}
	
	
	ctx.pageHasPrevious = function() {
		ctx.pageCurrent > 0;
	}
	
	
	ctx.pageCurrentFirstRecordIndex    = function(){
		return ctx.pageCurrent * ctx.pageSize;
	}
	
	
	ctx.pageCurrentLastRecordIndex = function() {
	
		if ( ctx.pageCount > ctx.pageCurrent + 1 ) {
			//any page but the last page
			return ctx.pageCurrentFirstRecordIndex() + ctx.pageSize - 1;
		} else {
			//last page 
			return ctx.records.length - 1;
		}
	}

	
	
	/**
	 * Update the paged records
	 */
	ctx.updatePageRecords = function() {
		
		if ($(".device-xs").is(":visible")) {
			ctx.sizeText = "VS";
			ctx.pageRecords = ctx.records;
		} else {
			ctx.sizeText = "NOT-VS";
			var startRecordIdx = ctx.pageCurrent * ctx.pageSize;
			var endRecordIdx   = startRecordIdx  + ctx.pageSize;
			 endRecordIdx = (endRecordIdx > ctx.records.length) ?ctx.records.length :endRecordIdx;
			
			var newPgRecs = [];
			var destIdx   = 0;
			for (var srcIdx = startRecordIdx; srcIdx < endRecordIdx; srcIdx++) {
				newPgRecs[destIdx] = ctx.records[srcIdx];
				destIdx++;
			}
					
			ctx.pageRecords     = newPgRecs;
			ctx.pageCount       = ctx.calcPageCount();
					
			if (ctx.pageList.length != ctx.pageCount) {
				var newPageList = new Array();
				for (var i = 0; i < ctx.pageCount; i++) {
					newPageList[i] = i;
				}
				ctx.pageList = newPageList;
			}
		}
	}
	
}]);



GLRICatalogApp.directive('pagerui',
['Pagination', 'ScienceBase',		
function(pager, ScienceBase) {
	return {
		restrict   : 'E', //AEC
		replace    : true,
		transclude : true,
		scope      : true,
		templateUrl: 'templates/pager.html',
		
		controller : function($scope) {
			
			$scope.pager = pager
			
			/**
			 * Show or hide the child items of a record, loading if needed.
			 * @returns {undefined}
			 */
			$scope.toggleChildItems = function(parentRecord) {
				switch (parentRecord.childRecordState) {
					case 'loading':
						return;	//nothing to do
						break;
					case 'complete':
						parentRecord.childRecordState = 'closed';	//hides the records
						break;
					case 'closed' :
						parentRecord.childRecordState = 'complete';	//shows the records
						break;
					case 'notloaded' :
					case 'failed' :
					default :
						ScienceBase.loadChildItems(parentRecord);
				}
			}
		}
	}	
}]);



GLRICatalogApp.directive('pageruiControls',
['Pagination',		
function(pager) {
	return {
		restrict   : 'E', //AEC
		replace    : true,
		transclude : true,
		scope      : true,
		templateUrl: 'templates/pager-controls.html',
		
		controller : function($scope) {
			
			$scope.pager = pager
			
		}
	}	
}]);
