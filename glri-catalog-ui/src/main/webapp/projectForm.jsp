<html ng-app="GLRICatalogApp">
<head>

	<style type="text/css">
		@charset "UTF-8";
		[ng\:cloak],[ng-cloak],[data-ng-cloak],[x-ng-cloak],.ng-cloak,.x-ng-cloak,.ng-hide{display:none !important;}
		ng\:form{display:block;}
		.ng-animate-block-transitions{transition:0s all!important;-webkit-transition:0s all!important;}
	</style>
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
	
	<script type="text/javascript" src="./webjars/jquery/${jquery.version}/jquery.js"></script>
	<script type="text/javascript" src="./webjars/jquery-cookie/${jquery.cookie.version}/jquery.cookie.js"></script>
	
	<script type="text/javascript" src="./webjars/angularjs/${angular.version}/angular.js"></script>
	<script type="text/javascript" src="./webjars/angular-sanitize/${angular.sanitize.version}/angular-sanitize.js"></script>
	<script type="text/javascript" src="./webjars/angular-ui-bootstrap/${angular.bootstrap.version}/ui-bootstrap-tpls.js"></script>
	<script type="text/javascript" src="./webjars/angular-ui-select/${angular.select.version}/select.min.js"></script>

	<!-- Twitter, Bootstrap, & themes -->
	<link rel="stylesheet" type="text/css" href="./webjars/bootstrap/${bootstrap.version}/css/bootstrap.css">
	<link rel="stylesheet" type="text/css" href="./style/themes/theme1.css">
	<link rel="stylesheet" type="text/css" href="./webjars/angular-ui-select/${angular.select.version}/select.min.css" >

	<!-- legacy css -->
	<link type="text/css" rel="stylesheet" href="./css/dynamic.css">
	<link type="text/css" rel="stylesheet" href="./css/style.css">
	<link type="text/css" rel="stylesheet" href="./css/layout.css">
	<link type="text/css" rel="stylesheet" href="./css/common.css">
	<link type="text/css" rel="stylesheet" href="./css/dropdown2.css">
	<link type="text/css" rel="stylesheet" href="./css/theme.css">

	<!-- Application custom -->
	<link rel="stylesheet" type="text/css" href="./css/glri.css">
	
	<link href="./webjars/openlayers/2.13.1/theme/default/style.css" type="text/css" rel="stylesheet">
	
	<script type="text/javascript" src="js/select2buttons.js"></script>
	<link rel="stylesheet" type="text/css" href="css/select2Buttons.css">

	<link rel="stylesheet" type="text/css" href="css/newProjectForm.css">
	
</head>
<body ng-controller="NewProjectCtrl">

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

<a id="gotoNewProject" class="hidden" href="Browse/all/{{transient.newProjectId}}"></a>

<div id="contentBrowseDetail" class="clearfix glri_content" style="max-width:800px;margin-left:50px;float:left;">

<div ng-hide="login.token !== undefined" class="loginBlock">
  <form id="login" name="loginForm" ng-submit="authenticate()" class="login">
	<h4 class="">Please log in before creating a new project entry.</h4>
	<div class="form-spacing error" ng-bind-html="login.message"></div>
	<h4 class="">USGS Email Address</h4>
	<div class="form-spacing">
		<input type="text" class="form-control form-field" ng-model="login.username" required
		placeholder="email@usgs.gov">
	</div>
	<h4 class="">AD Password</h4>
	<div class="form-spacing">
		<input type="password" class="form-control form-field" ng-model="login.password" required>
	</div>
	<p class="form-spacing">
		<a id="home" href="." style="display:nonew;" class="btn btn-primary pull-left">Cancel</a>
		&nbsp;
		<button id="login" type="submit" class="btn btn-primary pull-right">Login</button>
	</p>	
	
  </form>
</div>

  <form id="newProjectForm" name="newProjectForm" ng-submit="save()" >		

<div class="form-msg form-msg-required">Please complete this required field.</div>
<div class="form-msg form-msg-validate">{{validation.singleMsg}}</div>
<div class="form-msg form-msg-agree">You must agree to the Data Management Plan in order to submit a new GLRI Project.</div>

<div>
	<h2 class="detailTitle">Project Information Form</h2>
	<div class="form-spacing" style="margin-left: 10px;">
		Information entered in this form will be displayed in the <a href="http://cida.usgs.gov/glri/" target="_blank">USGS GLRI Website</a>.
	</div>
</div>
	
<span class="form-spacing form-optional" style="margin-bottom: 15px;display: block;">Note: Fields with this background are the only optional entries.</span>

<div>
	<h4 class="">Data Management Plan</h4>
	<div class="form-spacing" style="margin-left: 10px;">
		I will create a data management plan within the first year of the project, and will ensure that metadata for all data 
		sets is created in a timely manner. (Note: this is required for all GLRI funded projects. More information about USGS data management plans can be found
		 <a href="http://www.usgs.gov/datamanagement/plan/dmplans.php" target="_blank">here</a>).
		<select class="select2 form-control form-required" id="dmPlan" ng-model="newProject.dmPlan" >
			<option value="agree">I Agree</option>
			<option value="disagree">I Disagree</option>
		</select>
	</div>
