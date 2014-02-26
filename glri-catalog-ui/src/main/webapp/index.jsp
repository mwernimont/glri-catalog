<%@page contentType="text/html" pageEncoding="UTF-8"%>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN"
   "http://www.w3.org/TR/html4/loose.dtd">

<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
		
		
<jsp:include page="template/USGSHead.jsp">
	<jsp:param name="relPath" value="" />
	<jsp:param name="shortName" value="${project.name}" />
	<jsp:param name="title" value="Great Lakes Restoration Initiative (GLRI) Catalog" />
	<jsp:param name="description" value="An application that allows the user to search for GLRI Projects, Datasets and Publications.  Actual data and metadata are kept in ScienceBase (sciencebase.gov)" />
	<jsp:param name="author" value="Great Lakes Restoration Initiative (GLRI)" />
	<jsp:param name="keywords" value="Great Lakes Restoration Initiative, GLRI, ScienceBase" />
	<jsp:param name="publisher" value="" />
	<jsp:param name="revisedDate" value="${timestamp} (${project.version})" />
	<jsp:param name="nextReview" value="" />
	<jsp:param name="expires" value="" />
</jsp:include>
		
		<!-- Tomcat 7 only -->
		<script type="text/javascript" src="webjars/jquery/2.1.0/jquery.js"></script>
		<script type="text/javascript" src="webjars/bootstrap/3.1.1/js/bootstrap.js"></script>
		<script type="text/javascript" src="webjars/bootstrap-select/1.4.2/bootstrap-select.js"></script>
		<script type="text/javascript" src="js/lib/jquery-dynatable/0.3.1/jquery.dynatable.js"></script>
		<script type="text/javascript" src="js/app/main.js"></script>
		
		<link rel="stylesheet" type="text/css" href="js/lib/jquery-dynatable/0.3.1/jquery.dynatable.css" />
		<link rel="stylesheet" type="text/css" href="style/css/table.css" />
		<link rel="stylesheet" type="text/css" href="style/css/app.css" />
		
		<!-- Twitter Bootstrap -->
		<link rel="stylesheet" type="text/css" href="webjars/bootstrap/3.1.1/css/bootstrap.css"/>
		<link rel="stylesheet" type="text/css" href="webjars/bootstrap-select/1.4.2/bootstrap-select.css"/>
		
		<!-- Our Bootstrap Theme -->
		<script type="text/javascript" src="style/themes/theme1.js"></script>
		<link rel="stylesheet" type="text/css" href="style/themes/theme1.css"/>
		
		<!-- OpenLayers -->
		<script type="text/javascript" src="js/lib/OpenLayers/OpenLayers.js"></script>
		
        <title>Science Base Sample Query Page</title>
    </head>
    <body>
<jsp:include page="template/USGSHeader.jsp">
	<jsp:param name="relPath" value="" />
	<jsp:param name="header-class" value="" />
	<jsp:param name="site-title" value="Great Lakes Restoration Initiative (GLRI) Catalog" />
</jsp:include>
	<div class="container-fluid glri_content">
		<div id="main_page" class="page_body_content">
			<div class="row">
				<div class="col-xs-12" style="padding-top: 10px;">
					<div class="well well-sm">
						<h1 style="margin-top: 10px;">GLRI to ScienceBase Query API Example</h1>
						<p>All query are being submitted to the ScienceBase REST API.</p>
						<p>
							Choosing the <b>GLRI Results Only</b> option limits the results to the
							<a href="https://www.sciencebase.gov/catalog/item/52e6a0a0e4b012954a1a238a">Great Lakes Restoration Initiative</a>
							community of datasets.
						</p>
					</div>
				</div>
			</div>
			<div class="row">
				<div class="col-xs-4" style="width: 400px;">
					<%-- 			<form role="form" id="sb-query-form" action="${context}/sciencebasequery" method="POST"> --%>
					<form id="sb-query-form" action="ScienceBaseService">
						<div class="row">
							<div class="col-xs-12">
								<div class="well">
									<div class="row">
										<div class="col-xs-12">
											<div id="map" class="boundingMap"></div>
										</div>
									</div>
									<div class="row" style="margin-bottom: 20px;">
										<div class="col-xs-5">
											<div class="row">
												<div class="col-xs-12">
													<div class="checkbox">
														<label>
															<input type="checkbox" name="drawBox" id="drawBox" value="box"> Draw Bounds
														</label>
													</div>
												</div>
												<div class="col-xs-12">
													<button id="clearMapButton" type="button" class="btn btn-default btn-xs" style="margin-left: 6px;">Clear Map Filter</button>						
												</div>
											</div>
										</div>
										<div class="col-xs-7" style="padding-right: 19px">
											<div class="row">
												<div class="col-xs-6 boundsGroup">
													<div class="input-group input-group-sm">
														<span class="input-group-addon boundsValue">xMin</span>
														<input id="xmin_label" type="text" class="form-control boundsValue" style="" placeholder="-" disabled>
													</div>
												</div>
												<div class="col-xs-6 boundsGroup">
													<div class="input-group input-group-sm">
														<span class="input-group-addon boundsValue">yMin</span>
														<input id="ymin_label" type="text" class="form-control boundsValue" style="" placeholder="-" disabled>
													</div>
												</div>
											</div>
											<div class="row">
												<div class="col-xs-6 boundsGroup">
													<div class="input-group input-group-sm">
														<span class="input-group-addon boundsValue">xMax</span>
														<input id="xmax_label" type="text" class="form-control boundsValue" style="" placeholder="-" disabled>
													</div>
												</div>
												<div class="col-xs-6 boundsGroup">
													<div class="input-group input-group-sm">
														<span class="input-group-addon boundsValue">yMax</span>
														<input id="ymax_label" type="text" class="form-control boundsValue" style="" placeholder="-" disabled>
													</div>
												</div>
												<input type="hidden" id="spatial" name="spatial" value="">
											</div>
										</div>
									</div>
									<div class="row">
										<div class="col-xs-12">		
											<div class="row" style="padding-bottom: 10px;">
												<div class="col-xs-4">
													<label class="filter_label pull-right">Text Search</label>
												</div>
												<div class="col-xs-8">
													<input type="text" class="form-control" id="text_query" name="text_query" style="width: 98%;">
												</div>
											</div>     
