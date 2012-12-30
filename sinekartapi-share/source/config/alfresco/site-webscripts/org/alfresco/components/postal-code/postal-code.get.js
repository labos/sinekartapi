<import resource="classpath:/alfresco/templates/org/alfresco/import/alfresco-util.js">
<import resource="classpath:/alfresco/site-webscripts/org/alfresco/components/documentlibrary/include/documentlist.lib.js">

function formatTemperature(value)
{
   var scale = args.tempScale,
      celcius = value.substring(0, value.indexOf(" "));
   if (celcius.length > 0)
   {
      celciusVal = parseInt(celcius); // temperature is always an int
      return (scale == "F" ? ("" + Math.round(celciusVal * 9 / 5 + 32) + "°F") : ("" + celciusVal + "°C"))
   }
}

function getZipCode (results, status) {
    if (status == "OK") {
    	var returnArray = [];
    	   for (var i = 0; i < results.length; i++)
           {
    		   var address = results[i].address_components;
    		   var postalCode = "";
    		   var route = "";
    		   var province = "";
    	        for (p = address.length-1; p >= 0; p--) {
    	            if (address[p].types.indexOf("postal_code") != -1) {
    	                //console.log(address[p].long_name);
    	            	postalCode = address[p].long_name;
    	            }
    	            if (address[p].types.indexOf("route") != -1) {
    	            	route = address[p].long_name;
    	            }
    	            if (address[p].types.indexOf("administrative_area_level_2") != -1) {
    	            	province = address[p].short_name;
    	            }
    	            
    	        }
    	        
    	        returnArray.push({
    	    	    "zipCode" : postalCode,
    	    	    "suggestedAddress" : results[i].formatted_address,
    	    	    "route" : route,
    	    	    "province" : province
    	    	});
           }
    	   return returnArray;

    }
    return "";
}

function main()
{
    var s = new XML(config.script);
    var defaultLocation = parseInt(s.defaultLoc, 8); // London by default
    var addrQuery = (args.query != null) ? args.query : defaultLocation,
    locQuery = (args.city != null) ? args.city : defaultLocation;
    var forecastUrl = s.forecastURL.toString().replace("{addr}", encodeURIComponent(addrQuery) );
    forecastUrl = forecastUrl.toString().replace("{loc}", locQuery);
    //var observationsUrl = s.observationsURL.toString().replace("{loc}", locID);
    
    var connector = remote.connect("http");
    var forecastResult = connector.get(forecastUrl);
    
    
    if (forecastResult.status == 200)
    {
        var jsonResponse = eval('(' + forecastResult.response + ')');
        var places = jsonResponse.results;
    
    	return jsonUtils.toJSONString(getZipCode(places,jsonResponse.status));
           }
    
}

model.json = main();
