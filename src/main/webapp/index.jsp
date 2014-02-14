<%@page contentType="text/html" pageEncoding="UTF-8"%>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN"
   "http://www.w3.org/TR/html4/loose.dtd">

<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
		
		

		<script type="text/javascript" src="webjars/jquery/2.1.0/jquery.js"></script>
		<script type="text/javascript" src="js/lib/jquery-dynatable/0.3.1/jquery.dynatable.js"></script>
		<script type="text/javascript" src="js/lib/OpenLayers/OpenLayers.js"></script>
		
		
		<script type="text/javascript" src="js/app/main.js"></script>
		
		<link rel="stylesheet" type="text/css" href="js/lib/jquery-dynatable/0.3.1/jquery.dynatable.css" />
		<link rel="stylesheet" type="text/css" href="style/css/usgs_style_main.css" />
		<link rel="stylesheet" type="text/css" href="style/css/table.css" />
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
							<table id="query-results-table" class="hidden">
								<thead>
									<tr>
										<th>Resource</th>
										<th>Title</th>
										<th>Summary</th>
										<th>Url</th>
									</tr>
								</thead>
								<tbody>

								</tbody>
							</table>
						</div>
					</div>
					<div class="col2">
						<div id="map" class="map"></div>
						<form id="dummy" action="none">
							<fieldset>
								<div class="field">
									<label for="drawBox">Draw Box</label>
									<input type="checkbox" name="drawBox" id="drawBox" value="box"/>
								</div>
							</fieldset>
						</form>
						<form id="sb-query-form" action="ScienceBaseService">
							<fieldset title="Standard ScienceBase Text Search">
								<div class="field">
									<label for="text_query_input">Text Query</label>
									<input type="text" size="35" id="text_query_input" name="text_query"/>
								</div>
							</fieldset>
							<fieldset title="GLRI Specific tags">
								<div class="field">
									<label for="resource_input">Resource Type</label>
									<select id="resource_input" name="resource">
										<option value="">Any</option>
										<option value="Data">Data</option>
										<option value="Publication">Publication</option>
										<option value="Project">Project</option>
									</select>
								</div>
								<div class="field">
									<label for="loc_type_input">Location Type</label>
									<select id="loc_type_input" name="loc_type">
										<option value="">Any</option>
										<option value="Lake">Lake</option>
										<option value="Watershed">Watershed</option>
										<option value="Channel">Channel</option>
									</select>
								</div>
								<div class="field">
									<label for="loc_name_input">Location</label>
									<select id="loc_name_input" name="loc_name">
										<option value="">Any</option>
										<optgroup label="Lakes">
											<option value="Lake:Lake Michigan">Lake Michigan</option>
											<option value="Lake:Lake Erie">Lake Erie</option>
											<option value="Lake:Lake Huron">Lake Huron</option>
											<option value="Lake:Lake Superior">Lake Superior</option>
											<option value="Lake:Lake Ontario">Lake Ontario</option>
											<option value="Lake:Lake St. Clair">Lake St. Clair</option>
										</optgroup>
										<optgroup label="Watersheds">
											<option value="Watershed:Lake Michigan Basin">Lake Michigan Basin</option>
											<option value="Watershed:Lake Erie Basin">Lake Erie Basin</option>
											<option value="Watershed:Lake Huron Basin">Lake Huron Basin</option>
											<option value="Watershed:Lake Superior Basin">Lake Superior Basin</option>
											<option value="Watershed:Lake Ontario Basin">Lake Ontario Basin</option>
											<option value="Watershed:Lake St. Clair Basin">Lake St. Clair Basin</option>
										</optgroup>
										<optgroup label="Channels">
											<option value="Channel:St. Mary's Channel">St. Mary's Channel</option>
											<option value="Channel:St. Lawrence Channel">St. Lawrence Channel</option>
											<option value="Channel:Detroit Channel">Detroit Channel</option>
											<option value="Channel:Niagara Channel">Niagara Channel</option>
											<option value="Channel:St. Clair/Detroit River System">St. Clair/Detroit River Sys</option>
										</optgroup>
									</select>
								</div>
								<div class="field">
									<label for="focus_input">Focus Area</label>
									<select id="focus_input" name="focus">
										<option value="">Any</option>
										<option value="Toxic Substances">Toxic Substances</option>
										<option value="Invasive Species">Invasive Species</option>
										<option value="Nearshore Health">Nearshore Health</option>
										<option value="Habitat & Wildlife">Habitat &amp; Wildlife</option>
										<option value="Accountability">Accountability</option>
									</select>
								</div>
							</fieldset>
							<fieldset title="Search Options">
								<div class="field">
									<label for="glri_only_input">GLRI Results Only?</label>
									<input type="checkbox" checked="checked" id="glri_only_input" name="glri_only" value="true" />
								</div>
								<div class="field">
									<label for="spatial_input">Bbox</label>
									<input type="text" size=25" id="spatial_input" name="spatial" value="">
								</div>
								<input type="hidden" id="format_input" name="format" value="json">
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
