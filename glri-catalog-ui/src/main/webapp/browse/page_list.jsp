<!doctype html>
<html lang="en" ng-app="GLRICatalogApp">
	<head>
		<%
			//Set a relative path to the root (useful when pages are not at the root)
			pageContext.setAttribute("rootPath", "../");
		%>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
		<meta name="viewport" content="width=device-width, initial-scale=1" /> <%-- Bootstrap mobile scaling directive --%>

		<link href="${pageScope.rootPath}favicon.ico" rel="shortcut icon" type="image/x-icon" />
		
		<jsp:include page="${pageScope.rootPath}template/USGSHead.jsp">
			<jsp:param name="relPath" value="${pageScope.rootPath}" />
			<jsp:param name="shortName" value="${project.name}" />
			<jsp:param name="title" value="Great Lakes Restoration Initiative (GLRI) Home" />
			<jsp:param name="description" value="The GLRI home page with infomation about all GLRI projects." />
			<jsp:param name="author" value="Great Lakes Restoration Initiative (GLRI), GLRI" />
			<jsp:param name="keywords" value="Great Lakes Restoration Initiative, GLRI, ScienceBase" />
			<jsp:param name="publisher" value="" />
			<jsp:param name="revisedDate" value="${timestamp}" />
			<jsp:param name="nextReview" value="" />
			<jsp:param name="expires" value="Never" />
		</jsp:include>

		<script type="text/javascript" src="${pageScope.rootPath}webjars/jquery/2.1.0/jquery.js"></script>
		<script type="text/javascript" src="${pageScope.rootPath}webjars/angularjs/1.2.16/angular.js"></script>
		<script type="text/javascript" src="${pageScope.rootPath}webjars/angular-ui-bootstrap/0.10.0/ui-bootstrap-tpls.js"></script>
		<script type="text/javascript" src="${pageScope.rootPath}webjars/openlayers/2.13.1/OpenLayers.js"></script>

		<script type="text/javascript" src="js/app/main_page_list.js"></script>
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
						<jsp:param name="relPath" value="../" />
						<jsp:param name="header-class" value="" />
						<jsp:param name="site-title" value="Great Lakes Restoration Initiative (GLRI)" />
					</jsp:include>
				</div>
			</div>
			<div class="row glri_content" ng-controller="CatalogCtrl">
				<div class="col-xs-12">
					<div class="row">
						<div class="col-xs-12">
							<div class="well">

								<tabset>
								  <tab ng-repeat="tab in transient.tabs" heading="{{tab.title}}" active="tab.active" select="doTabSelect(tab.title)">

									
									
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
													<option ng-repeat="sortOption in SORT_OPTIONS" value="{{sortOption.key}}">{{sortOption.display}}</option>
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
											<a href="" class="item" ng-repeat="ps in pageRecordsPerPageOptions" ng-class="(pageSize==ps)?'current':'non-current'" ng-click="setPageSize(ps)">{{ps}}</a>
											<span>results per page</span>
										</span>
									</div>
								</div>
							</div>
						</div>
					</div>
									
									

									<div class="well well-sm clearfix" ng-if="isUIFresh">
										<h4>This is the initial page text</h4>


										<p class="gap-lg">
											<a href="http://www.usgs.gov/" target="_blank" class="pull-left">
												<img style="height: 49px; width: 134px;" src="${pageScope.rootPath}style/image/usgsblack.png" alt="USGS Logo - Science for a changing world"/>
											</a>
											<a href="http://cida.usgs.gov/glri/" target="_blank" class="pull-right">
												<img style="height: 49px; width: 158px;" src="${pageScope.rootPath}style/image/darkblue/glri_logo.svg" alt="GLRI Logo - Great Lakes Restoration Initiative"/>
											</a>
										</p>
									</div>

									<div class="record-load-progress" ng-if="isSearching">
										<span class="glyphicon glyphicon-repeat"></span>
									</div>

									<ul class="result-records">
										<li ng-repeat="record in pageRecords" class="{{record.resource}}">
											<div class="resource-icon">
												<a title="{{record.resource}}: Click to go directly to this record in ScienceBase" href="{{record.url}}" target="_blank">
													<img ng-src="${pageScope.rootPath}style/image/darkblue/{{record.resource}}.svg" />
												</a>
											</div>
											<h4>{{record.title}}</h4>
											<p class="point-of-contact">{{record.contactText}}</p>
											<div class="related-links" ng-if="record.mainLink || (record.hasChildren == true)">
												<div ng-if="record.mainLink">
													<a href="{{record.mainLink.url}}" target="_blank">{{record.mainLink.title}}</a>
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
											<p class="summary">{{record.summary}}</p>

											<div ng-if="record.childRecordState == 'loading'" class="progress progress-striped active">
												<div class="progress-bar"  role="progressbar" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100" style="width: 100%">
													<span>Loading...</span>
												</div>
											</div>

											<div ng-if="record.childItems &amp;&amp; record.childRecordState == 'complete'" class="child-records">
												<div class="list-head clearfix">
													<div class="pull-right"><a href="" ng-click="toggleChildItems(record)">Close child list <span class="glyphicon glyphicon-remove-circle"></span></a></div>
													<h4>{{record.childItems.length}} Child record(s) (projects and datasets)</h4>
												</div>
												<ul>
													<li ng-repeat="child in record.childItems" class="{{child.resource}}">
														<div class="resource-icon">
															<a title="{{child.resource}}: Click to go directly to this record in ScienceBase" href="{{child.url}}" target="_blank">
																<img ng-src="${pageScope.rootPath}style/image/darkblue/{{child.resource}}.svg" />
															</a>
														</div>
														<h4>{{child.title}}</h4>
														<p class="point-of-contact">{{child.contactText}}</p>
														<div class="related-links">
															<div ng-if="child.mainLink">
																<a href="{{child.mainLink.url}}" target="_blank">{{child.mainLink.title}}</a>
															</div>
														</div>
														<p class="summary">{{child.summary}}</p>
													</li>
												</ul>
												<div class="list-foot clearfix">
													<div class="pull-right"><a href="" ng-click="toggleChildItems(record)">Close child list <span class="glyphicon glyphicon-remove-circle"></span></a></div>
												</div>
											</div>
										</li>
									</ul>
							


									
									
									
									
									
									
									
									
									
									
									
									
									
									
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
									
									
									
									
									
									
									
									
									
									
									
									
									
								  </tab>
								</tabset>

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