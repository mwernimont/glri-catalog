if ('${cida.google.analytics.enabled}'=='true') {
	
	(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
	(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
	m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
	})(window,document,'script','//www.google-analytics.com/analytics.js','ga');
	
	ga('set', 'anonymizeIp', true);
	ga('create', '${cida.google.analytics.trackingid}', '${cida.google.analytics.domain}');
	ga('send', 'pageview');
	
} else {
	
	console.log("Google Analytics is disabled for this non-production build.  Logging all ga calls to the console instead.");
	
	var valToStr = function(val) {
		if (angular.isArray(val)) {
			val = aryToStr(val)
		} else if (angular.isObject(val)) {
			val = objToStr(val)
		} else {
			val = '"'+val +'"'
		}
		return val
	}
	var objToStr = function(obj) {
		var str = "{"
		var sep = ""
		var keys = Object.keys(obj)
		for (k in keys) {
			var key = keys[k]
			var val = valToStr(obj[key])
			str+= sep + '"'+key+'"' +":"+ val
			sep = ", "
		}
		str += "}"
		return str
	}
	var aryToStr = function(keys) {
		var str = "["
		var sep = ""
		for (k in keys){
			var val = valToStr(keys[k])
			str+= sep + val;
			sep = ", ";
		}
		str += "]"
		return str
	}
	
	//Create dummy ga function that code can still use even though the Google api was not loaded.
	ga = function() {
		var s = "ga ignoring: " + aryToStr(arguments);
		console.log(s);
	} 
}