</div>

<div>
	<h4 class="">Project Title</h4>
	<div class="form-spacing">
		Enter the project title as it should appear on the GLRI website.
		<textarea class="form-control form-title form-required" ng-model="newProject.title"></textarea>
	</div>
</div>

<div>
	<h4 class="">Image URL</h4>
	<div class="form-spacing">
		Enter URL to image to be used in the the project page on the GLRI website. Alternatively, you may email an image to Jessica Lucido (<a href="mailto:jlucido@usgs.gov?Subject=GLRI%20Project%20Image">jlucido@usgs.gov</a>).
		<input class="form-control form-field form-optional" type="text" ng-model="newProject.image">
	</div>
</div>

<div>
	<div class="input-daterange">
		<div class="datepickerStart" style="width:50% !important;float:left;">
			<h4 class="">Agreement Start Date</h4>
			Required: Calendar Year (yyyy) or Full Date (yyyy-mm-dd)
			<div class="form-spacing startDate">
				<input type="text" class="form-control form-control form-field form-date form-required"  style="width:150px !important;"
					 uib-datepicker-popup model="newProject.startDate" ng-model="newProject.startDateNg" is-open="status.showStart" 
					  datepicker-options="dateOptions" date-disabled="disabled(date, mode)" ng-required="false" close-text="Close" 
					  datepicker-mode="status.mode"
					  />
				<div class="input-group-addon calendar-button" ng-click="showCalendar('start')">
			        <span class="glyphicon glyphicon-calendar"></span>
			    </div>
			</div>
		</div>
		<div class="datepickerFinish" style="width:50% !important;float:right;">
			<h4 class="">Agreement End Date</h4>
			Optional: Calendar Year (yyyy) or Full Date (yyyy-mm-dd)
			<div class="form-spacing endDate">
				<input type="text" class="form-control form-control form-field form-date form-optional"  style="width:150px !important;"
					   uib-datepicker-popup model="newProject.endDate" ng-model="newProject.startDateNg" is-open="status.showFinish"
					   datepicker-options="dateOptions" date-disabled="disabled(date, mode)" ng-required="false" close-text="Close" 
				       datepicker-mode="status.mode"
				       />
				<div class="input-group-addon calendar-button" ng-click="showCalendar('finish')">
			        <span class="glyphicon glyphicon-calendar"></span>
			    </div>
			</div>
		</div>
		<div style="clear:both;"></div>
	</div>
</div>

<div>
	<h4 class="">Project Duration</h4>
	<div class="form-spacing" style="margin-left: 10px;">
		Choose One.
		<select class="select2 form-control form-required" id="duration" ng-model="newProject.duration">
			<option>Single effort (1 year or less)</option>
			<option>Short term (2 to 5 years)</option>
			<option>Long term (greater than 5 years)</option>
		</select>
	</div>
</div>

<div>
	<h4>Primary Focus Area</h4>
	<div class="form-spacing" style="margin-left: 10px;">
		Choose One.
		<select class="select2 form-control form-required" id="focus_area" ng-model="newProject.focusArea">
		</select>
	</div>
</div>

<div>
	<h4 class="">Project Status</h4>
	<div class="form-spacing" style="margin-left: 10px;">
		Choose One.
		<select class="select2 form-control form-required" id="project_status" ng-model="newProject.status">
			<option value="Completed">Completed</option>
			<option value="In Progress">In Progress</option>
		</select>
	</div>
</div>

<div>
	<h4 class="">Entry Type</h4>
	<div class="form-spacing" style="margin-left: 10px;">
		Choose One.
		<select class="select2 form-control form-required" id="entry_type" ng-model="newProject.entryType">
			<option>New Project</option>
			<option>Project Update</option>
		</select>
	</div>
</div>

<div>
	<h4 class="">Spatial Location</h4>
	<div class="form-spacing" style="margin-left: 10px;">
		Indicates if the project has geospatial footprint(s). Select "No" for projects that do not relate to a geographic area (e.g. overhead, lab analysis, software development or science support).
		<select class="select2 form-control form-required" id="spatial" ng-model="newProject.spatial">
			<option value="Has Spatial">Has Spatial</option>
			<option value="No Spatial">No Spatial</option>
		</select>
	</div>
</div>

<div>
	<h4>Background/Problem</h4> 
	<div class="background form-spacing">
		Brief statement of the problem that the project/task will address.
		<textarea class="form-control form-field form-required" rows="10"  ng-model="newProject.purpose"></textarea>
	</div>
</div>

<div>
	<h4>Objectives</h4> 
	<div class="background form-spacing">
		Summary of the overall plans, objectives, and approach of the Project or Task. Describe the issues to be addressed, and if applicable, the scientific questions and policy issues addressed.
		<textarea class="form-control form-field form-required" rows="10"  ng-model="newProject.objectives"></textarea>
	</div>
</div>

<div>
	<h4>Description of Work</h4> 
	<div class="form-spacing">
		Short paragraph to briefly describe the work to be done this FY.
		<textarea class="form-control form-field form-required" rows="10"  ng-model="newProject.work"></textarea>
	</div>
