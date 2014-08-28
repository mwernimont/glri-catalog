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

		<!-- legacy css -->
		<link type="text/css" rel="stylesheet" href="css/dynamic.css">
		<link type="text/css" rel="stylesheet" href="css/style.css"></link>
		<link type="text/css" rel="stylesheet" href="css/layout.css"></link>
		<link type="text/css" rel="stylesheet" href="css/common.css"></link>
		<link type="text/css" rel="stylesheet" href="css/custom2.css"></link>
		<link type="text/css" rel="stylesheet" href="css/dropdown2.css"></link>
		<link type="text/css" rel="stylesheet" href="css/theme.css"></link>
		
		
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
									  <button type="button" class="btn btn-primary" onclick="window.location='/glri-catalog'">
										Search
									  </button>
								</div>
							</div>
							
<div class="border col-xs-9">
								<div class="btall">
									<div class="ltall">
										<div class="rtall">
											<div class="tleft">
												<div class="tright">
													<div class="bleft">
														<div class="bright">
															<div class="ind">



				<!--[if IE 6]>

<div style="height:auto;width:780px;padding:10px;">
<table>
<tr>
<td>				
<img src="http://cida.usgs.gov/glri/images/official_logo_glri.png" alt="GLRI Logo" align="left" style="margin-left: 10px; margin-right: 10px; padding-bottom:10px;background-color:#ffffff;" />
</td>
<div style="margin-top:2px;">
</tr>
</table>
				<![endif]-->

				<!--[if !IE]-->
<div style="height:auto;width:780px;padding:10px;">
<div style="padding-top:10px;margin-top:2px;">
</div>
				<!--[endif]-->


<div style="border-top:solid #EFEFEF 1px; padding-top:15px;">

<div style="padding-left:20px;padding-right:20px;">The U.S. Geological Survey (USGS) GLRI effort is being coordinated and managed by the USGS Midwest Region in accordance with the USGS science strategy - one that is driven by cross-disciplinary integrative science and conducted in collaboration with partners to provide resource managers with the information and decision-making tools they need to help restore the Great Lakes.</div>

    
<div id="headlineWrapper" style="margin-left:70px;">	
	
    <div id="headline">
    
    
      <div style="display: none;" id="story25" class="story">   
	  
	  <h1><span>Lakewide Management Plan Capacity Support by USGS</span></h1>  
	     
        	<a href="projects/accountability/management_plan.html"></a>
		
		<div class="overlay" style="opacity: 0.50; -moz-opacity: 0.50; filter:alpha(opacity=50);">&nbsp;</div>	
					 
          	<p>The USGS is providing expertise, capacity and support for the implementation of Lakewide Management Plans and the associated goals, objectives and targets for each of the Great Lakes.  This work will include participation in LaMP and lakewide processes, programs and projects, including the development of LaMP documents.<br><span style="margin-left:20px;font-size:7pt;color:#FFFFFF;font-weight:bold;background:#60B4DB;padding-left:5px;padding-right:5px;">CONTACT:</span><a href="mailto:stark@usgs.gov" style="font-size:7pt;color:#60B4DB;"> James Stark</a></p>
		
	</div>

    
      <div style="display: none;" id="story24" class="story">   
	  
	  <h1><span>Compilation of USGS Data for the Great Lakes Basin</span></h1>  
	     
        	<a href="projects/accountability/USGS_data_compilation.html"></a>
		
		<div class="overlay" style="opacity: 0.50; -moz-opacity: 0.50; filter:alpha(opacity=50);">&nbsp;</div>	
					 
          	<p style="font-size:8pt;">USGS is providing easily accessible, centrally located, USGS biological, water resources, geological, and geospatial datasets for Great Lakes basin restoration activities and coordination with GLOS.  Managers, partners and the public will be able to readily access this information in usable interactive formats to help plan and implement restoration activities.  This project is developing decision support tools such as environmental simulation models that can provide users with the building blocks for future modeling efforts to address, for example, potential environmental impacts of climate change and stream water quality.
          	<br><span style="margin-left:20px; font-size:7pt; color:#FFFFFF; font-weight:bold; background:#60B4DB; padding-left:5px; padding-right:5px;">CONTACT:</span><a href="mailto:nlbooth@usgs.gov" style="font-size:7pt;color:#60B4DB;"> Nate Booth</a></p>
		
	</div>



      <div style="display: none;" id="story23" class="story">   
	  
	  <h1><span>Geospatial Information for Decision Support in AOCs and Ecosystems</span></h1>  
	     
        	<a href="projects/accountability/decision_support_AOCs.html"></a>
		
		<div class="overlay" style="opacity: 0.50; -moz-opacity: 0.50; filter:alpha(opacity=50);">&nbsp;</div>	
					 
          	<p>USGS is producing additional geospatial elevation data for the Lake Superior basin as part of a collaborative effort with GLOS and other partners to support wetland restoration activities, other habitat restoration, and tributary monitoring in the most cost-effective manner possible. Data will be easily accessible to partners and managers.
          	<br><span style="margin-left:20px; font-size:7pt; color:#FFFFFF; font-weight:bold; background:#60B4DB; padding-left:5px;padding-right:5px;">CONTACT:</span><a href="mailto:saichele@usgs.gov" style="font-size:7pt;color:#60B4DB;"> Steve Aichele</a></p>
	
	</div>	



      <div style="display: none;" id="story22" class="story">   
	  
	  <h1><span>Characterization of Rivermouth Ecosystems</span></h1>  
	     
        	<a href="projects/accountability/rivermouth_ecosystems.html"></a>
		
		<div class="overlay" style="opacity: 0.50; -moz-opacity: 0.50; filter:alpha(opacity=50);">&nbsp;</div>	
					 
          	<p>USGS scientists are determining essential stream and river mouth ecosystem characteristics that contribute to the ecological health of the Great Lakes near-shore and deep-water systems.  The project is providing information and tools for managers to <i>identify appropriate restoration practices for long term sustainability especially at AOCs.</i> 
