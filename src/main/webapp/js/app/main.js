/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */


$(document).ready(function(){
    // Sets up click behavior on all button elements with the alert class
    // that exist in the DOM when the instruction was executed
	$.dynatableSetup({
		features: {
		  paginate: false,
		  sort: true,
		  pushState: true,
		  search: false,
		  recordCount: false,
		  perPageSelect: false
		},
		params: {
			records: "_root"
		}
	});
    $("#query-submit").on( "click", function(event) {
		event.preventDefault();
		event.stopPropagation();
        console.log( "A button with the alert class was clicked!" );
		updateTable();
    });
});

var dynamicTable = null;

function updateTable() {
	var url = buildDataUrl();
	//alert(url);
	
	$("table.hidden").show();
	
	$.ajax({
		dataType: "json",
		url: url,
		success: tableDataReady
	});

	
}

var tableDataReady = function(data) {
	
	var records = data.items;
	
	if (dynamicTable == null) {
		$("#query-results-table").dynatable({
			dataset: {
				records: records
			}
		});
		
		dynamicTable = $("#query-results-table").data('dynatable');
	} else {
		dynamicTable.records.updateFromJson(records);
		dynamicTable.dom.update();
	}
	
};

function buildDataUrl() {
	var url = $("#sb-query-form").attr("action");
	url += "?" + $("#sb-query-form").serialize();
	return url;
}