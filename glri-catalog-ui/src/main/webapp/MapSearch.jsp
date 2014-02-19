<%@page contentType="text/html" pageEncoding="UTF-8"%>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN"
   "http://www.w3.org/TR/html4/loose.dtd">

<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
		
		
		<!-- Tomcat 7 only 
		<script type="text/javascript" src="webjars/jquery/2.1.0/jquery.js"></script>
		-->
		<script type="text/javascript" src="js/lib/jquery/2.1.0/jquery.js"></script>
		<script type="text/javascript" src="js/lib/jquery-dynatable/0.3.1/jquery.dynatable.js"></script>
		
		<!-- OpenLayers -->
		<script type="text/javascript" src="js/lib/OpenLayers/OpenLayers.js"></script>
		
		<script type="text/javascript" src="js/app/main.js"></script>
		
		<link rel="stylesheet" type="text/css" href="js/lib/jquery-dynatable/0.3.1/jquery.dynatable.css" />
		<link rel="stylesheet" type="text/css" href="style/css/usgs_style_main.css" />
		<link rel="stylesheet" type="text/css" href="style/css/table.css" />
		<link rel="stylesheet" type="text/css" href="style/css/app.css" />
		<link rel="stylesheet" type="text/css" href="style/css/left-nav.css" />
		
        <title>Science Base Sample Map Selection Page</title>
    </head>
    <body>
    		<jsp:include page="template/header.jsp" flush="true" />
		
        	<div id="map" class="map"></div>
        	
        	<br /><br /><br /><br /><br /><br /><br /><br /><br />
        	<input type="checkbox" name="drawBox" id="drawBox" value="box">Draw Box
        	<br /><br />
        	<form id="sb-query-form" action="ScienceBaseService">
        		<input type="hidden" id="glri_only_input" name="glri_only" value="true" />
        		<input type="hidden" id="format_input" name="format" value="json">
        		<input type="hidden" id="spatial" name="spatial" value="[40, -92, -75, 49]">
        		<input id="query-submit" type="submit" value="Submit"/>
        	</form>
        	<br /><br />
        	<div class="col1wrap">
			<div class="col1">
				<div id="lead-in">
					<h1>GLRI to ScienceBase Query API Example</h1>
					<p>All query are being submitted to the ScienceBase REST API.</p>
					<p>
						Choosing the <b>GLRI Results Only</b> option limits the results to the
						<a href="https://www.sciencebase.gov/catalog/item/52e6a0a0e4b012954a1a238a">Great Lakes Restoration Initiative</a>
						community of datasets.
					</p>
				</div>
				<table id="query-results-table" class="hidden">
					<thead>
						<tr>
							<th>id</th>
							<th>title</th>
							<th>summary</th>
						</tr>
					</thead>
					<tbody>

					</tbody>
				</table>
			</div>
		</div>
        	
        	<script type="text/javascript">
        		var boxControl;
        		
	    		$(document).ready(function() {
		            var lon = -85.47;
		            var lat = 45.35;
		            var zoom = 5.25;
		            var map, wmsLayer, boxLayer;
		            
		            function init() {
		                map = new OpenLayers.Map('map');

		                wmsLayer = new OpenLayers.Layer.WMS( "OpenLayers WMS",
		                    "http://vmap0.tiles.osgeo.org/wms/vmap0?", {layers: 'basic'});

		                boxLayer = new OpenLayers.Layer.Vector("Box layer");

		                map.addLayers([wmsLayer, boxLayer]);
		                map.addControl(new OpenLayers.Control.LayerSwitcher());
		                map.addControl(new OpenLayers.Control.MousePosition());

		                boxControl = new OpenLayers.Control.DrawFeature(boxLayer,
		                        OpenLayers.Handler.RegularPolygon, {
		                            handlerOptions: {
		                                sides: 4,
		                                irregular: true
		                            }
		                        }
		                    );
		               
		               // register a listener for removing any boxes already drawn
					boxControl.handler.callbacks.create = function(data) {
					    if(boxLayer.features.length > 0) {
					    	boxLayer.removeAllFeatures();
					    }
					}
		                
		            	// register a listener for drawing a box
					boxControl.events.register('featureadded', boxControl, function(f) {
					
					  // Variables for the geometry are: bottom/left/right/top
					  // Sciencebase requires bounds to look like: [xmin,ymin,xmax,ymax]
					  var extent = "[" + f.feature.geometry.bounds.left +
					               "," + f.feature.geometry.bounds.bottom +
					               "," + f.feature.geometry.bounds.right +
					               "," + f.feature.geometry.bounds.top + "]";
					  
					  $('#spatial').val(extent);
					 });

		                
		                map.addControl(boxControl);
		                

		                map.setCenter(new OpenLayers.LonLat(lon, lat), 5);
		            }

		    		init();
		    		
		    		$('#drawBox').click(function() {
		    			if($(this).is(':checked')) {
						boxControl.handler.stopDown = true;
						boxControl.handler.stopUp = true;
						boxControl.activate();
					} else {
						boxControl.handler.stopDown = false;
						boxControl.handler.stopUp = false;
						boxControl.deactivate();
					}
		    		});
	    		});
        	</script>
	</body>
</html>