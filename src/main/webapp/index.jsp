<%@page contentType="text/html" pageEncoding="UTF-8"%>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN"
   "http://www.w3.org/TR/html4/loose.dtd">

<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <title>Science Base Sample Query Page</title>
    </head>
    <body>
		<h1>GLRI to ScienceBase Query API Example</h1>
		<p>All query are being submitted to the ScienceBase REST API.</p>
		<p>
			Choosing the <b>GLRI Results Only</b> option limits the results to the
			<a href="https://www.sciencebase.gov/catalog/item/52e6a0a0e4b012954a1a238a">Great Lakes Restoration Initiative</a>
			community of datasets.
		</p>
        <div>
			<form action="ScienceBaseService">
				<fieldset title="Standard ScienceBase Text Search">
					<div class="field">
						<label for="text_query_input">Text Query</label>
						<input type="text" size="30" id="text_query_input" name="text_query"/>
					</div>
				</fieldset>
				<fieldset title="GLRI Specific tags">
					<div class="field">
						<label for="medium_input">Sample Medium</label>
						<select id="medium_input" name="medium">
							<option value="">Any</option>
							<option value="water">water</option>
							<option value="air">air</option>
						</select>
					</div>
					<div class="field">
						<label for="param_group_input">Parameter Group</label>
						<select id="param_group_input" name="param_group">
							<option value="">Any</option>
							<option value="Nutrient">Nutrient</option>
							<option value="Biological">Biological</option>
							<option value="Organics">Organics</option>
							<option value="Inorganics">Inorganics</option>
						</select>
					</div>
					<div class="field">
						<label for="param_input">Parameter Group</label>
						<select id="param_input" name="param">
							<option value="">Any</option>
							<option value="Nitrogen">Nitrogen</option>
							<option value="Phosphorus">Phosphorus</option>
							<option value="Fish">Fish</option>
							<option value="Birds">Birds</option>
							<option value="PCB">PCB</option>
							<option value="Mercury">Mercury</option>
							<option value="Atrazine">Atrazine</option>
						</select>
					</div>
					<div class="field">
						<label for="area_input">GRRI Study Area</label>
						<select id="area_input" name="area">
							<option value="">Any</option>
							<option value="Lake Michigan Basin">Lake Michigan Basin</option>
							<option value="Lake Erie Basin">Lake Erie Basin</option>
							<option value="Lake Huron Basin">Lake Huron Basin</option>
							<option value="Lake Superior Basin">Lake Superior Basin</option>
							<option value="Lake Ontario Basin">Lake Ontario Basin</option>
						</select>
					</div>
				</fieldset>
				<fieldset title="Search Options">
					<div class="field">
						<label for="glri_only_input">GLRI Results Only?</label>
						<input type="checkbox" checked="checked" id="glri_only_input" name="glri_only" value="true" />
					</div>

					<div class="field">
						<label for="format_input">Result Format</label>
						<select id="format_input" name="format">
							<option value="html">HTML</option>
							<option value="xml">XML</option>
							<option value="json">JSON</option>
						</select>
					</div>

					<input type="submit" value="Submit"/>
				</fieldset>
			</form>
			
		</div>
    </body>
</html>
