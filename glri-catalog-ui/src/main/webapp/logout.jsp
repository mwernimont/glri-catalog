<%@page import="javax.servlet.http.HttpSession"%>
<html ng-app="GLRICatalogApp">
<head>

 	<title>USGS Great Lakes Restoration Initiative (GLRI)</title>
		
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1"> 
    <meta http-equiv="X-UA-Compatible" content="IE=11">

	<link href="./favicon.ico" rel="shortcut icon" type="image/x-icon">
		
	<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
	<title>USGS Great Lakes Restoration Initiative (GLRI)</title>
	<meta name="description" content="The GLRI home page with infomation about all GLRI projects.">
	<meta name="title"     content="Great Lakes Restoration Initiative (GLRI) Home">
	<meta name="author"    content="Great Lakes Restoration Initiative (GLRI), GLRI">
	<meta name="keywords"  content="Great Lakes Restoration Initiative, GLRI, ScienceBase">
	<meta name="publisher" content="">
	<meta name="country"   content="USA">
	<meta name="language"  content="EN">
	<meta name="revised"   content="2015-08-27 10:44">
	<meta name="review"    content="">
	<meta name="expires"   content="Never">
	
	<link type="text/css" rel="stylesheet" href="./template/css/usgs_common.css">
	<link type="text/css" rel="stylesheet" href="./template/css/usgs_style_main.css">
	<link type="text/css" rel="stylesheet" href="./css/custom.css">
	
	<!-- Twitter, Bootstrap, & themes -->
	<link rel="stylesheet" type="text/css" href="./webjars/bootstrap/${bootstrap.version}/css/bootstrap.css">
	<link rel="stylesheet" type="text/css" href="./style/themes/theme1.css">
	<link rel="stylesheet" type="text/css" href="./webjars/angular-ui-select/${angular.select.version}/select.min.css" >

	<!-- legacy css -->
	<link type="text/css" rel="stylesheet" href="./css/dynamic.css">
	<link type="text/css" rel="stylesheet" href="./css/style.css">
	<link type="text/css" rel="stylesheet" href="./css/layout.css">
	<link type="text/css" rel="stylesheet" href="./css/common.css">
	<link type="text/css" rel="stylesheet" href="./css/theme.css">

	<!-- Application custom -->
	<link rel="stylesheet" type="text/css" href="./css/glri.css">
	
	<link href="./webjars/openlayers/2.13.1/theme/default/style.css" type="text/css" rel="stylesheet">
	
	
</head>
<body>
	
<%
	try {
		if (session != null) {
			session.invalidate();
			request.logout();
		}
	} catch (Throwable t) {
		//If the session is null, the user was not logged in, so OK to ignore.
		String msg = t.getMessage();
	}
%>

<div class="container">
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

	<div class="row">
		<div class="col-xs-12">
			<div class="well">
				<div class="alert alert-info">
				<h1>You have been logged out</h1>
				<a class="alert-link" href="index.jsp">Return to the home page &gt;&gt;</a>
				</div>
			</div>
		</div>
	</div>

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

</div>
</body>

</html>
