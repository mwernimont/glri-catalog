<!doctype html>
<html lang="en" ng-app="GLRICatalogApp">
	<head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
		<meta name="viewport" content="width=device-width, initial-scale=1"> <%-- Bootstrap mobile scaling directive --%>

		<jsp:include page="template/USGSHead.jsp">
			<jsp:param name="relPath" value="" />
			<jsp:param name="shortName" value="${project.name}" />
			<jsp:param name="title" value="Great Lakes Restoration Initiative (GLRI) Catalog" />
			<jsp:param name="description" value="An application that allows the user to search for GLRI Projects, Datasets and Publications.  Actual data and metadata are kept in ScienceBase (sciencebase.gov)" />
			<jsp:param name="author" value="Great Lakes Restoration Initiative (GLRI), GLRI" />
			<jsp:param name="keywords" value="Great Lakes Restoration Initiative, GLRI, ScienceBase" />
			<jsp:param name="publisher" value="" />
			<jsp:param name="revisedDate" value="${timestamp}" />
			<jsp:param name="nextReview" value="" />
			<jsp:param name="expires" value="Never" />
		</jsp:include>

		<script type="text/javascript" src="webjars/jquery/2.1.0/jquery.js"></script>
		<script type="text/javascript" src="webjars/bootstrap/3.1.1/js/bootstrap.js"></script>
		<script type="text/javascript" src="webjars/bootstrap-select/1.4.2/bootstrap-select.js"></script>
		<script type="text/javascript" src="webjars/angularjs/1.2.13/angular.min.js"></script>

		<script src="js/app/main.js"></script>

		<!-- Twitter Bootstrap -->
		<link rel="stylesheet" type="text/css" href="webjars/bootstrap/3.1.1/css/bootstrap.css"/>
		<link rel="stylesheet" type="text/css" href="webjars/bootstrap-select/1.4.2/bootstrap-select.css"/>

		<!-- Our Bootstrap Theme -->
		<script type="text/javascript" src="style/themes/theme1.js"></script>
		<link rel="stylesheet" type="text/css" href="style/themes/theme1.css"/>

		<!-- Application custom -->
		<link rel="stylesheet" type="text/css" href="css/table.css" />
		<link rel="stylesheet" type="text/css" href="css/custom.css" />

		<!-- OpenLayers -->
		<script type="text/javascript" src="js/lib/OpenLayers/OpenLayers.js"></script>
	</head>
	<body>
		<div class="container">
			<div class="row">
				<div class="col-xs-12">
					<jsp:include page="template/header.jsp">
						<jsp:param name="relPath" value="" />
						<jsp:param name="header-class" value="" />
						<jsp:param name="site-title" value="Great Lakes Restoration Initiative Science Explorer" />
					</jsp:include>
				</div>
			</div>
			<div class="row sub-title">
				<div class="col-xs-12">
					<div class="well well-sm clearfix">
						<h4 class="pull-left">Discover USGS Science in the Great Lakes</h4>
						<img src="style/image/glri_logo.svg" alt="GLRI Logo" class="pull-right"/>
					</div>
				</div>
			</div>
			<div class="row glri_content" ng-controller="CatalogCtrl">
				<div class="col-xs-12 col-sm-4">
					<form id="sb-query-form" action="ScienceBaseService">
						<div class="row">
							<div class="col-xs-12">
								<div class="well">
									<div class="row">
										<div class="col-xs-12">
											<div id="map" class="boundingMap"></div>
										</div>
									</div>
									<div class="row">
										<div class="col-xs-6">
											<div class="checkbox">
												<label>
													<input type="checkbox" name="drawBox" id="drawBox" value="box"> Draw Bounds
												</label>
											</div>
										</div>
										<div class="col-xs-6">
											<button id="clearMapButton" type="button" class="btn btn-default btn-xs" style="margin-left: 6px;">Clear Map Filter</button>						
											<input type="hidden" id="spatial" name="spatial" value="">
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
											<div class="row">
												<div class="col-xs-4">
													<label class="filter_label pull-right">Location Type</label>
												</div>
												<div class="col-xs-8">
													<select class="selectpicker pull-left" id="loc_type_input" name="loc_type" title="Any" data-width="98%" ng-model="locationType" ng-change="updateLocationList()">
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
													<label class="btn btn-default {{facet.initState}}"
														ng-repeat="facet in FACET_DEFS"
														ng-click="filterChange(facet.name)">
														<img ng-src="style/image/blue/{{facet.name | lowercase}}.svg" ng-if="! (facet.isAny)" class="pull-left"/>
														<input name="resource" value="{{facet.name}}" type="radio"></input>{{facet.name}} <span class="badge pull-right"></span>
													</label>
												</div>
											</div>
											<div class="row">
												<div class="col-xs-8 col-xs-offset-2 submit-button">
													<input type="hidden" id="format_input" name="format" value="json">
													<input class="btn btn-primary btn-block" id="query-submit" type="submit" ng-click="doLoad($event)" value="Search"/>
												</div>
											</div>
											<div class="row">
												<div class="col-xs-12">
													<a href="https://www.sciencebase.gov/catalog/" target="_blank" title="ScienceBase, a repository of projects, data and metadata">
														<img src="style/image/PoweredByScienceBase.png" alt="Science Base attribution icon" />
													</a>
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</form>
				</div>
				<div class="col-xs-12 col-sm-8">
					<div class="well well-sm row">
						<div class="col-xs-6">
							
							<div ng-if="hasVisibleResults()" class="result-count top">
								<h4>{{getVisibleResultCount()}} Record(s) found</h4>
							</div>
							<div ng-if="! hasVisibleResults()" class="result-count top">
								<h4>No results match your filter</h4>
							</div>
						</div>
						<div class="col-xs-6">
							<label class="filter_label pull-left">Sort by:&nbsp;</label>
							<select ng-model="orderProp" class="selectpicker pull-left">
								<option value="title">Title</option>
								<option value="summary">Summary</option>
							</select>

						</div>
					</div>
					<div class="row">
						<div class="col-xs-12">
							<!--Body content-->

							<ul class="result-records">
								<li ng-repeat="record in records | orderBy:orderProp" class="{{record.resource}}">
									<div class="resource-icon">
										<a title="{{record.resource}}: Click to go directly to this record in ScienceBase" href="{{record.url}}" target="_blank">
											<img ng-src="style/image/blue/{{record.resource}}.svg" />
										</a>
									</div>
									<h4>{{record.title}}</h4>
									<p class="point-of-contact">{{record.contact}}</p>
									<div class="related-links">
										<div ng-if="record.project_url">
											<a href="{{record.project_url}}">Project Home Page</a>
										</div>
										<div ng-if="record.publication_url">
											<a href="{{record.publication_url}}">Publication Home Page</a>
										</div>
										<div ng-if="record.data_download_url">
											<a href="{{record.data_download_url}}">Download Dataset</a>
										</div>
									</div>
									<p class="summary">{{record.summary}}</p>

								</li>
							</ul>

						</div>
					</div>
					<div class="well well-sm row" ng-if="hasVisibleResults()">
						<div class="col-xs-6">
							
							<div class="result-count top">
								<h4>{{getVisibleResultCount()}} Record(s) found</h4>
							</div>
						</div>
						<div class="col-xs-6">
							<label class="filter_label pull-left">Sort by:&nbsp;</label>
							<select ng-model="orderProp" class="selectpicker pull-left">
								<option value="title">Title</option>
								<option value="summary">Summary</option>
							</select>
						</div>
					</div>
				</div>				
			</div>
			<div class="row">
				<div class="col-xs-12">
					<jsp:include page="template/footer.jsp">
						<jsp:param name="relPath" value="" />
						<jsp:param name="header-class" value="" />
						<jsp:param name="site-url" value="" />
						<jsp:param name="contact-info" value="<a href=\"mailto:glri_help@usgs.gov\">glri_help@usgs.gov</a>" />
						<jsp:param name="revisedDate" value="${timestamp}" />
						<jsp:param name="buildVersion" value="${project.version}" />
					</jsp:include>
				</div>
			</div>
		</div>
	</body>
</html>