</div>

<div>
	<h4>Relevance and Impact</h4> 
	<div class="form-spacing">
		A 'narrative' description of the expected outcomes, pertinence to policy and scientific issues, and Program relevance of the project. Required, except for projects of type 'Support'.
		<textarea class="form-control form-field form-optional" rows="10"  ng-model="newProject.impact"></textarea>
	</div>
</div>

<div>
	<h4>Planned Product</h4> 
	<div class="form-spacing">
		Describe anticipated products from this project (e.g. publication or data set), providing a title and outlet for each product.
		<textarea class="form-control form-field form-required" rows="10"  ng-model="newProject.product"></textarea>
	</div>
</div>

<div>
	<h4>Template(s)</h4>	 
	<div class="form-spacing">
		<ui-select multiple ng-model="newProject.templates"  style="width:100%" class="form-required">
		    <ui-select-match placeholder="Check all that apply.">{{$item.display}}</ui-select-match>
		    <ui-select-choices repeat="template in transient.templates | orderBy:'sort'">
		      {{template.display}}
		    </ui-select-choices>
		</ui-select>
	</div>
</div>

<div>
	<h4>SiGL Keyword(s)</h4>	 
	<div class="form-spacing">
		<ui-select multiple ng-model="newProject.SiGL"  style="width:100%" class="form-required">
		    <ui-select-match placeholder="Check all that apply.">{{$item.display}}</ui-select-match>
		    <ui-select-choices repeat="SiGL in transient.SiGL_keywords | orderBy:'sort'">
		      {{SiGL.display}}
		    </ui-select-choices>
		</ui-select>
	</div>
</div>

<div>
	<h4>Water Feature(s)</h4>	 
	<div class="form-spacing">
		<ui-select multiple ng-model="newProject.water"  style="width:100%" class="form-required">
		    <ui-select-match placeholder="Check all that apply.">{{$item.display}}</ui-select-match>
		    <ui-select-choices repeat="water in transient.water_features | orderBy:'sort'">
		      {{water.display}}
		    </ui-select-choices>
		</ui-select>
	</div>
</div>

<div>
	<h4>GLRI Keyword(s)</h4>	 
	<div class="form-spacing">
		<textarea class="form-control form-field form-required" rows="5" ng-model="newProject.keywords" 
		placeholder="Enter a comma separated list of keywords or phrases. Example: &#10;forecasting, wetlands ecology, coastal" ></textarea>
	</div>
</div>

<div>
	<h4 class="">Principal Investigator</h4>
	<div class="form-spacing">
		Lead PI for the project
		<input type="text" class="form-control form-field form-required contact single-person" ng-model="newProject.principal"
		placeholder="Enter the name and email address for a single person. Both are required. Example: Jane Doe jdoe@usgs.gov">
	</div>
</div>

<div>
	<h4 class="">Associate Project Chief</h4>
	<div class="form-spacing">
		Center Director, Office Chief, Regional Staff Member, etc.
		<input type="text" class="form-control form-field form-required contact single-person" ng-model="newProject.chief"
		placeholder="Enter the name and email address for a single person. Both are required. Example: Jane Doe jdoe@usgs.gov">
	</div>
</div>

<div>
	<h4>Cooperating Organization</h4>  
	<div class="point-of-contact form-spacing">
		This is used to identify significant relationships between the project and organizations outside of USGS that participate in or use information from the project. External Organizations may include Federal entities, State, County, and Municipal governmental organizations, tribal entities, academic organizations, private organizations, international entities, and non&#45;governmental organizations.
		<textarea class="form-control form-field form-optional contact multi-organization" rows="5"  ng-model="newProject.organizations"
		placeholder="Enter a comma separated list of organizations.  Each organization must have a name and optionally an email address. Example: &#10;Cooperating Org, Environmental Org info@environment.org" ></textarea>
	</div>
</div>

<div>
	<h4>Points of Contact</h4>  
	<div class="point-of-contact form-spacing">
		<textarea class="form-control form-field form-optional contact multi-person" rows="5"  ng-model="newProject.contacts"
		placeholder="Enter a comma separated list of 'people' contacts for the project.  Each contact must have a name and email. Example: &#10;Jane Doe jdoe@usgs.gov, James Brown jbrown@usgs.gov" ></textarea>
	</div>
</div>

<div>
	<p class="form-spacing">
		<button id="discard" class="btn btn-primary pull-left" ng-click="discard()">Discard</button>
		<button id="save" type="submit" class="btn btn-primary pull-right" >Save</button>	
	</p>	
</div>
	
  </form>
</div>

</div>

<div id="contentBrowseDetail" class="clearfix glri_content imageContent">
	<h4>Project Image</h4>
	<img id="imageTarget" href=""></img>
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


</body>
<script type="text/javascript" src="./js/app/main.js"></script>
<script type="text/javascript" src="./js/app/focusAreaManager.js"></script>
<script type="text/javascript" src="./js/app/sciencebase.js"></script>
<script type="text/javascript" src="./js/app/newProjectForm.js"></script>

</html>
