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
		<script type="text/javascript" src="webjars/angularjs/1.2.16/angular.js"></script>
		<script type="text/javascript" src="webjars/angular-ui-bootstrap/0.10.0/ui-bootstrap-tpls.js"></script>

		<script type="text/javascript" src="js/app/main.js"></script>
		<script type="text/javascript" src="js/app/cida-analytics.js"></script>

		<!-- Twitter Bootstrap -->
		<link rel="stylesheet" type="text/css" href="webjars/bootstrap/3.1.1/css/bootstrap.css"/>

		<!-- Our Bootstrap Theme -->
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
					<div id="title-header" class="well well-sm clearfix">
						<h4 class="pull-left">Discover USGS Science in the Great Lakes</h4>
						<img src="style/image/glri_logo.svg" alt="GLRI Logo" class="pull-right"/>
					</div>
				</div>
			</div>
			<div class="row glri_content" ng-controller="CatalogCtrl">
				<div class="col-xs-12 col-sm-4">
					<form id="sb-query-form" class="form-horizontal" action="ScienceBaseService">
						<div class="row">
							<div class="col-xs-12">
								<div class="well">
									<div class="row map">
										<div class="col-xs-12">
											<div id="map" class="boundingMap"></div>
										</div>
									</div>
									<div class="row">
										<div class="col-xs-12 map-contols">
											<div class="btn-group">
												<button type="button" class="btn btn-default btn-sm" ng-model="drawingBounds" btn-radio="false">Drag Map</button>
												<button type="button" class="btn btn-default btn-sm" ng-model="drawingBounds" btn-radio="true">Draw Bounds</button>
											</div>
										</div>
									</div>
									<div class="form-group">
										<label class="control-label col-xs-4">Text Search</label>
										<div class="col-xs-8">
											<input type="text" class="form-control" id="text_query" name="text_query" ng-model="model.text_query">
										</div>
									</div> 
									<div class="form-group">
										<label class="control-label col-xs-4">Location Type</label>
										<div class="col-xs-8">
											<select class="form-control" id="loc_type_input" name="loc_type" title="Any" ng-model="model.loc_type" ng-change="updateLocationList()">
												<option value="">Any</option>
												<option value="Lake">Lake</option>
												<option value="Watershed">Watershed</option>
												<option value="Channel">Channel</option>
											</select>
										</div>
									</div>
									<div class="form-group">
										<label class="control-label col-xs-4">Location</label>
										<div class="col-xs-8">
											<select class="form-control" id="loc_name_input" ng-model="model.loc_name" name="loc_name" title="Any">
												<option value="">Any</option>
												<optgroup label="Lakes" ng-disabled="model.loc_type != '' &amp;&amp; model.loc_type != 'Lake'">
													<option value="Lake:Lake Michigan">Lake Michigan</option>
													<option value="Lake:Lake Erie">Lake Erie</option>
													<option value="Lake:Lake Huron">Lake Huron</option>
													<option value="Lake:Lake Superior">Lake Superior</option>
													<option value="Lake:Lake Ontario">Lake Ontario</option>
													<option value="Lake:Lake St. Clair">Lake St. Clair</option>
												</optgroup>
												<optgroup label="Watersheds" ng-disabled="model.loc_type != '' &amp;&amp; model.loc_type != 'Watershed'">
													<option value="Watershed:Lake Michigan Basin">Lake Michigan Basin</option>
													<option value="Watershed:Lake Erie Basin">Lake Erie Basin</option>
													<option value="Watershed:Lake Huron Basin">Lake Huron Basin</option>
													<option value="Watershed:Lake Superior Basin">Lake Superior Basin</option>
													<option value="Watershed:Lake Ontario Basin">Lake Ontario Basin</option>
													<option value="Watershed:Lake St. Clair Basin">Lake St. Clair Basin</option>
												</optgroup>
												<optgroup label="Channels" ng-disabled="model.loc_type != '' &amp;&amp; model.loc_type != 'Channel'">
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
										<label class="col-xs-4 control-label">Focus Area</label>
										<div class="col-xs-8">
											<select class="form-control" name="focus" id="focus_input" title="Any" ng-model="model.focus">
												<option value="">Any</option>
												<option value="Toxic Substances">Toxic Substances</option>
												<option value="Invasive Species">Invasive Species</option>
												<option value="Nearshore Health">Nearshore Health</option>
												<option value="Habitat & Wildlife">Habitat &amp; Wildlife</option>
												<option value="Accountability">Accountability</option>
											</select>
										</div>
									</div>
									<div class="form-group">
										<label class="col-xs-4 control-label">Resource Type</label>
										<div id="resource_input" class="btn-group-vertical col-xs-8">
											<button type="button" class="btn btn-default val-{{facet.name}}" ng-repeat="facet in FACET_DEFS" ng-model="model.resourceFilter" btn-radio="facet.name">
												<img ng-src="style/image/blue/{{facet.name | lowercase}}.svg" ng-if="! (facet.isAny)" class="pull-left"/>
												<span ng-if="! (facet.isAny)" class="badge pull-right"></span>
												<span class="value">{{facet.name}}</span>
											</button>
										</div>
									</div>
									<div class="row">
										<div id="sb-query-form-footer-controls" class="col-xs-12">
											<input type="hidden" id="format_input" name="format" value="json">
											<button type="reset" class="btn btn-default pull-left" id="sb-query-clear" ng-click="clearForm($event)">Clear Form</button>
											<button type="submit" class="btn btn-primary pull-right" id="sb-query-submit" ng-click="doRemoteLoad($event)">Search</button>
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
					</form>
				</div>
				<div class="col-xs-12 col-sm-8">
					<div class="row">
						<div class="col-xs-12">
							<div class="well well-sm clearfix result-header">
								<div class=""row>
									<div class="col-xs-6 record-display-status">
										<div ng-if="filteredRecords.length > 0" class="result-header">
											<h4>{{filteredRecords.length}} results, showing {{pageCurrentFirstRecordIndex + 1}} - {{pageCurrentLastRecordIndex + 1}}</h4>
										</div>
										<div ng-if="(!filteredRecords) || filteredRecords.length < 1" class="result-header">
											<h4>No results match your filter</h4>
										</div>
									</div>
									<div class="col-xs-6 sort-options form-horizontal">
										<div class="form-group">
											<label class="control-label col-xs-4">Sort by:&nbsp;</label>
											<div class="col-xs-8">
												<select class="form-control" ng-model="orderProp" ng-change="sortChange()" data-width="auto">
													<option ng-repeat="sortOption in SORT_OPTIONS" value="{{sortOption.key}}">{{sortOption.display}}</option>
												</select>
											</div>
										</div>
									</div>
								</div>
								<div class=""row ng-if="filteredRecords.length > 0">
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
											<a href="" class="item" ng-repeat="ps in pageRecordsPerPageOptions" ng-class="(pageSize==ps)?'current':'non-current'" ng-click="setPageSize(ps)">{{ps}}</a>
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

							<ul class="result-records">
								<li ng-repeat="record in pageRecords" class="{{record.resource}}">
									<div class="resource-icon">
										<a title="{{record.resource}}: Click to go directly to this record in ScienceBase" href="{{record.url}}" target="_blank">
											<img ng-src="style/image/blue/{{record.resource}}.svg" />
										</a>
									</div>
									<h4>{{record.title}}</h4>
									<p class="point-of-contact">{{record.contactText}}</p>
									<div class="related-links">
										<div ng-if="record.mainLink">
											<a href="{{record.mainLink.url}}">{{record.mainLink.title}}</a>
										</div>
									</div>
									<p class="summary">{{record.summary}}</p>

								</li>
							</ul>
							
							<div ng-if="resultItems.length > 0 &amp;&amp; filteredRecords.length == 0" id="records-blocked-by-filter" class="panel panel-warning">
								<div class="panel-heading"><h3>Records hidden by filter</h3></div>
								<div class="panel-body">
									There are results from your query, but they are blocked by the <i>Resource Type</i> filter.
									Select one of the resource types that is not marked with a <span class="badge">0</span>.
								</div>
							</div>

						</div>
					</div>
					<div class="row" ng-show="filteredRecords.length > 2">
						<div class="col-xs-12">
							<div class="well well-sm clearfix result-footer">
								<div class=""row>
									<div class="col-xs-6 record-display-status">
										<div>
											<h4>{{filteredRecords.length}} results, showing {{pageCurrentFirstRecordIndex + 1}} - {{pageCurrentLastRecordIndex + 1}}</h4>
										</div>
									</div>
									<div class="col-xs-6 sort-options form-horizontal">
										<div class="form-group">
											<label class="control-label col-xs-4">Sort by:&nbsp;</label>
											<div class="col-xs-8">
												<select class="form-control" ng-model="orderProp" ng-change="sortChange()" data-width="auto">
													<option ng-repeat="sortOption in SORT_OPTIONS" value="{{sortOption.key}}">{{sortOption.display}}</option>
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
											<a href="" class="item" ng-repeat="ps in pageRecordsPerPageOptions" ng-class="(pageSize==ps)?'current':'non-current'" ng-click="setPageSize(ps)">{{ps}}</a>
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