<br><span style="margin-left:20px;font-size:7pt;color:#FFFFFF;font-weight:bold;background:#60B4DB;padding-left:5px;padding-right:5px;">CONTACT:</span><a href="mailto:pseelbach@usgs.gov" style="font-size:7pt;color:#60B4DB;"> Paul Seelbach,</a><a href="mailto:wrichardson@usgs.gov" style="font-size:7pt;color:#60B4DB;"> Bill Richardson</a></p>

	</div>	



      <div style="display: none;" id="story21" class="story">   
	  
	  <h1><span>Watershed Modeling for Stream Ecosystem Management</span></h1>  
	     
        	<a href="projects/accountability/watershed_modeling.html"></a>
		
		<div class="overlay" style="opacity: 0.50; -moz-opacity: 0.50; filter:alpha(opacity=50);">&nbsp;</div>	
					 
          	<p>USGS is creating forecasting tools for managers to determine how water withdrawals or other hydrologic or land use changes in watersheds may affect Great Lakes ecosystems.  This project is determining fish distributions in Great Lakes tributaries and how changes in stream flow may affect them.  This information will help guide restoration efforts to achieve maximum effectiveness and success. 
          	<br><span style="margin-left:20px;font-size:7pt;color:#FFFFFF;font-weight:bold;background:#60B4DB;padding-left:5px;padding-right:5px;">CONTACT:</span><a href="mailto:hwreeves@usgs.gov" style="font-size:7pt;color:#60B4DB;"> Howard W. Reeves,</a><a href="mailto:jsstewar@usgs.gov" style="font-size:7pt;color:#60B4DB;"> Jana S. Stewart,</a><a href="mailto:jemckenna@usgs.gov" style="font-size:7pt;color:#60B4DB;"> James E. McKenna</a></p>
		
	</div>	



      <div style="display: none;" id="story20" class="story">   
	  
	  <h1><span>Forecasting Great Lakes Basin Responses to Future Change</span></h1>  
	     
        	<a href="projects/accountability/responses_future_change.html"></a>
		
		<div class="overlay" style="opacity: 0.50; -moz-opacity: 0.50; filter:alpha(opacity=50);">&nbsp;</div>	
					 
          	<p>USGS is developing publicly accessible decision support systems based on climate change scenarios to provide managers with forecasting tools for predicting the combined effects of climate and land use changes that will help them identify and prioritize the best sites for restoration efforts. 
<br><span style="margin-left:20px;font-size:7pt;color:#FFFFFF;font-weight:bold;background:#60B4DB;padding-left:5px;padding-right:5px;">CONTACT:</span><a href="mailto:rjhunt@usgs.gov" style="font-size:7pt;color:#60B4DB;"> Randy Hunt</a></p>
		
	</div>



      <div style="display: none;" id="story19" class="story">   
	  
	  <h1><span>Forecasting Potential <i>Phragmites</i> Coastal Invasion Corridors</span></h1>  
	     
       		<a href="projects/accountability/Phragmites_invasion.html"></a>

		
		<div class="overlay" style="opacity: 0.50; -moz-opacity: 0.50; filter:alpha(opacity=50);">&nbsp;</div>	
					 
          	<p>Alterations to the Great Lakes shoreline or water-level patterns associated with global climate change could have significant impacts on the extent and composition of coastal habitat.  Low lake levels can expose fertile wetland bottomlands to invasive species such as common reed (<i>Phragmites</i>).  USGS will use remote-sensing data to establish a baseline understanding of current distributions of invasive wetland plants and then forecast potential invasion corridors. 
<br><span style="margin-left:20px;font-size:7pt;color:#FFFFFF;font-weight:bold;background:#60B4DB;padding-left:5px;padding-right:5px;">CONTACT:</span><a href="mailto:kkowalski@usgs.gov" style="font-size:7pt;color:#60B4DB;"> Kurt P. Kowalski</a></p>
		
	</div>




      <div style="display: none;" id="story18" class="story">   
	  
	  <h1><span>Implementation of the Great Lakes Observing System</span></h1>  
	     
        	<a href="projects/accountability/Great_Lakes_Observing_System.html"></a>
		
		<div class="overlay" style="opacity: 0.50; -moz-opacity: 0.50; filter:alpha(opacity=50);">&nbsp;</div>	
					 
          	<p style="font-size:8pt;">The Great Lakes Observing System coordinates and integrates regional coastal observations supporting national &amp; regional priorities including Great Lakes restoration. The DOI backbone project is providing instrumentation for real-time observing system information in tributaries, embayments, and the near-shore to determine and guide restoration activities.  A simulation model is also being developed that will provide quantifiable measures of restoration progress and comparisons of progress over time and space. 
