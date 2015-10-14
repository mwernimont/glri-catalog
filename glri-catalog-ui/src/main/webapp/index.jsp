<!doctype html>
<html lang="en" ng-app="GLRICatalogApp">
	<head>
 	<title>USGS Great Lakes Restoration Initiative (GLRI)</title>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
		<meta name="viewport" content="width=device-width, initial-scale=1" /> <%-- Bootstrap mobile scaling directive --%>
        <meta http-equiv="X-UA-Compatible" content="IE=11">

		<link href="./favicon.ico" rel="shortcut icon" type="image/x-icon" />
		
		<jsp:include page="./template/USGSHead.jsp">
			<jsp:param name="relPath" value="./" />
			<jsp:param name="shortName" value="USGS Great Lakes Restoration Initiative (GLRI)" />
			<jsp:param name="title" value="Great Lakes Restoration Initiative (GLRI) Home" />
			<jsp:param name="description" value="The GLRI home page with infomation about all GLRI projects." />
			<jsp:param name="author" value="Great Lakes Restoration Initiative (GLRI), GLRI" />
			<jsp:param name="keywords" value="Great Lakes Restoration Initiative, GLRI, ScienceBase" />
			<jsp:param name="publisher" value="" />
			<jsp:param name="revisedDate" value="${timestamp}" />
			<jsp:param name="nextReview" value="" />
			<jsp:param name="expires" value="Never" />
		</jsp:include>


		<script type="text/javascript" src="./webjars/jquery/${jquery.version}/jquery.js"></script>
		<script type="text/javascript" src="./webjars/angularjs/${angular.version}/angular.js"></script>
		<script type="text/javascript" src="./webjars/angular-sanitize/${angular.sanitize.version}/angular-sanitize.js"></script>
		<script type="text/javascript" src="./webjars/angular-ui-bootstrap/${angular.bootstrap.version}/ui-bootstrap-tpls.js"></script>
		<script type="text/javascript" src="./webjars/angular-ui-select/${angular.select.version}/select.min.js"></script>
		<script type="text/javascript" src="./webjars/openlayers/2.13.1/OpenLayers.js"></script>

		<script type="text/javascript" src="./js/app/main.js"></script>
		<script type="text/javascript" src="./js/app/focusAreaManager.js"></script>
		<script type="text/javascript" src="./js/app/sciencebase.js"></script>
		<script type="text/javascript" src="./js/app/nav.js"></script>
		<script type="text/javascript" src="./js/app/controller.js"></script>
		<script type="text/javascript" src="./js/app/recordManager.js"></script>
		<script type="text/javascript" src="./js/app/pagination.js"></script>
		<script type="text/javascript" src="./js/app/search.js"></script>
		<script type="text/javascript" src="./js/app/directives.js"></script>
		
		<script type="text/javascript" src="./js/app/cida-analytics.js"></script>
		<script type="application/javascript" src="http://www.usgs.gov/scripts/analytics/usgs-analytics.js"></script>

		<!-- Twitter Bootstrap & theme-->
		<link rel="stylesheet" type="text/css" href="./webjars/bootstrap/${bootstrap.version}/css/bootstrap.css">
		<link rel="stylesheet" type="text/css" href="./style/themes/theme1.css">

		<!-- legacy css -->
		<link type="text/css" rel="stylesheet" href="./css/dynamic.css">
		<link type="text/css" rel="stylesheet" href="./css/style.css"></link>
		<link type="text/css" rel="stylesheet" href="./css/layout.css"></link>
		<link type="text/css" rel="stylesheet" href="./css/common.css"></link>
		<link type="text/css" rel="stylesheet" href="./css/dropdown2.css"></link>
		<link type="text/css" rel="stylesheet" href="./css/theme.css"></link>

		<!-- Application custom -->
		<link rel="stylesheet" type="text/css" href="./css/glri.css" />
		
	</head>
	<body  ng-controller="CatalogCtrl">
		<div id="container" class="container">
			<div class="row">
				<div class="col-xs-12">
					<jsp:include page="./templates/header.jsp">
						<jsp:param name="relPath" value="./" />
						<jsp:param name="header-class" value="" />
						<jsp:param name="site-title" value="Great Lakes Restoration Initiative (GLRI)" />
					</jsp:include>
					<img class="glyphicon glyphicon-menu visible-xs" src="images/xicon_mobile_nav_menu.svg" ng-click="toggleNav()">
				</div>
			</div>
			
			<div id="catalogCtrl" class="row glri_content">
				<div id="outerCol" class="col-xs-12"> <!-- col-sm-3 ? -->
					<div class="row">
						<div id="innerCol" class="col-xs-12">


