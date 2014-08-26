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

		<script type="text/javascript" src="js/app/main.js"></script>
		<script type="text/javascript" src="${pageScope.rootPath}js/app/cida-analytics.js"></script>
		<script type="application/javascript" src="http://www.usgs.gov/scripts/analytics/usgs-analytics.js"></script>

		<!-- Twitter Bootstrap & theme-->
		<link rel="stylesheet" type="text/css" href="${pageScope.rootPath}webjars/bootstrap/3.1.1/css/bootstrap.css"/>
		<link rel="stylesheet" type="text/css" href="${pageScope.rootPath}style/themes/theme1.css"/>

		<!-- Application custom -->
		<link rel="stylesheet" type="text/css" href="css/custom.css" />
	</head>
	<body>
		<div class="container">
			<div class="row">
				<div class="col-xs-12">
					<jsp:include page="${pageScope.rootPath}/browse/template/header.jsp">
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
								<div>

								<img src="../style/image/blue/glri_logo.svg" style="margin-left: 10px; margin-right: 10px; padding-bottom:10px;width:200px; height:80px;float:left">
								
								
								<div style="margin-top: 15px;">
									<div class="btn-group" ng-repeat="tab in transient.tabs" dropdown is-open="tab.title == transient.currentTab.title">
									  <button type="button" class="btn btn-primary dropdown-toggle" ng-click="transient.currentItem=null">
										{{tab.title}}
									  </button>
									  <ul class="dropdown-menu" role="menu">
										<li ng-repeat="item in tab.items">
											<a target="_blank" ng-if="$index == 0" href="{{item.url}}">{{item.title}}</a>
											<a target="_blank" ng-if="$index != 0" ng-click="loadProjectDetail(item.item)">{{item.title}} </a>
										</li>
									  </ul>
									</div>
								</div>
							</div>
							
							<div class="well" ng-if="! transient.currentItem">
								<hr />
								<p>The U.S. Geological Survey (USGS) GLRI effort is being coordinated and managed by the 
									USGS Midwest Region in accordance with the USGS science strategy - 
									one that is driven by cross-disciplinary integrative science and conducted in 
									collaboration with partners to provide resource managers with the information and 
									decision-making tools they need to help restore the Great Lakes.
								</p>
								<div class="carousel">
									<img src="http://cida.usgs.gov/glri/images/glri/GLRI_pic_asian_carp_page.jpg" />
								</div>
									
							</div>
							
							
							<div class="well clearfix" ng-if="transient.currentItem">

									<img class="browse-image" ng-if="transient.currentItem.browseImage" src="{{transient.currentItem.browseImage}}" />
									
									<h2>{{transient.currentItem.title}}</h2>
									<div class="template-list">
										<h5>Template(s):
											<span class="no-template-found" ng-if="transient.currentItem.templates.length == 0">No funding template found</span>
											<span class="template-name" ng-repeat="template in transient.currentItem.templates">
												{{template}}<span class="template-separator" ng-if="transient.currentItem.templates.length &gt; 1 &amp;&amp; !$last">, </span>
											</span>
											
										</h5>
									</div>
									
									<h4>Background/Problem</h4>
									<p class="background">{{transient.currentItem.purpose}}</p>
									
									<h4>Description of Work</h4>
									<p class="description-of-work">{{transient.currentItem.body}}</p>
									
									<h4>Contacts</h4>
									<p class="point-of-contact">{{transient.currentItem.contactText}}</p>
									
									<div ng-if="false">
										<div class="related-links" ng-if="transient.currentItem.mainLink || (transient.currentItem.hasChildren == true)">
											<div ng-if="transient.currentItem.mainLink">
												<a href="{{transient.currentItem.mainLink.url}}" target="_blank">{{transient.currentItem.mainLink.title}}</a>
											</div>
											<div ng-if="transient.currentItem.hasChildren == true">
												<a href="" ng-click="toggleChildItems(record)">Publications and Datasets
													<span ng-if="transient.currentItem.childRecordState == 'notloaded'"><span class="glyphicon glyphicon-chevron-down"></span></span>
													<span ng-if="transient.currentItem.childRecordState == 'loading'"><span class="glyphicon glyphicon-repeat"></span></span>
													<span ng-if="transient.currentItem.childRecordState == 'complete'"><span class="glyphicon glyphicon-remove-circle"></span></span>
													<span ng-if="transient.currentItem.childRecordState == 'failed'"><span class="glyphicon glyphicon-warning-sign"></span></span>
													<span ng-if="transient.currentItem.childRecordState == 'closed'"><span class="glyphicon glyphicon-eye-open"></span></span>
												</a>
											</div>
										</div>


										<div ng-if="transient.currentItem.childRecordState == 'loading'" class="progress progress-striped active">
											<div class="progress-bar"  role="progressbar" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100" style="width: 100%">
												<span>Loading...</span>
											</div>
										</div>

										<div ng-if="transient.currentItem.childItems &amp;&amp; transient.currentItem.childRecordState == 'complete'" class="child-records">
											<div class="list-head clearfix">
												<div class="pull-right"><a href="" ng-click="toggleChildItems(record)">Close child list <span class="glyphicon glyphicon-remove-circle"></span></a></div>
												<h4>{{transient.currentItem.childItems.length}} Child record(s) (projects and datasets)</h4>
											</div>
											<ul>
												<li ng-repeat="child in transient.currentItem.childItems" class="{{child.resource}}">
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




									</div>
								
								
							</div>
						</div>
					</div>

					

				</div>				
			</div>
			<div class="row">
				<div class="col-xs-12">
					<jsp:include page="${pageScope.rootPath}/browse/template/footer.jsp">
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