<%@page contentType="text/html" pageEncoding="UTF-8"%>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN"
   "http://www.w3.org/TR/html4/loose.dtd">

<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
		
		<script type="text/javascript" src="webjars/jquery/2.1.0/jquery.js"></script>
		<script type="text/javascript" src="js/lib/jquery-dynatable/0.3.1/jquery.dynatable.js"></script>
		<script type="text/javascript" src="js/app/main.js"></script>
		
		<link rel="stylesheet" type="text/css" href="js/lib/jquery-dynatable/0.3.1/jquery.dynatable.css" />
		<link rel="stylesheet" type="text/css" href="style/css/usgs_style_main.css" />
		<link rel="stylesheet" type="text/css" href="style/css/app.css" />
		<link rel="stylesheet" type="text/css" href="style/css/left-nav.css" />
		
        <title>Science Base Sample Query Page</title>
    </head>
    <body>
		<jsp:include page="template/header.jsp" flush="true" />
		<div class="colmask leftmenu">
			<div class="colright">
				<div class="colleft">
					<div class="col1wrap">
						<div class="col1">
							<div id="lead-in">
								<h1>GLRI to ScienceBase Query API Example</h1>
								<p>All query are being submitted to the ScienceBase REST API.</p>
								<p>
									Choosing the <b>GLRI Results Only</b> option limits the results to the
									<a href="https://www.sciencebase.gov/catalog/item/52e6a0a0e4b012954a1a238a">Great Lakes Restoration Initiative</a>
									community of datasets.
								</p>
							</div>
							<table id="query-results-table">
								<thead>
									<tr>
										<th>id</th>
										<th>title</th>
										<th>summary</th>
									</tr>
								</thead>
								<tbody>

								</tbody>
							</table>
						</div>
					</div>
					<div class="col2">
						<form id="sb-query-form" action="ScienceBaseService">
							<fieldset title="Standard ScienceBase Text Search">
								<div class="field">
									<label for="text_query_input">Text Query</label>
									<input type="text" size="30" id="text_query_input" name="text_query"/>
								</div>
							</fieldset>
							<fieldset title="GLRI Specific tags">
								<div class="field">
									<label for="medium_input">Sample Medium</label>
									<select id="medium_input" name="medium">
										<option value="">Any</option>
										<option value="water">water</option>
										<option value="air">air</option>
									</select>
								</div>
								<div class="field">
									<label for="param_group_input">Parameter Group</label>
									<select id="param_group_input" name="param_group">
										<option value="">Any</option>
										<option value="Nutrient">Nutrient</option>
										<option value="Biological">Biological</option>
										<option value="Organics">Organics</option>
										<option value="Inorganics">Inorganics</option>
									</select>
								</div>
								<div class="field">
									<label for="param_input">Parameter Group</label>
									<select id="param_input" name="param">
										<option value="">Any</option>
										<option value="Nitrogen">Nitrogen</option>
										<option value="Phosphorus">Phosphorus</option>
										<option value="Fish">Fish</option>
										<option value="Birds">Birds</option>
										<option value="PCB">PCB</option>
										<option value="Mercury">Mercury</option>
										<option value="Atrazine">Atrazine</option>
									</select>
								</div>
								<div class="field">
									<label for="area_input">GRRI Study Area</label>
									<select id="area_input" name="area">
										<option value="">Any</option>
										<option value="Lake Michigan Basin">Lake Michigan Basin</option>
										<option value="Lake Erie Basin">Lake Erie Basin</option>
										<option value="Lake Huron Basin">Lake Huron Basin</option>
										<option value="Lake Superior Basin">Lake Superior Basin</option>
										<option value="Lake Ontario Basin">Lake Ontario Basin</option>
									</select>
								</div>
							</fieldset>
							<fieldset title="Search Options">
								<div class="field">
									<label for="glri_only_input">GLRI Results Only?</label>
									<input type="checkbox" checked="checked" id="glri_only_input" name="glri_only" value="true" />
								</div>

								<div class="field">
									<label for="format_input">Result Format</label>
									<select id="format_input" name="format">
										<option value="json">JSON</option>
										<option value="html">HTML</option>
										<option value="xml">XML</option>
									</select>
								</div>

								<input id="query-submit" type="submit" value="Submit"/>
							</fieldset>
						</form>
					</div>
				</div><!-- colleft -->
			</div><!-- colright -->
		</div><!-- colmask -->
		<jsp:include page="template/footer.jsp" flush="true" />
    </body>
</html>