<br><span style="margin-left:20px;font-size:7pt;color:#FFFFFF;font-weight:bold;background:#60B4DB;padding-left:5px;padding-right:5px;">CONTACT:</span><a href="mailto:capeters@usgs.gov" style="font-size:7pt;color:#60B4DB;"> Charlie Peters</a></p>
		
	</div>	



      <div style="display: none;" id="story17" class="story">   
	  
	  <h1><span>Changes in Nutrient Transfer Within Great Lakes Food Webs</span></h1>  
	     
       		<a href="projects/habitat_and_wildlife/nutrient_transfer.html"></a>
		
		<div class="overlay" style="opacity: 0.50; -moz-opacity: 0.50; filter:alpha(opacity=50);">&nbsp;</div>	
					 
          	<p>USGS is deciphering how food webs in Lake Michigan and Superior altered by invasive species and nutrients entering the lakes have changed energy flow and are affecting the recreational fishery.  This project is providing State, Tribal and Federal partners with information and predictions that will help them better understand the reasons behind the changes so they can make sustainable management decisions and implement practical restoration strategies. 
<br><span style="margin-left:20px;font-size:7pt;color:#FFFFFF;font-weight:bold;background:#60B4DB;padding-left:5px;padding-right:5px;">CONTACT:</span><a href="mailto:dbunnell@usgs.gov" style="font-size:7pt;color:#60B4DB;"> David Bunnell</a></p>
		
	</div>




      <div style="display: none;" id="story16" class="story">   
	  
	  <h1><span>Avian Botulism in Distressed Great Lakes Environments</span></h1>  
	     
        	<a href="projects/habitat_and_wildlife/avian_botulism.html"></a>
		
		<div class="overlay" style="opacity: 0.50; -moz-opacity: 0.50; filter:alpha(opacity=50);">&nbsp;</div>	
					 
         	 <p>A DOI team (USGS, FWS, NPS) is working together to determine why botulism outbreaks, which have caused extensive mortality of fish and fish-eating birds, are occurring in the Great Lakes.  This project has multiple components, including developing a new assay for testing for the presence of the toxin more quickly, evaluating how birds are exposed to the toxin through study of their locations and feeding habits, and determining what factors need to link together to trigger an outbreak.
<br><span style="margin-left:20px;font-size:7pt;color:#FFFFFF;font-weight:bold;background:#60B4DB;padding-left:5px;padding-right:5px;">CONTACT:</span><a href="mailto:sriley@usgs.gov" style="font-size:7pt;color:#60B4DB;"> Stephen Riley,</a><a href="mailto:cbunck@usgs.gov" style="font-size:7pt;color:#60B4DB;"> Christine Bunck</a></p><div style="position:absolute;top:279px;left:380px;"><a href="http://www.umesc.usgs.gov/terrestrial/migratory_birds/loons/migrations.html"> <img src="images/track_common_loons.png" alt="Track Movements of 5 Common Loons"> </a></div><p></p>
		
	</div>	



      <div style="display: none;" id="story15" class="story">   
	  
	  <h1><span>Improving Strategies to Restore Aquatic Habitats and Species</span></h1>  
	     
        	<a href="projects/habitat_and_wildlife/restore_aquatic_habitats.html"></a>
		
		<div class="overlay" style="opacity: 0.50; -moz-opacity: 0.50; filter:alpha(opacity=50);">&nbsp;</div>	
					 
          	<p style="font-size:8pt;">USGS is restoring native Atlantic salmon in Lake Ontario by raising fish, stocking them and conducting assessments to evaluate success.  Working closely with NY State, Iroquis Native Americans, and Ontario governments, USGS is ensuring that scientifically-based techniques and strategies are used to provide the highest probability of rehabilitation success and avoid potential fish diseases.  This project will phase in restoration of deepwater coregonids and lake sturgeon in Lake Ontario using similar methods. 
<br><span style="margin-left:20px;font-size:7pt;color:#FFFFFF;font-weight:bold;background:#60B4DB;padding-left:5px;padding-right:5px;">CONTACT:</span><a href="mailto:jhjohnson@usgs.gov" style="font-size:7pt;color:#60B4DB;"> Jim Johnson</a></p><div style="position:absolute;top:279px;left:380px;"><a href="http://cida.usgs.gov/glri/projects/habitat_and_wildlife/fish_culture_facility.html"> <img src="images/attention_restore_fish.png" alt="Native Fish Restoration in the Lake Ontario Basin"> </a></div><p></p>
		
	</div>




      <div style="display: none;" id="story14" class="story">   
	  
	  <h1><span>New Strategies for Restoring Coastal Wetland Functions</span></h1>  
	     
        	<a href="projects/habitat_and_wildlife/wetland_functions.html"></a>
		
		<div class="overlay" style="opacity: 0.50; -moz-opacity: 0.50; filter:alpha(opacity=50);">&nbsp;</div>	
					 
          	<p>USGS is restoring natural water flow and ecological processes between diked coastal wetlands in the Ottawa National Wildlife Refuge (Ohio) and adjacent Lake Erie waters to improve fish and wildlife habitat.  The project is developing sustainable approaches that will restore coastal wetland function and increase ecosystem resilience to be used as a model throughout the Great Lakes basin.  
