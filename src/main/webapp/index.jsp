<%@page contentType="text/html" pageEncoding="UTF-8"%>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN"
   "http://www.w3.org/TR/html4/loose.dtd">

<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <title>Science Base Sample Query Page</title>
    </head>
    <body>
        <div>
			<form action="ScienceBaseService">
				<div class="field">
					<label for="medium_input">Sample Medium</label>
					<select id="medium_input" name="medium">
						<option value="">Any</option>
						<option value="water">water</option>
						<option value="air">air</option>
					</select>
				<div>
				<div class="field">
					<label for="param_group_input">Parameter Group</label>
					<select id="param_group_input" name="param_group">
						<option value="">Any</option>
						<option value="Nutrient">Nutrient</option>
						<option value="Biological">Biological</option>
						<option value="Organics">Organics</option>
						<option value="Inorganics">Inorganics</option>
					</select>
				<div>
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
				<div>
				<div class="field">
					<label for="area_input">GRRI Study Area</label>
					<option value="">Any</option>
					<select id="area_input" name="area">
						<option value="">Any</option>
						<option value="Lake Michigan Basin">Lake Michigan Basin</option>
						<option value="Lake Erie Basin">Lake Erie Basin</option>
						<option value="Lake Huron Basin">Lake Huron Basin</option>
						<option value="Lake Superior Basin">Lake Superior Basin</option>
						<option value="Lake Ontario Basin">Lake Ontario Basin</option>
					</select>
				<div>
				
				
				<input type="hidden" name="format" value="html">
				<input type="submit" value="Submit">
			</form>
			
		</div>
    </body>
</html>
