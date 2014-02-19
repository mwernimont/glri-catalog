<%@page contentType="text/html" pageEncoding="UTF-8"%>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN"
   "http://www.w3.org/TR/html4/loose.dtd">

<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
		
		<script type="text/javascript" src="webjars/jquery/2.1.0/jquery.js"></script>
		<script type="text/javascript" src="js/lib/jquery-dynatable/0.3.1/jquery.dynatable.js"></script>
		<script type="text/javascript">

var dynamicTable = null;

$(document).ready(function(){
    // Sets up click behavior on all button elements with the alert class
    // that exist in the DOM when the instruction was executed
	$.dynatableSetup({
		features: {
		  paginate: false,
		  sort: true,
		  pushState: true,
		  search: false,
		  recordCount: true,
		  perPageSelect: false
		},
		params: {
			records: "_root"
		}
	});
	
    $("#load-data-1").on( "click", function(event) {
		event.preventDefault();
		event.stopPropagation();
		updateTable(data1);
    });
	
    $("#load-data-2").on( "click", function(event) {
		event.preventDefault();
		event.stopPropagation();
		updateTable(data2);
    });
	
});

function updateTable(data) {
	
	var records = data['items'];
	
	if (dynamicTable == null) {
		$("#query-results-table").dynatable({
			dataset: {
				records: records
			},
			writers: {
				_cellWriter: writeCell
			}
		});
		
		dynamicTable = $("#query-results-table").data('dynatable');
	} else {
		dynamicTable.processingIndicator.show();
		dynamicTable.records.updateFromJson(records);
		dynamicTable.dom.update();
		dynamicTable.processingIndicator.hide();

	}
	
};

function writeCell(column, record) {
    var html = glriAttributeWriter(column, record);
    var td = '<td';

    if (column.hidden || column.textAlign) {
      td += ' style="';

      // keep cells for hidden column headers hidden
      if (column.hidden) {
        td += 'display: none;';
      }

      // keep cells aligned as their column headers are aligned
      if (column.textAlign) {
        td += 'text-align: ' + column.textAlign + ';';
      }

      td += '"';
    }
	
    html = td + '>' + html + '</td>';
	
	if (column['id'] == "url") {
		//add the extra row
		html += glriWriteExtraRow(column, record, 5);
	}
	
	return html;
 };
 
 function glriAttributeWriter(column, record) {

	var text;
	var id = column['id'];
	
	if (id == "url") {
		text = "<a href=\"" + record[id] + "\" target=\"_blank\">link</a>";
	} else {
		text = record[id];
	}
    return text;
 };
 
 function glriWriteExtraRow(column, record, columnCount) {
	 var html = "</tr><tr>"; //end current row and start another
	 
	 html += "<td colspan=\"" + columnCount + "\">";
	 html += "your text here";
	 html += "</td>";
	 return html;
 }

		</script>
		
		<script type="text/javascript">
			var data1 = { items: [
				{
					type: "Project",
					title: "Project 1",
					description: "Summary Text......",
					person: "Author Name",
					url: "http://url/something/or/other",
					
				},
				{
					type: "Project",
					title: "Project 2",
					description: "Summary Text......",
					person: "Author",
					url: "http://url/something/or/other"
				},
				{
					type: "Publication",
					title: "Publication 1",
					description: "Summary Text......",
					person: "Lead Author",
					url: "http://url/something/or/other",
					citation: "to be built..."
				}
			] };
			
			var data2 = { items : [
				{
					type: "Project",
					title: "Project 2",
					description: "Summary Text......",
					person: "Author Name",
					url: "http://url/something/or/other",
					
				},
				{
					type: "Project",
					title: "Project 3",
					description: "Summary Text......",
					person: "Author",
					url: "http://url/something/or/other"
				},
				{
					type: "Publication",
					title: "Publication 2",
					description: "Summary Text......",
					person: "Lead Author",
					url: "http://url/something/or/other",
					citation: "to be built..."
				},
				{
					type: "",
					title: "Random Entry 1",
					description: "Summary Text......",
					person: "POint of contact",
					url: "http://url/something/or/other"
				}
			] };
			
		</script>
		
        <title>Dynatable Test Page</title>
    </head>
    <body>

		<h1>Test page for Dynatable</h1>

		<table id="query-results-table">
			<thead>
				<tr>
					<th>Type</th>
					<th>Title</th>
					<th>Description</th>
					<th>Person</th>
					<th>Url</th>
				</tr>
			</thead>
			<tbody>

			</tbody>
		</table>

		<form id="sb-query-form" action="">
			<input id="load-data-1" type="submit" value="Load Dataset One"/>
			<input id="load-data-2" type="submit" value="Load Dataset Two"/>
		</form>

    </body>
</html>