<br><span style="margin-left:20px;font-size:7pt;color:#FFFFFF;font-weight:bold;background:#60B4DB;padding-left:5px;padding-right:5px;">CONTACT:</span><a href="mailto:kkowalski@usgs.gov" style="font-size:7pt;color:#60B4DB;"> Kurt P. Kowalski,</a></p>
		
		</div>



      <div style="display: none;" id="story13" class="story">   
	  
	  <h1><span>Fish Habitat Enhancement Strategies for the Huron-Erie Corridor</span></h1>  
	     
       		<a href="projects/habitat_and_wildlife/fish_habitat_HEC.html"></a>
		
		<div class="overlay" style="opacity: 0.50; -moz-opacity: 0.50; filter:alpha(opacity=50);">&nbsp;</div>	
					 
          	<p>USGS is restoring and enhancing native fish habitat and populations in the Huron-Erie Corridor through a multi-agency/organization bi-national partnership.  The project is identifying, assessing, and prioritizing sites for fish spawning habitat construction and fish and nursery habitat restoration to address Beneficial Use Impairments in the Detroit River and St. Clair River Areas of Concern (AOC) and to help define what constitutes adequate restoration in the AOC.  
<br><span style="margin-left:20px;font-size:7pt;color:#FFFFFF;font-weight:bold;background:#60B4DB;padding-left:5px;padding-right:5px;">CONTACT:</span><a href="mailto:eroseman@usgs.gov" style="font-size:7pt;color:#60B4DB;"> Ed Roseman,</a><a href="mailto:dbennion@usgs.gov" style="font-size:7pt;color:#60B4DB;"> David Bennion,</a><a href="mailto:gkennedy@usgs.gov" style="font-size:7pt;color:#60B4DB;"> Greg Kennedy,</a><a href="mailto:bmanny@usgs.gov" style="font-size:7pt;color:#60B4DB;"> Bruce Manny,</a><a href="mailto:smorrison@usgs.gov" style="font-size:7pt;color:#60B4DB;"> Sandy Morrison</a></p>
		
	</div>	



    
      <div style="display: none;" id="story12" class="story">   
	  
	  <h1><span>Building Local Capacity to Address Nonpoint Source Problems</span></h1>  
	     
        	<a href="projects/nearshore_health/nonpoint_source_problems.html"></a>
		
		<div class="overlay" style="opacity: 0.50; -moz-opacity: 0.50; filter:alpha(opacity=50);">&nbsp;</div>	
					 
          	<p>USGS will provide a 1-week training course for "Geomorphic Analysis of Fluvial Systems" to USEPA and other state and local agencies in Chicago. There are five instructors for the course. The purpose of this course is to provide an introduction into the concepts of fluvial geomorphology and examples of geomorphic analysis, assessment, and monitoring. 
<br><span style="margin-left:20px;font-size:7pt;color:#FFFFFF;font-weight:bold;background:#60B4DB;padding-left:5px;padding-right:5px;">CONTACT:</span><a href="mailto:fafitzpa@usgs.gov @usgs.gov" style="font-size:7pt;color:#60B4DB;"> Faith Fitzpatrick</a></p>
		
	</div>



    
      <div style="display: none;" id="story11" class="story">   
	  
	  <h1><span>Development of Watershed TMDLs in the Great Lakes Basin</span></h1>  
	     
        	<a href="projects/nearshore_health/watershed_TMDLs.html"></a>
		
		<div class="overlay" style="opacity: 0.50; -moz-opacity: 0.50; filter:alpha(opacity=50);">&nbsp;</div>	
					 
          	<p style="font-size:8pt;">This work will focus on assessment of the hydrology, water quality, and response to simulated changes in phosphorus loading of the Winnebago Pool Lakes, Wisconsin.  Scientists will document water quality; develop phosphorus budgets and quantify the sources of phosphorus; and use models to simulate the likely response of each of these Lakes to changes in phosphorus loading associated with various lake-management actions that might be implemented to improve water quality, and provide information to construct a TMDL for the Winnebago Pool Lakes. 
<br><span style="margin-left:20px;font-size:7pt;color:#FFFFFF;font-weight:bold;background:#60B4DB;padding-left:5px;padding-right:5px;">CONTACT:</span><a href="mailto:dzrobert@usgs.gov" style="font-size:7pt;color:#60B4DB;"> Dale Robertson</a></p>
		
	</div>	



      <div style="display: none;" id="story10" class="story">   
	  
	  <h1><span>Enhance Great Lakes Beach Recreational Water Quality Decision Making</span></h1>  
	     
        	<a href="projects/nearshore_health/beach_water_quality.html"></a>

		
		<div class="overlay" style="opacity: 0.50; -moz-opacity: 0.50; filter:alpha(opacity=50);">&nbsp;</div>	
					 
          	<p>USGS is developing rapid beach water quality assessment approaches and decision-making tools that provide timely and accurate information to beach managers and the public on daily swimming conditions and beach health.  This project is finding sources of pollution and the environmental factors that may create a situation where unhealthy bacteria or viruses can live and pose a threat to public health. 
