<!doctype html>
<html lang="en" ng-app="GLRICatalogApp">
	<head>
		<%
			//Set a relative path to the root (useful when pages are not at the root)
			pageContext.setAttribute("rootPath", "./");
		%>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
		<meta name="viewport" content="width=device-width, initial-scale=1" /> <%-- Bootstrap mobile scaling directive --%>

		<link href="${pageScope.rootPath}favicon.ico" rel="shortcut icon" type="image/x-icon" />
		
		<jsp:include page="${pageScope.rootPath}template/USGSHead.jsp">
			<jsp:param name="relPath" value="${pageScope.rootPath}" />
			<jsp:param name="shortName" value="${project.name}" />
			<jsp:param name="title" value="Great Lakes Restoration Initiative (GLRI) Science Explorer" />
			<jsp:param name="description" value="An application that allows the user to search for GLRI Projects, Datasets and Publications.  Actual data and metadata are kept in ScienceBase (sciencebase.gov)" />
			<jsp:param name="author" value="Great Lakes Restoration Initiative (GLRI), GLRI" />
			<jsp:param name="keywords" value="Great Lakes Restoration Initiative, GLRI, ScienceBase" />
			<jsp:param name="publisher" value="" />
			<jsp:param name="revisedDate" value="${timestamp}" />
			<jsp:param name="nextReview" value="" />
			<jsp:param name="expires" value="Never" />
		</jsp:include>

		<script type="text/javascript" src="${pageScope.rootPath}webjars/jquery/2.1.0/jquery.js"></script>
		<script type="text/javascript" src="${pageScope.rootPath}webjars/angularjs/1.2.16/angular.js"></script>
		<script type="text/javascript" src="${pageScope.rootPath}webjars/angular-sanitize/1.2.16/angular-sanitize.js"></script>
		<script type="text/javascript" src="${pageScope.rootPath}webjars/angular-ui-bootstrap/0.10.0/ui-bootstrap-tpls.js"></script>
		<script type="text/javascript" src="${pageScope.rootPath}webjars/openlayers/2.13.1/OpenLayers.js"></script>

		<script type="text/javascript" src="${pageScope.rootPath}browse/js/app/main.js"></script>
		<script type="text/javascript" src="${pageScope.rootPath}browse/js/app/focusAreaManager.js"></script>
		<script type="text/javascript" src="${pageScope.rootPath}browse/js/app/sciencebase.js"></script>
		<script type="text/javascript" src="${pageScope.rootPath}browse/js/app/recordManager.js"></script>		
		<script type="text/javascript" src="${pageScope.rootPath}js/app/pagination.js"></script>
		<script type="text/javascript" src="${pageScope.rootPath}js/app/main.js"></script>
		<script type="text/javascript" src="${pageScope.rootPath}browse/js/app/directives.js"></script>
		<script type="text/javascript" src="${pageScope.rootPath}js/app/cida-analytics.js"></script>
		<script type="application/javascript" src="http://www.usgs.gov/scripts/analytics/usgs-analytics.js"></script>

		<!-- Twitter Bootstrap & theme-->
		<link rel="stylesheet" type="text/css" href="${pageScope.rootPath}webjars/bootstrap/3.1.1/css/bootstrap.css"/>
		<link rel="stylesheet" type="text/css" href="${pageScope.rootPath}style/themes/theme1.css"/>

		<!-- Application custom -->
		<link rel="stylesheet" type="text/css" href="${pageScope.rootPath}css/glri.css" />
	</head>
	<body>
		<div class="container">
			<div class="row">
				<div class="col-xs-12">
					<jsp:include page="${pageScope.rootPath}template/header.jsp">
						<jsp:param name="relPath" value="${pageScope.rootPath}" />
						<jsp:param name="header-class" value="" />
						<jsp:param name="site-title" value="Great Lakes Restoration Initiative (GLRI)" />
					</jsp:include>
				</div>
			</div>
			<div class="row glri_content" ng-controller="CatalogCtrl">
				<div class="col-xs-12 col-sm-3">
					<form id="sb-query-form" class="form-horizontal" action="ScienceBaseService">
						<div class="row">
							<div class="col-xs-12">
								<div id="nav" class="well">
									<div id="navBrowse" class="btn-group">
										<a preventDefault ng-repeat="nav in transient.nav" ng-bind-html="nav.title" 
												class="btn btn-primary btn-horizontal" href="{{'browse/index.jsp#'+nav.title}}"
												ng-class="navShow(nav.title) ?'active' :'' "></a>
									</div>
									<hr/>
									<div class="row map">
										<div class="col-xs-12">
											<div id="map" class="boundingMap"></div>
										</div>
									</div>
									<div class="row">
										<div class="col-xs-12 map-contols">
											<div class="btn-group" tooltip-placement="right" tooltip="Drag on the map to either: move the map, or, draw a bounding box to limit search results to the boxed area.">
												<button type="button" class="btn btn-primary btn-sm" ng-model="userState.drawingBounds" btn-radio="false">Drag Map</button>
												<button type="button" class="btn btn-primary btn-sm" ng-model="userState.drawingBounds" btn-radio="true">Draw Bounds</button>
											</div>
										</div>
									</div>
									<div class="form-group">										
										<div>
											<input placeholder="Text Search" type="text" class="form-control" id="text_query" name="text_query" ng-model="model.text_query" tooltip-placement="right" tooltip="Search on all text fields, &QUOT;water soil&QUOT; would find only records that contain BOTH terms.">
										</div>
									</div> 
									<div class="form-group">
										<div>
											<select class="form-control" ng-model="model.location" name="location" tooltip-placement="right" tooltip="Limit results to a specific water feature, or a type of one.">
												<option value="" disabled selected>Water Feature</option>
												<option value="">Any Water Feature</option>
												<optgroup label="Lakes">
													<option class="any-option" value="Lake">~Any of the Lakes~</option>
													<option value="Lake:Lake Michigan">Lake Michigan</option>
													<option value="Lake:Lake Erie">Lake Erie</option>
													<option value="Lake:Lake Huron">Lake Huron</option>
													<option value="Lake:Lake Superior">Lake Superior</option>
													<option value="Lake:Lake Ontario">Lake Ontario</option>
													<option value="Lake:Lake St. Clair">Lake St. Clair</option>
												</optgroup>
												<optgroup label="Watersheds">
													<option class="any-option" value="Watershed">~Any of the Watersheds~</option>
													<option value="Watershed:Lake Michigan Basin">Lake Michigan Basin</option>
													<option value="Watershed:Lake Erie Basin">Lake Erie Basin</option>
													<option value="Watershed:Lake Huron Basin">Lake Huron Basin</option>
													<option value="Watershed:Lake Superior Basin">Lake Superior Basin</option>
													<option value="Watershed:Lake Ontario Basin">Lake Ontario Basin</option>
													<option value="Watershed:Lake St. Clair Basin">Lake St. Clair Basin</option>
												</optgroup>
												<optgroup label="Channels">
													<option class="any-option" value="Channel">~Any of the Channels~</option>
													<option value="Channel:St. Mary's Channel">St. Mary's Channel</option>
													<option value="Channel:St. Lawrence Channel">St. Lawrence Channel</option>
													<option value="Channel:Detroit Channel">Detroit Channel</option>
													<option value="Channel:Niagara Channel">Niagara Channel</option>
													<option value="Channel:St. Clair/Detroit River System">St. Clair/Detroit River Sys</option>
												</optgroup>
											</select>
										</div>
									</div>
									<div class="form-group">
										<div>
											<select class="form-control" name="focus" id="focus_input" title="Any" ng-model="model.focus" tooltip-placement="right" tooltip="Limit results to a GLRI funding area/category.">
												<option value="" disabled selected>Focus Area</option>
												<option value="">Any Focus Area</option>
												<option value="Toxic Substances">Toxic Substances</option>
												<option value="Invasive Species">Invasive Species</option>
												<option value="Nearshore Health">Nearshore Health</option>
												<option value="Habitat %26 Wildlife">Habitat &amp; Wildlife</option>
												<option value="Accountability">Accountability</option>
											</select>
										</div>
									</div>
									<div class="form-group">
										<div>
											<select class="form-control" name="template" id="template_input" title="Any" ng-model="model.template" tooltip-placement="right" tooltip="Limit results to a GLRI funding template. Projects are associated with one or more templates.">
												<option value="" disabled selected>Template</option>
												<option ng-repeat="entry in transient.templateValues | orderBy:'sort'" value="{{entry.key}}" ng-bind-html="entry.display"></option>
											</select>
										</div>
									</div>
									<div class="form-group">
										<div id="resource_input" class="btn-group-vertical" style="width:100%" tooltip-placement="right" tooltip="Narrow the results to a resource type such as &QUOT;Data&QUOT; for datasets or &QUOT;Project&QUOT; for a USGS GLRI study. A Project may have associated Data and/or Publications.">
											<label class="control-label">Resource Type</label>
											<button type="button" class="btn btn-default val-{{name}}" ng-repeat="category in FACET_DEFS" ng-model="userState.resourceFilter" btn-radio="$index">
												<img ng-src="${pageScope.rootPath}style/image/darkblue/{{category | lowercase}}.svg" ng-if="$index !== 0" class="pull-left"/>
												<div class="noImgPadding" ng-if="$index === 0"></div>
												<span class="badge pull-right" ng-if="$index !== 0" ng-bind="currentFacets[category]"></span>
												<span class="value" ng-bind-html="category"></span>
											</button>
										</div>
									</div>
									<div class="row">
										<div id="sb-query-form-footer-controls" class="col-xs-12">
											<input type="hidden" id="format_input" name="format" value="json">
											<button type="reset" class="btn btn-primary pull-left" id="sb-query-clear" ng-click="clearForm($event)">Clear Form</button>
											<button type="submit" class="btn btn-primary pull-right" id="sb-query-submit" ng-click="doRemoteLoad($event)">Search</button>
										</div>
									</div>
									<div class="row">
										<div class="col-xs-12">	
											<a href="https://www.sciencebase.gov/catalog/items?community=Great+Lakes+Restoration+Initiative" target="_blank" title="ScienceBase, a repository of projects, data and metadata">
												<img width="206" src="${pageScope.rootPath}style/image/darkblue/sciencebase.png" alt="Science Base attribution icon" />
											</a>
										</div>
									</div>
								</div>
							</div>
						</div>
					</form>
				</div>
				<div id="searchResults" class="col-xs-12 col-sm-8">
					<pagerui></pagerui>

					<div class="row">
						<div class="col-xs-12">
							<!--Body content-->
							
							<div class="well well-sm clearfix" ng-if="isUIFresh">
								<strong style="color:#036;font-size:16px">Welcome to the Great Lakes RESTORATION Initiative Science Explorer!</strong>
								<br>
								<i style="color:#036">Discover USGS Science in the Great Lakes</i>
								<br>
								<br>
								<p>The Great Lakes Restoration Initiative (GLRI) is a wide-ranging, coordinated effort between many organizations and individuals to help the Great Lakes recover economically and ecologically. Driven by cross-disciplinary integrative science and conducted in collaboration with partners, U.S. Geological Survey (USGS) researchers are working to provide resource managers with the information and decision-making tools they need to help restore the Great Lakes.
								</p>

								<strong>What is the GLRI Science Explorer?</strong>
								<br>
								<p>The GLRI Science Explorer is a search tool that allows you to seek out and discover the valuable research USGS scientists are conducting in the Great Lakes region.
								</p>

								<strong>How does it work?</strong>
								<ul>
									<li>With the search tool you can find information about current and past science projects. Each project record provides details about a study (e.g. study start date, description/abstract, principle investigator and location).</li>
									<li>For each project you can learn about associated information products, data sets and publications, that resulted from the projects.</li>
								</ul>
								
								<p class="gap-lg">
									<a href="http://www.usgs.gov/" target="_blank" class="pull-left">
										<img style="height: 49px; width: 134px;" src="${pageScope.rootPath}style/image/usgsblack.png" alt="USGS Logo - Science for a changing world"/>
									</a>
									<a href="http://cida.usgs.gov/glri/" target="_blank" class="pull-right">
										<img style="height: 49px; width: 158px;" src="${pageScope.rootPath}style/image/darkblue/glri_logo.svg" alt="GLRI Logo - Great Lakes Restoration Initiative"/>
									</a>
								</p>
							</div>

							<div ng-if=" ! isUIFresh && resultItems.length > 0 && filteredRecordCount == 0" id="records-blocked-by-filter" class="panel panel-warning no-records">
								<div class="panel-heading"><h3>Records hidden by filter</h3></div>
								<div class="panel-body">
									There <em>are</em> results from your query, but they are blocked by the <i>Resource Type</i> filter.
									The little black ovals (<span class="badge">0</span>) indicate how many records were found for each resource type.
								</div>
							</div>
							
							<div ng-if=" ! isUIFresh && resultItems.length == 0" id="no-records-found" class="panel panel-warning no-records">
								<div class="panel-heading"><h3>No Records Found</h3></div>
								<div class="panel-body">
									None of the records in the system match the criteria you were looking for.
								</div>
							</div>

							
							<glri-loading state="isSearching"></glri-loading>
							
							
						</div>
					</div>	
					
				</div>				
			</div>
			<div class="row">
				<div class="col-xs-12">
					<jsp:include page="${pageScope.rootPath}template/footer.jsp">
						<jsp:param name="relPath" value="${pageScope.rootPath}" />
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