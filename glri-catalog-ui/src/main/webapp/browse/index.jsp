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
		<script type="text/javascript" src="${pageScope.rootPath}webjars/angular-sanitize/1.2.16/angular-sanitize.js"></script>
		<script type="text/javascript" src="${pageScope.rootPath}webjars/angular-ui-bootstrap/0.10.0/ui-bootstrap-tpls.js"></script>

		<script type="text/javascript" src="js/app/main.js"></script>
		<script type="text/javascript" src="js/app/directives.js"></script>
		<script type="application/javascript" src="http://www.usgs.gov/scripts/analytics/usgs-analytics.js"></script>

		<!-- Twitter Bootstrap & theme-->
		<link rel="stylesheet" type="text/css" href="${pageScope.rootPath}webjars/bootstrap/3.1.1/css/bootstrap.css"/>
		<link rel="stylesheet" type="text/css" href="${pageScope.rootPath}style/themes/theme1.css"/>

		<!-- legacy css -->
		<link type="text/css" rel="stylesheet" href="${pageScope.rootPath}css/dynamic.css">
		<link type="text/css" rel="stylesheet" href="${pageScope.rootPath}css/style.css"></link>
		<link type="text/css" rel="stylesheet" href="${pageScope.rootPath}css/layout.css"></link>
		<link type="text/css" rel="stylesheet" href="${pageScope.rootPath}css/common.css"></link>
		<link type="text/css" rel="stylesheet" href="${pageScope.rootPath}css/dropdown2.css"></link>
		<link type="text/css" rel="stylesheet" href="${pageScope.rootPath}css/theme.css"></link>

		<!-- Application custom -->
		<link rel="stylesheet" type="text/css" href="${pageScope.rootPath}css/glri.css" />

		
<script>
  (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
  })(window,document,'script','//www.google-analytics.com/analytics.js','ga');

  ga('create', 'UA-50454186-2', 'auto');
  ga('send', 'pageview');

</script>
		
	</head>
	<body  ng-controller="CatalogCtrl">
		<div class="container">
			<div class="row">
				<div class="col-xs-12">
					<jsp:include page="${pageScope.rootPath}/template/header.jsp">
						<jsp:param name="relPath" value="../" />
						<jsp:param name="header-class" value="" />
						<jsp:param name="site-title" value="Great Lakes Restoration Initiative (GLRI)" />
					</jsp:include>
					<img class="glyphicon glyphicon-menu visible-xs" src="../images/xicon_mobile_nav_menu.svg" ng-click="toggleNav()">
				</div>
			</div>
			
			<div id="catalogCtrl" class="row glri_content">
				<div id="outerCol" class="col-xs-12">
					<div class="row">
						<div id="innerCol" class="col-xs-12">


<div id="navPane" class="col-left col-sm-3 hidden-xs">

<div id="nav" class="border" style="height:300px">

	<div id="navBrowse" class="btn-group navBrowse">
		<a ng-repeat="nav in transient.nav" class="btn btn-primary btn-horizontal" 
			preventDefault href="javascript:void(0)" ng-click="doNavRoot(nav.title)" 
			ng-class="navShow(nav.title) ?'active' :'' " ng-bind="nav.title"></a>
	</div>
	<hr/>
	
	<glri-nav-home ng-if="navShow('Home')">home</glri-nav-home>

	<div id="focusAreas" ng-if="navShow('Browse')">
		<button id="{{focusArea}}" ng-repeat="focusArea in transient.focusAreaOrder" 
				ng-bind="transient.focusAreas[focusArea].name" class="btn btn-primary btn-vertical"
				ng-click="focusAreaClick(focusArea)"></button>
	</div>
	
	<a href="https://www.sciencebase.gov/catalog/items?community=Great+Lakes+Restoration+Initiative"
		 target="_blank" title="ScienceBase, a repository of projects, data and metadata">
		<img class="powered-img" src="style/image/darkblue/sciencebase.png" alt="Science Base attribution icon">
	</a>

</div><!-- nav -->

</div><!-- navPane -->


<div id="contentPane" class="col-right col-sm-9 col-xs-12">

	<div class="border">

		<glri-home ></glri-home>
		<glri-asian-carp     ng-if="contentShow('AsianCarp')"></glri-asian-carp>
		<glri-invasive       ng-if="contentShow('Invasive')"></glri-invasive>
		<glri-project-lists  ng-if="contentShow('ProjectLists')"></glri-project-lists>
		<glri-publications   ng-if="contentShow('Publications')"></glri-publications>
		<glri-focus-area     ng-if="contentShow('Browse',0,false)" 
							 focus-area="transient.currentFocusArea"
							 projects="transient.currentProjectList"
							 base-query-url="CONST.BASE_QUERY_URL"></glri-focus-area>

		<div ng-if="contentShow('BeachHealth')" >
		<div>
			<img src="../style/image/darkblue/glri_logo.svg" style="margin-left: 10px; margin-right: 10px; padding-bottom:10px;width:200px; height:80px;float:left">
			<div class="largetitle">GLRI Beach Health Webinar Feb11 2014</div>
		</div>
		<center>
			<iframe width="640" height="390" src="//www.youtube.com/embed/0Q6TdzX_jG0" frameborder="0" allowfullscreen></iframe>
		</center>
		</div>

	</div>
	
</div><!-- contentPane -->
						
					</div><!-- innerCol -->

					

				</div>				
			</div> <!-- outerCol -->
			
			<div id="footerContainer" class="row">
				<div class="col-xs-12">
					<jsp:include page="${pageScope.rootPath}/template/footer.jsp">
						<jsp:param name="relPath" value="${pageScope.rootPath}" />
						<jsp:param name="header-class" value="" />
						<jsp:param name="site-url" value="" />
						<jsp:param name="contact-info" value="<a href=\"mailto:glri_help@usgs.gov\">glri_help@usgs.gov</a>" />
						<jsp:param name="revisedDate" value="${timestamp}" />
						<jsp:param name="buildVersion" value="${project.version}" />
					</jsp:include>
				</div>
			</div> <!-- footerContainer -->
			
		</div><!-- catalogCtrl -->
		
	</body>
</html>