<br><span style="margin-left:20px;font-size:7pt;color:#FFFFFF;font-weight:bold;background:#60B4DB;padding-left:5px;padding-right:5px;">CONTACT:</span><a href="mailto:jrmorris@usgs.gov" style="font-size:7pt;color:#60B4DB;"> Jim Morris</a></p>
		
	</div>



      <div style="display: none;" id="story9" class="story">   
	  
	  <h1><span>Forecast/Nowcast Great Lakes Nutrient and Sediment Loadings</span></h1>  
	     
        	<a href="projects/nearshore_health/forecast_loadings.html"></a>
		
		<div class="overlay" style="opacity: 0.50; -moz-opacity: 0.50; filter:alpha(opacity=50);">&nbsp;</div>	
					 
          	<p>USGS scientists will collect real-time, near-real-time, and synoptic flow and water-quality data (sediment and nutrients) from tributaries to the Great Lakes. The work will be aligned with the proposed National Monitoring Network Design for the Great Lakes. The data will provide baseline information to access effectiveness of restoration activities. Watershed modeling will help to make progress towards determining the total loading and understanding management of restoration efforts. 
<br><span style="margin-left:20px;font-size:7pt;color:#FFFFFF;font-weight:bold;background:#60B4DB;padding-left:5px;padding-right:5px;">CONTACT:</span><a href="mailto:ebuglios@usgs.gov" style="font-size:7pt;color:#60B4DB;"> Ed Bugliosi</a></p>
		
	</div>	



      <div style="display: none;" id="story8" class="story">   
	  
	  <h1><span>Controlling Dreissenid Mussels</span></h1>  
	     
        	<a href="projects/invasive_species/zm_control.html"></a>
		
		<div class="overlay" style="opacity: 0.50; -moz-opacity: 0.50; filter:alpha(opacity=50);">&nbsp;</div>	
					 
          	<p style="font-size:8pt;">There is an immediate need for effective and safe tools to prevent the spread of planktonic larval dreissenids (quagga Dreissena rostriformis bugensis and zebra mussels D. polymorpha) and to rehabilitate and protect native unionid habitats by controlling existing dreissenid mussel populations in and around the Great Lakes. 
<br><span style="margin-left:20px;font-size:7pt;color:#FFFFFF;font-weight:bold;background:#60B4DB;padding-left:5px;padding-right:5px;">CONTACT:</span><a href="mailto:mgaikowski@usgs.gov" style="font-size:7pt;color:#60B4DB;"> Mark Gaikowski</a></p>
		
	</div>	



      <div style="display: none;" id="story7" class="story">   
	  
	  <h1><span>Innovative Phragmites-Control Strategies</span></h1>  
	     
        	<a href="projects/invasive_species/Phragmites_control.html"></a>
		
		<div class="overlay" style="opacity: 0.50; -moz-opacity: 0.50; filter:alpha(opacity=50);">&nbsp;</div>	
					 
          	<p style="font-size:8pt;">USGS is developing innovative <i>Phragmites</i> control measures to keep this rapidly spreading invasive plant from further expanding its range into new wetland habitats and to aid in the development of successful restoration strategies.  The project seeks to determine if fungi that live within the <i>Phragmites</i> are enabling the plant to take over habitat used by native plants; and (2) Examine gene silencing technology that will help control the spread of invasive plants by 'switching off' a gene that, for example, contributes to the plant’s ability to spread. 
<br><span style="margin-left:20px;font-size:7pt;color:#FFFFFF;font-weight:bold;background:#60B4DB;padding-left:5px;padding-right:5px;">CONTACT:</span><a href="mailto:kkowalski@usgs.gov" style="font-size:7pt;color:#60B4DB;"> Kurt P. Kowalski</a></p>
		
	</div>



      <div style="display: none;" id="story6" class="story">   
	  
	  <h1><span>Asian Carp Science</span></h1>  
	     
        	<a href="projects/invasive_species/asian_carp_science.html"><img src="images/glri/GLRI_pic_asian_carp_page.jpg" alt="story6"></a>
		
		<div class="overlay" style="opacity: 0.50; -moz-opacity: 0.50; filter:alpha(opacity=50);">&nbsp;</div>	
					 
          	<p>USGS is developing new management control tools and strategies to prevent spread of Asian carp into the Great Lakes basin and reduce current populations in other large river basins. In addition, the USGS is using an Integrated Pest Management (IPM) approach that incorporates comprehensive information on the life cycles of Asian carp and their interaction with the environment. Understanding Asian carp life history is essential for prevention, surveillance, and control tool development and application.
