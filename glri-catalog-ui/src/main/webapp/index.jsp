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
			<jsp:param name="title" value="Great Lakes Restoration Initiative (GLRI) Catalog" />
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

		<script type="text/javascript" src="${pageScope.rootPath}js/app/main.js"></script>
		<script type="text/javascript" src="${pageScope.rootPath}browse/js/app/directives.js"></script>
		<script type="text/javascript" src="${pageScope.rootPath}js/app/cida-analytics.js"></script>
		<script type="application/javascript" src="http://www.usgs.gov/scripts/analytics/usgs-analytics.js"></script>

		<!-- Twitter Bootstrap & theme-->
		<link rel="stylesheet" type="text/css" href="${pageScope.rootPath}webjars/bootstrap/3.1.1/css/bootstrap.css"/>
		<link rel="stylesheet" type="text/css" href="${pageScope.rootPath}style/themes/theme1.css"/>

		<!-- Application custom -->
		<link rel="stylesheet" type="text/css" href="${pageScope.rootPath}css/custom.css" />
	</head>
	<body>
		<div class="container">
			<div class="row">
				<div class="col-xs-12">
					<jsp:include page="${pageScope.rootPath}template/header.jsp">
						<jsp:param name="relPath" value="${pageScope.rootPath}" />
						<jsp:param name="header-class" value="" />
						<jsp:param name="site-title" value="Great Lakes RESTORATION Initiative Science Explorer" />
						<jsp:param name="site-sub-title" value="Discover USGS Science in the Great Lakes" />
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
												<option value="Habitat & Wildlife">Habitat &amp; Wildlife</option>
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
											<button type="button" class="btn btn-default val-{{name}}" ng-repeat="(key, name) in FACET_DEFS" ng-model="userState.resourceFilter" btn-radio="key">
												<img ng-src="${pageScope.rootPath}style/image/darkblue/{{name | lowercase}}.svg" ng-if="key != '1'" class="pull-left"/>
												<div class="noImgPadding" ng-if="key==='1'"></div>
												<span ng-if="key != '1'" class="badge pull-right"></span>
												<span class="value" ng-bind-html="name"></span>
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
					<div class="row">
						<div class="col-xs-12">
							<div class="well well-sm clearfix result-header" ng-if="filteredRecords.length > 0">
								<div class="row">
									<div class="col-xs-6 record-display-status">
										<h4>{{filteredRecords.length}} results, showing {{pageCurrentFirstRecordIndex + 1}} - {{pageCurrentLastRecordIndex + 1}}</h4>
									</div>
									<div class="col-xs-6 sort-options form-horizontal">
										<div class="form-group">
											<label class="control-label col-xs-4">Sort by:&nbsp;</label>
											<div class="col-xs-8">
												<select class="form-control" ng-model="userState.orderProp" ng-change="sortChange()" data-width="auto">
													<option ng-repeat="sortOption in SORT_OPTIONS" value="{{sortOption.key}}" ng-bind-html="sortOption.display"></option>
												</select>
											</div>
										</div>
									</div>
								</div>
								<div class="row">
									<div class="col-xs-6 col-sm-12 col-md-6 page-nav">
										<p>
											<a href="" class="previous" ng-class="pageHasPrevious?'has-previous':'has-no-previous'" ng-click="gotoPreviousPage()">&lt; Previous</a>
											<span class="selectable-list" ng-class="($index == pageCurrent)?'selected':''" ng-repeat="page in pageList">
												<span class="item current page-number" ng-if="$index == pageCurrent" >{{$index + 1}}</span>
												<a href="" class="item non-current selectable-list page-number" ng-if="$index != pageCurrent" ng-click="gotoPage($index)">{{$index + 1}}</a>
											</span>
											<a href="" class="next" ng-class="pageHasNext?'has-next':'has-no-next'" ng-click="gotoNextPage()">Next &gt;</a>
										</p>
									</div>
									<div class="col-xs-6 col-sm-12 col-md-6 page-nav-settings text-right">
										<span class="selectable-list">
											<span>Show</span>
											<a href="" class="item" ng-repeat="ps in pageRecordsPerPageOptions" ng-class="(pageSize==ps)?'current':'non-current'" 
											ng-click="setPageSize(ps)" ng-bind="ps"></a>
											<span>results per page</span>
										</span>
									</div>
								</div>
							</div>
						</div>
					</div>
					<div class="row">
						<div class="col-xs-12">
							<!--Body content-->
							
							<div class="well well-sm clearfix" ng-if="isUIFresh">
								<h4>Welcome to the Great Lakes Restoration Initiative Science Explorer!</h4>
								<p>The Great Lakes Restoration Initiative (GLRI) is a wide-ranging,
									coordinated effort between many organizations and individuals to help the Great Lakes recover economically and ecologically.
									Driven by cross-disciplinary integrative science and conducted in collaboration with partners,
									U.S. Geological Survey (USGS) researchers are working to provide resource managers with the information and
									decision-making tools they need to help restore the Great Lakes.
								</p>

								<h4>What is the GLRI Science Explorer?</h4>
								<p>The GLRI Science Explorer is a search tool that allows you to seek out and
									discover the valuable research USGS scientists are conducting in the Great Lakes region.
								</p>

								<h4>How does it work?</h4>
								<ul>
									<li>With the search tool you can find information about current and past science projects.
										Each project record provides details about a study (e.g. study start date, description/abstract,
										principle investigator and location).</li>
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
							
							<glri-loading state="isSearching"></glri-loading>
							
							<ul id="glri-records" class="result-records">
								<li ng-repeat="record in pageRecords" ng-class="record.resource">
									<div class="resource-icon">
										<a title="{{record.resource}}: Click to go directly to this record in ScienceBase" href="{{record.url}}" target="_blank">
											<img ng-src="${pageScope.rootPath}style/image/darkblue/{{record.resource}}.svg" />
										</a>
									</div>
									<h4 ng-bind-html="record.title"></h4>
									<p class="point-of-contact" ng-bind-html="record.contactText"></p>
									<div class="related-links" ng-if="record.mainLink || (record.hasChildren == true)">
										<div ng-if="record.mainLink">
											<a href="{{record.mainLink.url}}" target="_blank" ng-bind-html="record.mainLink.title"></a>
										</div>
										<div ng-if="record.hasChildren == true">
											<a href="" ng-click="toggleChildItems(record)">Publications and Datasets
												<span ng-if="record.childRecordState == 'notloaded'"><span class="glyphicon glyphicon-chevron-down"></span></span>
												<span ng-if="record.childRecordState == 'loading'"><span class="glyphicon glyphicon-repeat"></span></span>
												<span ng-if="record.childRecordState == 'complete'"><span class="glyphicon glyphicon-remove-circle"></span></span>
												<span ng-if="record.childRecordState == 'failed'"><span class="glyphicon glyphicon-warning-sign"></span></span>
												<span ng-if="record.childRecordState == 'closed'"><span class="glyphicon glyphicon-eye-open"></span></span>
											</a>
										</div>
									</div>
									<p class="summary" ng-bind-html="record.summary"></p>
									
									<glri-loading state="record.childRecordState"></glri-loading>
									
									<div ng-if="record.childItems &amp;&amp; record.childRecordState == 'complete'" class="child-records">
										<div class="list-head clearfix">
											<div class="pull-right"><a href="" ng-click="toggleChildItems(record)">Close child list <span class="glyphicon glyphicon-remove-circle"></span></a></div>
											<h4>{{record.childItems.length}} Child record(s) (projects and datasets)</h4>
										</div>
										<ul>
											<li ng-repeat="child in record.childItems" ng-class="child.resource">
												<div class="resource-icon">
													<a title="{{child.resource}}: Click to go directly to this record in ScienceBase" href="{{child.url}}" target="_blank">
														<img ng-src="${pageScope.rootPath}style/image/darkblue/{{child.resource}}.svg" />
													</a>
												</div>
												<h4 ng-bind-html="child.title"></h4>
												<p class="point-of-contact" ng-bind-html="child.contactText"></p>
												<div class="related-links">
													<div ng-if="child.mainLink">
														<a href="{{child.mainLink.url}}" target="_blank" ng-bind-html="child.mainLink.title"></a>
													</div>
												</div>
												<p class="summary" ng-bind-html="child.summary"></p>
											</li>
										</ul>
										<div class="list-foot clearfix">
											<div class="pull-right"><a href="" ng-click="toggleChildItems(record)">Close child list <span class="glyphicon glyphicon-remove-circle"></span></a></div>
										</div>
									</div>
								</li>
							</ul>
							
							<div ng-if="resultItems.length > 0 &amp;&amp; filteredRecords.length == 0" id="records-blocked-by-filter" class="panel panel-warning no-records">
								<div class="panel-heading"><h3>Records hidden by filter</h3></div>
								<div class="panel-body">
									Hold on! There <em>are</em> results from your query, but they are blocked by the <i>Resource Type</i> filter.
									The little black ovals (<span class="badge">0</span>) indicate how many records were found for each resource type.
								</div>
							</div>
							
							<div ng-if="resultItems.length == 0 &amp;&amp; !isUIFresh" id="no-records-found" class="panel panel-warning no-records">
								<div class="panel-heading"><h3>No Records Found</h3></div>
								<div class="panel-body">
									Ah snap!  None of the records in the system match the criteria you were looking for.
								</div>
							</div>

						</div>
					</div>
					<div class="row" ng-show="filteredRecords.length > 2">
						<div class="col-xs-12">
							<div class="well well-sm clearfix result-footer">
								<div class="row">
									<div class="col-xs-6 record-display-status">
										<div>
											<h4>{{filteredRecords.length}} results, showing {{pageCurrentFirstRecordIndex + 1}} - {{pageCurrentLastRecordIndex + 1}}</h4>
										</div>
									</div>
									<div class="col-xs-6 sort-options form-horizontal">
										<div class="form-group">
											<label class="control-label col-xs-4">Sort by:&nbsp;</label>
											<div class="col-xs-8">
												<select class="form-control" ng-model="userState.orderProp" ng-change="sortChange()" data-width="auto">
													<option ng-repeat="sortOption in SORT_OPTIONS" value="{{sortOption.key}}" ng-bind-html="sortOption.display"></option>
												</select>
											</div>
										</div>
									</div>
								</div>
								<div class=""row>
									<div class="col-xs-6 col-sm-12 col-md-6 page-nav">
										<p>
											<a href="" class="previous" ng-class="pageHasPrevious?'has-previous':'has-no-previous'" ng-click="gotoPreviousPage()">&lt; Previous</a>
											<span class="selectable-list" ng-class="($index == pageCurrent)?'selected':''" ng-repeat="page in pageList">
												<span class="item current page-number" ng-if="$index == pageCurrent" >{{$index + 1}}</span>
												<a href="" class="item non-current selectable-list page-number" ng-if="$index != pageCurrent" ng-click="gotoPage($index)">{{$index + 1}}</a>
											</span>
											<a href="" class="next" ng-class="pageHasNext?'has-next':'has-no-next'" ng-click="gotoNextPage()">Next &gt;</a>
										</p>
									</div>
									<div class="col-xs-6 col-sm-12 col-md-6 page-nav-settings text-right" ng-if="filteredRecords.length > 0">
										<span class="selectable-list">
											<span>Show</span>
											<a href="" class="item" ng-repeat="ps in pageRecordsPerPageOptions" ng-class="(pageSize==ps)?'current':'non-current'" 
												ng-click="setPageSize(ps)" ng-bind="ps"></a>
											<span>results per page</span>
										</span>
									</div>
								</div>
							</div>
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