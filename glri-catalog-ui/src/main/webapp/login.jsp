<%@page import="javax.servlet.http.HttpSession"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<html>
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
	
	<style>
.login {
    width: 50%;
	min-width: 30em;
	margin: 5em auto 5em auto;
    background-color: white;
    border: 3px solid #036;
    border-radius: 20px;
    padding: 20px;
    position: relative;
}

body .login-wrap * {
    font-weight: bold;
    color: #039;
}

body .login-wrap h1 { font-size: 1.8em; margin: .4em auto; }
body .login-wrap h2 { font-size: 1.6em; margin-bottom: .4em; margin-top: .2em; }
body .login-wrap h4 { font-size: 1.4em; margin-bottom: .4em; margin-top: .2em; }

.form-spacing {
	margin-bottom: 20px;
}

.form-spacing .btn-primary {
    width: auto;
    padding: 4px;
    min-width:80px;
}
.form-spacing .btn-primary:hover {
	background: #036;
	border-color: #036;
	color: #FFF;    
	text-decoration: none;
	box-shadow: 0px 1px 1px rgba(0, 0, 0, 0.075) inset, 0px 0px 8px rgba(0, 75, 150, 0.6) !important;
}
.login .btn-primary {
	background-color: white;
	border-color: #036;
	color: #036;
	margin-bottom: 1px !important;
	display: block;
	font-weight:bold;
	padding:2px 0;
}
.login-wrap .btn-primary:active,
.login-wrap .btn-primary.active {
  background-color: #036;
  color: white;
  border-color: #38E;
}
	</style>
	
	
</head>
<body>

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
			<div class="login-wrap">
				<h1>You must authenticate to proceed</h1>
				<c:if test='${not empty param["retry"]}'>
					<div class="alert alert-warning">
						<h1>Login failed - Please try again</h1>
					</div>
				</c:if>
				<form id="login" name="loginForm" action="j_security_check" method="post" class="login">
					<h4>Please log in before creating a new project entry.</h4>
					<div class="form-spacing error" ng-bind-html="login.message"></div>
					<h4 class="">USGS Email Address</h4>
					<div class="form-spacing">
						<input type="text" class="form-control form-field" name="j_username" placeholder="email@usgs.gov"/>
						<h4>AD Password</h4>
						<div class="form-spacing">
							<input type="password" class="form-control form-field" name="j_password"/>
						</div>
						<p class="form-spacing">
							<a id="home" href="." class="btn btn-primary pull-left">Cancel</a>
							&nbsp;
							<button id="login" type="submit" class="btn btn-primary pull-right">Login</button>
						</p>
					</div>
				</form>
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