<br><span style="margin-left:20px;font-size:7pt;color:#FFFFFF;font-weight:bold;background:#60B4DB;padding-left:5px;padding-right:5px;">CONTACT:</span><a href="mailto:smorrison@usgs.gov" style="font-size:7pt;color:#60B4DB;"> Sandra Morrison </a> &amp; <a href="mailto:ckolar@usgs.gov" style="font-size:7pt;color:#60B4DB;"> Cindy Kolar</a> </p>
		
	</div>





      <div style="display: none;" id="story5" class="story">   
	  
	  <h1><span>Toxicity Studies for EPA</span></h1>  
	     
        	<a href="projects/toxic_substances/EPA_toxicity_studies.html"><img src="images/glri/GLRI_pic_147_page.png" alt="story5"></a>
		
		<div class="overlay" style="opacity: 0.50; -moz-opacity: 0.50; filter:alpha(opacity=50);">&nbsp;</div>	
					 
          	<p>This series of projects focuses on toxicity studies to develop and standardize test methods for assessing the sensitivity of freshwater mussels and other aquatic organisms to toxic contaminants.  This information will assist EPA, states, and tribes in the establishment of water quality criteria for the protection of these aquatic organisms under the Clean Water Act.
          	<br><span style="margin-left:20px;font-size:7pt;color:#FFFFFF;font-weight:bold;background:#60B4DB;padding-left:5px;padding-right:5px;">CONTACT:</span><a href="mailto:cingersoll@usgs.gov" style="font-size:7pt;color:#60B4DB;"> Chris Ingersoll</a></p>
		
	</div>	





      <div style="display: none;" id="story4" class="story">   
	  
	  <h1><span>Great Lakes Legacy Act Support</span></h1>  
	     
        	<a href="projects/toxic_substances/Great_Lakes_Legacy_Act.html"><img src="images/glri/GLRI_pic_143_page.png" alt="story4"></a>
		
		<div class="overlay" style="opacity: 0.50; -moz-opacity: 0.50; filter:alpha(opacity=50);">&nbsp;</div>	
					 
          	<p style="font-size:8pt;">USGS will provide research support for contaminated sediment assessment/remediation/ under the Great Lakes Legacy Act (GLLA).  USEPA has been working under the GLLA to assess and remediate contaminated sediments in Great Lakes AOCs since 2004.  USEPA expects to continue with these activities under funds from the GLRI.  The work under this task will assist GLNPO in evaluating the relationship between sediment contamination and adverse biological effects at select site(s) which will be helpful in preparing sites for sediment remediation under the GLLA. 
<br><span style="margin-left:20px;font-size:7pt;color:#FFFFFF;font-weight:bold;background:#60B4DB;padding-left:5px;padding-right:5px;">CONTACT:</span><a href="mailto:cingersoll@usgs.gov" style="font-size:7pt;color:#60B4DB;"> Chris Ingersoll,</a><a href="mailto:elittle@usgs.gov" style="font-size:7pt;color:#60B4DB;"> Edward Little</a></p>
		
	</div>	


      <div style="display: none;" id="story3" class="story">   
	  
	  <h1><span>Birds as Indicators of Contaminant Exposure in the Great Lakes</span></h1>  
	     
        	<a href="projects/toxic_substances/birds_as_indicators.html"><img src="images/glri/GLRI_pic_80_page.png" alt="story3"></a>		

		<div class="overlay" style="opacity: 0.50; -moz-opacity: 0.50; filter:alpha(opacity=50);">&nbsp;</div>	
					 
          	<p>USGS is quantifying effects of historical and emerging contaminants on Great Lakes food chains, and evaluating exposure and effects of these contaminants on sentinel indicator species, specifically select species of birds (colonial waterbirds, tree swallows).  Results will contribute to assessments of Great Lakes ecosystem health and science based decision making, and provide a baseline for future trend analysis, including a determination of the effectiveness of recently remediated Areas of Concern and other known hotspots. 
<br><span style="margin-left:20px;font-size:7pt;color:#FFFFFF;font-weight:bold;background:#60B4DB;padding-left:5px;padding-right:5px;">CONTACT:</span><a href="mailto:tcuster@usgs.gov" style="font-size:7pt;color:#60B4DB;"> Thomas W. Custer,</a><a href="mailto:ccuster@usgs.gov" style="font-size:7pt;color:#60B4DB;"> Christine M. Custer</a></p>

	</div>

	


      <div style="display: none;" id="story2" class="story">   
	  
	  <h1><span>Mercury Cycling and Bioaccumulation in the Great Lakes</span></h1>  
	     
        	<a href="projects/toxic_substances/mercury_cycling.html"><img src="images/glri/GLRI_pic_79_page.png" alt="story2"></a>
		
		<div class="overlay" style="opacity: 0.50; -moz-opacity: 0.50; filter:alpha(opacity=50);">&nbsp;</div>	
					 
          	<p>USGS is improving the health of the Great Lakes sport and commercial fisheries by examining the processes that result in mercury entering the food chain, determining how it affects the fish, and the implications for public health.  Providing decision makers with a scientific understanding of mercury processes can help them to prescribe actions that could impede those processes and restore a healthier fishery. 