<!--		                                             <div class="row">
												<div class="col-xs-4">
													<label class="filter_label pull-right">Resource Type</label>
												</div>
												<div class="col-xs-8">
													<select class="selectpicker pull-left" name="resource" id="resource_input" title="Any" data-width="98%">
														<option value="">Any</option>
														<option value="Data">Data</option>
														<option value="Publication">Publication</option>
														<option value="Project">Project</option>
													</select>
												</div>
											</div>-->
											<div class="row">
												<div class="col-xs-4">
													<label class="filter_label pull-right">Location Type</label>
												</div>
												<div class="col-xs-8">
													<select class="selectpicker pull-left" id="loc_type_input" name="loc_type" title="Any" data-width="98%">
														<option value="">Any</option>
														<option value="Lake">Lake</option>
														<option value="Watershed">Watershed</option>
														<option value="Channel">Channel</option>
													</select>
												</div>
											</div>
											<div class="row">
												<div class="col-xs-4">
													<label class="filter_label pull-right">Location</label>
												</div>
												<div class="col-xs-8">
													<select class="selectpicker pull-left" id="loc_name_input" name="loc_name" title="Any" data-width="98%">
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
											</div>
											<div class="row">
												<div class="col-xs-4">
													<label class="filter_label pull-right">Focus Area</label>
												</div>
												<div class="col-xs-8">
													<select class="selectpicker pull-left" name="focus" id="focus_input" title="Any" data-width="98%">
														<option value="">Any</option>
														<option value="Toxic Substances">Toxic Substances</option>
														<option value="Invasive Species">Invasive Species</option>
														<option value="Nearshore Health">Nearshore Health</option>
														<option value="Habitat & Wildlife">Habitat &amp; Wildlife</option>
														<option value="Accountability">Accountability</option>
													</select>
												</div>
											</div>
											<div class="row">
												<div class="col-xs-4">
													<label class="filter_label pull-right">Resource Type</label>
												</div>
												<div id="resource_input" class="btn-group-vertical col-xs-7" data-toggle="buttons">
													<label class="btn btn-default active">
														<input type="radio" name="resource" value="Any"/>Any <span class="badge pull-right"></span>
													</label>
													<label class="btn btn-default">
														<input type="radio" name="resource" value="Data"/>Data <span class="badge pull-right"></span>
													</label>
													<label class="btn btn-default">
														<input type="radio" name="resource" value="Publication"/>Publication <span class="badge pull-right"></span>
													</label>
													<label class="btn btn-default">
														<input type="radio" name="resource" value="Project"/>Project <span class="badge pull-right"></span>
													</label>
												</div>
											</div>
											<div class="row" style="margin-top: 10px;">
												<div class="col-xs-12">
													<div class="checkbox pull-left" style="margin-left: 20px;">
														<label style="white-space: nowrap;">
															<input type="checkbox" name="glri_only" id="glri_only" value="true" checked> GLRI Results Only?
														</label>
													</div>
												</div>
											</div>
											<div class="row">
												<div class="col-xs-12">
													<input type="hidden" id="format_input" name="format" value="json">
													<input class="btn btn-primary btn-sm" id="query-submit" type="submit" value="Search"/>
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</form>
				</div>
				<div class="" style="padding-right:20px; margin-top: -50px;">
					<table id="query-results-table">
						<thead>
							<tr>
								<th>Title</th>
								<th>Contact</th>
								<th>Summary</th>
							</tr>
						</thead>
						<tbody>

						</tbody>
					</table>
					</div>
				</div>				
			</div>
		</div>
	</div>
<jsp:include page="template/footer.jsp">
	<jsp:param name="relPath" value="" />
	<jsp:param name="header-class" value="" />
	<jsp:param name="site-url" value="" />
	<jsp:param name="contact-info" value="glri_help@usgs.gov" />
	<jsp:param name="revisedDate" value="${timestamp}" />
	<jsp:param name="buildVersion" value="${project.version}" />
</jsp:include>
    </body>
</html>