<div id="navPane" class="col-left col-sm-3 hidden-xs">

<div id="nav" class="border" style="height:300px">

	<div id="navBrowse" class="btn-group navBrowse">
		<a ng-repeat="navName in nav.navNames" class="btn btn-primary btn-horizontal" 
			prevent-default href="javascript:void(0)" ng-click="nav.doNavRoot(navName)" 
			ng-class="nav.navShow(navName) ?'active' :'' " ng-bind="navName"></a>
	</div>
	<hr/>
	
	<glri-nav-home ng-if="nav.navShow('Home')">home</glri-nav-home>

	<div id="focusAreas" ng-if="nav.navShow('Browse')">
		<button id="{{focusArea}}" ng-repeat="focusArea in focusAreaOrder" 
				ng-bind="focusAreas[focusArea].name" class="btn btn-primary btn-vertical"
				ng-click="focusAreaClick(focusArea)"></button>
	</div>
	
	<glri-nav-search ng-if="nav.navShow('Search')"></glri-nav-search>
	
	<a href="https://www.sciencebase.gov/catalog/items?community=Great+Lakes+Restoration+Initiative"
		 target="_blank" title="ScienceBase, a repository of projects, data and metadata">
		<img class="powered-img" src="style/image/darkblue/sciencebase.png" alt="Science Base attribution icon">
	</a>
	

</div><!-- nav -->

</div><!-- navPane -->


<div id="contentPane" class="col-right col-sm-9 col-xs-12">

	<div class="border">

		<glri-home           ng-if="nav.contentShow('Home')"></glri-home>
		<glri-asian-carp     ng-if="nav.contentShow('AsianCarp')"></glri-asian-carp>
		<glri-invasive       ng-if="nav.contentShow('Invasive')"></glri-invasive>
		<glri-project-lists  ng-if="nav.contentShow('ProjectLists')"></glri-project-lists>
		<glri-publications   ng-if="nav.contentShow('Publications')"></glri-publications>
		<glri-focus-area     ng-if="nav.contentShow('Browse',0,false)"></glri-focus-area>

		<div ng-if="nav.contentShow('BeachHealth')" >
		<div>
			<img src="style/image/darkblue/glri_logo.svg" style="margin-left: 10px; margin-right: 10px; padding-bottom:10px;width:200px; height:80px;float:left">
			<div class="largetitle">GLRI Beach Health Webinar Feb11 2014</div>
		</div>
		<center>
			<iframe width="640" height="390" src="//www.youtube.com/embed/0Q6TdzX_jG0" frameborder="0" allowfullscreen></iframe>
		</center>
		</div>

		<glri-search ng-if="nav.contentShow('Search')"></glri-search>

	</div>
	
</div><!-- contentPane -->
						
					</div><!-- innerCol -->

					

				</div>				
			</div> <!-- outerCol -->
			
			<div id="footerContainer" class="row">
				<div class="col-xs-12">
					<jsp:include page="./templates/footer.jsp">
						<jsp:param name="relPath" value="./" />
						<jsp:param name="header-class" value="" />
						<jsp:param name="site-url" value="" />
						<jsp:param name="contact-info" value="<a href=\"mailto:glri-database@usgs.gov\">GLRI Help</a>" />
						<jsp:param name="revisedDate" value="${timestamp}" />
						<jsp:param name="buildVersion" value="${project.version}" />
					</jsp:include>
				</div>
			</div> <!-- footerContainer -->
			
		</div><!-- catalogCtrl -->
	  </div><!-- container -->
	</body>
</html>