<br><span style="margin-left:20px;font-size:7pt;color:#FFFFFF;font-weight:bold;background:#60B4DB;padding-left:5px;padding-right:5px;">CONTACT:</span><a href="mailto:dpkrabbe@usgs.gov" style="font-size:7pt;color:#60B4DB;"> David P. Krabbenhoft</a></p>

	</div>
		



      <div style="display: block;" id="story1" class="story visible">   
	  
	  <h1><span>Determine Baseline and Sources of Toxic Contaminant Loadings</span></h1>  
	     
        	<a href="projects/toxic_substances/contaminant_loadings.html"><img src="images/glri/GLRI_pic_78b_page.png" alt="story1"></a>
		
		<div class="overlay" style="opacity: 0.50; -moz-opacity: 0.50; filter:alpha(opacity=50);">&nbsp;</div>	
					 
          	<p>USGS is identifying the types and spatial distribution of emerging and legacy toxic contaminants in the water and sediments in the Great Lakes at AOC sites that intersect the National Monitoring Network for U.S. Coastal Waters and Tributaries design. Providing this information to decision makers can help prioritize watersheds for restoration, develop strategies to reduce contaminants, and measure the success of those efforts in meeting restoration goals. 
<br><span style="margin-left:20px;font-size:7pt;color:#FFFFFF;font-weight:bold;background:#60B4DB;padding-left:5px;padding-right:5px;">CONTACT:</span><a href="mailto:capeters@usgs.gov" style="font-size:7pt;color:#60B4DB;"> Charles Peters</a></p>
		
	</div>	
		
				
      <div style="display: none;" id="story6" class="story">   
	  
	  <h1><span>Asian Carp Science</span></h1>  
	     
        	<a href="projects/invasive_species/asian_carp_science.html"><img src="images/glri/GLRI_pic_asian_carp_page.jpg" alt="story6"></a>
		
		<div class="overlay" style="opacity: 0.50; -moz-opacity: 0.50; filter:alpha(opacity=50);">&nbsp;</div>	
					 
          	<p>USGS is developing new management control tools and strategies to prevent spread of Asian carp into the Great Lakes basin and reduce current populations in other large river basins. In addition, the USGS is using an Integrated Pest Management (IPM) approach that incorporates comprehensive information on the life cycles of Asian carp and their interaction with the environment. Understanding Asian carp life history is essential for prevention, surveillance, and control tool development and application.
<br><span style="margin-left:20px;font-size:7pt;color:#FFFFFF;font-weight:bold;background:#60B4DB;padding-left:5px;padding-right:5px;">CONTACT:</span><a href="mailto:smorrison@usgs.gov" style="font-size:7pt;color:#60B4DB;"> Sandra Morrison </a> &amp; <a href="mailto:ckolar@usgs.gov" style="font-size:7pt;color:#60B4DB;"> Cindy Kolar</a> </p>
		
	</div>
		
		
		
   
    </div>	
	
</div>

<div class="clear"></div>

<div id="controls" class="" style="margin-left:45px;">
	
      <ul>
        <li class="prev"><a href="#" class="prev"><img src="images/controlPrev.jpg" alt="previous headline article" style="margin-right:5px;"></a></li>
    	<li class="nolink3 link nolink">1<a href="#">1</a></li>
	<li class="nolink3 link">2<a href="#">2</a></li>
	<li class="nolink3 link">3<a href="#">3</a></li>
	<li class="nolink3 link">4<a href="#">4</a></li>
	<li class="nolink3 link">5<a href="#">5</a></li>
	<li class="link">6<a href="#">6</a></li>
	<li class="link">7<a href="#">7</a></li>
	<li class="link">8<a href="#">8</a></li>
	<li class="nolink3">9<a href="#">9</a></li>
	<li class="nolink3">10<a href="#">10</a></li>
	<li class="nolink3">11<a href="#">11</a></li>
	<li class="nolink3">12<a href="#">12</a></li>
	<li class="link">13<a href="#">13</a></li>
	<li class="link">14<a href="#">14</a></li>
	<li class="link">15<a href="#">15</a></li>
	<li class="link">16<a href="#">16</a></li>
	<li class="link">17<a href="#">17</a></li>
	<li class="nolink3">18<a href="#">18</a></li>
	<li class="nolink3">19<a href="#">19</a></li>
	<li class="nolink3">20<a href="#">20</a></li>	
	<li class="nolink3">21<a href="#">21</a></li>
	<li class="nolink3">22<a href="#">22</a></li>
	<li class="nolink3">23<a href="#">23</a></li>	
	<li class="nolink3">24<a href="#">24</a></li>	
	<li class="nolink3">25<a href="#">25</a></li>				
        <li class="next"><a href="#" class="next"><img src="images/controlNext.jpg" alt="next headline article"></a></li>
      </ul>

    </div>
  <div class="clear"></div>


<!--[if IE 6]>  
<script type="text/javascript" src="unitpngfix.js"></script>
<![endif]-->







<script type="text/javascript">
$(function() {
	headlineImages = new Array('<img src=\'images/glri/GLRI_pic_164_page.png\' alt=\'story25\' />','<img src=\'images/glri/GLRI_pic_84_page.png\' alt=\'story24\' />','<img src=\'images/glri/GLRI_pic_83_page.png\' alt=\'story23\' />','<img src=\'images/glri/GLRI_pic_82_page.png\' alt=\'story22\' />','<img src=\'images/glri/GLRI_pic_81b_page.png\' alt=\'story21\' />','<img src=\'images/glri/GLRI_pic_75_page.png\' alt=\'story20\' />','<img src=\'images/glri/GLRI_pic_68b_page.png\' alt=\'story19\' />','<img src=\'images/glri/GLRI_pic_backbone_page.png\' alt=\'story18\' />','<img src=\'images/glri/GLRI_pic_74b_page.png\' alt=\'story17\' />','<img src=\'images/glri/GLRI_pic_73_page.png\' alt=\'story16\' />','<img src=\'images/glri/GLRI_pic_72_page.png\' alt=\'story15\' />','<img src=\'images/glri/GLRI_pic_71b_page.png\' alt=\'story14\' />','<img src=\'images/glri/GLRI_pic_70b_page.png\' alt=\'story13\' />','<img src=\'images/glri/GLRI_pic_137_page.png\' alt=\'story12\' />','<img src=\'images/glri/GLRI_pic_134_page.png\' alt=\'story11\' />','<img src=\'images/glri/GLRI_pic_77_page.png\' alt=\'story10\' />','<img src=\'images/glri/GLRI_pic_76_page.png\' alt=\'story9\' />','<img src=\'images/glri/GLRI_pic_zmdigestive_page.jpg\' alt=\'story8\' />','<img src=\'images/glri/GLRI_pic_67_page.png\' alt=\'story7\' />','<img src=\'images/glri/GLRI_pic_asian_carp_page.jpg\' alt=\'story6\' />','<img src=\'images/glri/GLRI_pic_147_page.png\' alt=\'story5\' />','<img src=\'images/glri/GLRI_pic_143_page.png\' alt=\'story4\' />','<img src=\'images/glri/GLRI_pic_80_page.png\' alt=\'story3\' />','<img src=\'images/glri/GLRI_pic_79_page.png\' alt=\'story2\' />','<img src=\'images/glri/GLRI_pic_78b_page.png\' alt=\'story1\' />');
	headlineImages.reverse();
	removeLink = function() {
		return $('div#controls ul li.nolink').removeClass('nolink').addClass('link');	
	}
	x = 1;
	$('div#headline div#story'+x).addClass('visible');		
	$('div#controls ul li a:not(.prev,.next)').click(function(e) {	  	
		removeLink();	
		var clicked = $(e.target);
		clicked
			.parent('li')
			.addClass('nolink')
			.removeClass('link');												
		x = parseInt($(this).text());			
		$('div.visible')
			.fadeOut(500)
			.removeClass('visible');
		$('div#story'+x+' a:first').html(''+headlineImages[x-1]+'');							
		$('div#headline div#story'+x).hide().fadeIn(500);		
		$('div#headline div#story'+x+'').addClass('visible');
		$('div#headline div.story:not(div#headline div#story'+x+')').hide();
		return false;			
	});		
	$('div#controls ul li a.prev').click(function() {		
		if(x>1) {		
			x--;
			removeLink();			
			$('div.visible')
				.fadeOut(500)
				.removeClass('visible');
			$('div#story'+x+' a:first').html(''+headlineImages[x-1]+'');													
			$('div#headline div#story'+x).hide().fadeIn(500);
			$('div#headline div.story:not(div#headline div#story'+x+')').hide();							
			$('div#headline div#story'+x+'').show().addClass('visible');
			$('div#controls ul li:eq('+x+')').addClass('nolink');			
			return false;		
		}			
		else {			
			return false;			
		}		
	});	
	$('div#controls ul li a.next').click(function() {	
		if(x<headlineImages.length) {		
			x++;			
			removeLink();			
			$('div.visible')
				.fadeOut(250)
				.removeClass('visible');
			$('div#story'+x+' a:first').html(''+headlineImages[x-1]+'');									
			$('div#headline div#story'+x).hide().fadeIn(500);
			$('div#headline div.story:not(div#headline div#story'+x+')').hide();					
			$('div#headline div#story'+x+'').show().addClass('visible');
			$('div#controls ul li:eq('+x+')').addClass('nolink');
			return false;	
		}		
		else {			
			return false;				
		}	
	});	
	$('div#controls').removeClass('fouc');	
});


</script>


		</div>
		
<!--[if IE]>
		<center><img style="margin-top:-21px;margin-left:16px;" src="images/categories3.png" alt="USEPA GLRI Project Categories" /></center>
<![endif]-->

<!--[if !IE]-->

		<center><img style="margin-top:-21px;;margin-left:16px;" src="images/categories3.png" alt="USEPA GLRI Project Categories"></center>
<!--[endif]-->


															</div>
														</div>
													</div>
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>							
							
							<div class="well clearfix" ng-if="transient.currentItem">
									
									<h2>{{transient.currentItem.title}}</h2>
									<img class="browse-image" ng-if="transient.currentItem.browseImage" src="{{transient.currentItem.browseImage}}" />
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
									
									<h4>For more information, <a title="Click to go directly to this record in ScienceBase" href="{{transient.currentItem.url}}" target="_blank">see all of this project's metadata in ScienceBase &gt;&gt;</a></h4>
									
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