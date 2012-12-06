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
    	        for (p = address.length-1; p >= 0; p--) {
    	            if (address[p].types.indexOf("postal_code") != -1) {
    	                //console.log(address[p].long_name);
    	            	postalCode = address[p].long_name;
    	            }
    	            if (address[p].types.indexOf("route") != -1) {
    	            	route = address[p].long_name;
    	            }
    	        }
    	        
    	        returnArray.push({
    	    	    "zipCode" : postalCode,
    	    	    "suggestedAddress" : results[i].formatted_address,
    	    	    "route" : route
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
    //var obsResult = connector.get(observationsUrl);
    var forecastResult = connector.get(forecastUrl);
    
    
    if (forecastResult.status == 200)
    {
        var jsonResponse = eval('(' + forecastResult.response + ')');
        //var places = jsonResponse.ResultSet.results;
        var places = jsonResponse.results;
        /*
        for (var i = 0; i < places.length(); i++)
        {
        	for (var j = 0; i < places[i].length(); j++){
        		var addressComponent = places[i][j];
        		if(addressComponent.types["postal_code"]){
               	   var zipCode = addressComponent.types["postal_code"].toString();
             	   var cityName = places[i].city.toString();
             	   model.zipCode = zipCode;
             	   model.cityName = "";
        		}

        	}
        	model.addressSuggested = places[i].formatted_address;

     	   
        }
        */
        //model.zipCode = getZipCode(places,jsonResponse.status);
        //model.suggestedAddress = "";
        
    	return jsonUtils.toJSONString(getZipCode(places,jsonResponse.status));
        /*    
           // Parse the xml document
           var xmlResponse = new XML(rssXml);
           var geons = new Namespace('http://www.w3.org/2003/01/geo/wgs84_pos#');
           var places = jsonResponse.ResultSet.results;
           var fcItems = new Array(days.length());
           
           for (var i = 0; i < places.length(); i++)
           {
        	   var zipCode = places[i].uzip.toString();
        	   var cityName = places[i].city.toString();
        	   model.zipCode = zipCode;
        	   model.cityName = cityName;
        	   
           }
    */
           }
    
    
    
    /*
    if (obsResult.status == 200)
    {
        var rssXml = new String(obsResult.response);    
        var re = /<[r|R][s|S]{2}/; // Is this really an RSS document?
        if (re.test(rssXml))
        {
           // Strip out any preceding xml processing instructions or E4X will choke
           var idx = rssXml.search(re);
           rssXml = rssXml.substring(idx);
           
           // It looks we need to get rid of the trailing junk as well.
           if ( rssXml.indexOf('</rss>') != -1 ) {     
               rssXml = rssXml.substring(0,rssXml.indexOf('</rss>')+6);
           }
            
           // Parse the xml document
           var rss = new XML(rssXml);
           var items = rss.channel.item.description.toString().split(", ");
           
           var conditions = rss.channel.item.title.toString().split(": ")[1].split(".")[0];
           var temp = items[0].split(": ")[1];
           
           var geons = new Namespace('http://www.w3.org/2003/01/geo/wgs84_pos#');
           
           model.location = {
              "id": locID,
              "name": rss.channel.title.toString().split(" Latest Observations for ")[1],
               "observationsURL": rss.channel.item.link.toString(),
               "forecastURL": ""
           };
           
           model.observations = {
               "conditions": conditions,
               "temperature": formatTemperature(temp), // Temp in celcuis for now
               "windDir": items[1].split(": ")[1],
               "windSpeed": items[2].split(": ")[1],
               "humidity": items[3].split(": ")[1],
               "pressure": items[4].split(": ")[1],
               "pressureTrend": items[5],
               "visibility": items[6].split(": ")[1],
               "pubDate": new Date(rss.channel.pubDate.toString()),
               "lat": rss.channel.item.geons::["lat"].toString(),
               "lon": rss.channel.item.geons::["long"].toString()
           };
        }
       else
       {
           status.code = 500;
           status.message = "The observations page " + observationsUrl + " does not appear to be an RSS feed";
           status.redirect = true;
       }
    }
    else
    {
        status.code = 500;
        status.message = "An error occurred fetching the observations page " + observationsUrl + " (status code " + obsResult.status + ")";
        status.redirect = true;
    }
    
    if (forecastResult.status == 200)
    {
        var rssXml = new String(forecastResult.response);    
        var re = /<[r|R][s|S]{2}/; // Is this really an RSS document?
        if (re.test(rssXml))
        {
           // Strip out any preceding xml processing instructions or E4X will choke
           var idx = rssXml.search(re);
           rssXml = rssXml.substring(idx);
           
           // It looks we need to get rid of the trailing junk as well.
           if ( rssXml.indexOf('</rss>') != -1 ) {     
               rssXml = rssXml.substring(0,rssXml.indexOf('</rss>')+6);
           }
            
           // Parse the xml document
           var rss = new XML(rssXml);
           var geons = new Namespace('http://www.w3.org/2003/01/geo/wgs84_pos#');
           var days = rss.channel.item;
           var fcItems = new Array(days.length());
           
           for (var i = 0; i < days.length(); i++)
           {
              var titems = days[i].title.toString().split(", "); // conditions, max temp, min temp
              var ditems = days[i].description.toString().split(", "); // max temp, min temp, wind dir, wind speed, vis, press, humidity, UV risk, pollution, sunrise, sunset
              var conditions = titems[0].split(": ")[1], maxTemp = titems[1].split(": ")[1], minTemp = titems[2].split(": ")[1];
              var pubDate = new Date(rss.channel.pubDate.toString());
              var guidItem = days[i].guid.substring(days[i].guid.lastIndexOf("/") + 1);
              var itemDate = guidItem.substring(guidItem.indexOf(":") + 1, guidItem.indexOf("T"));
              
              var dobj = {};
              
              for (var j = 0; j < ditems.length; j++)
              {
                 var pair = ditems[j].split(": ");
                 dobj[pair[0]] = pair[1];
              }
              
              fcItems[i] =
                    {
                       "day": itemDate,
                       "conditions": conditions,
                       "maxTemp": formatTemperature(maxTemp),
                       "minTemp": formatTemperature(minTemp),
                       "windDir": dobj["Wind Direction"] ? dobj["Wind Direction"] : "",
                       "windSpeed": dobj["Wind Speed"] ? dobj["Wind Speed"] : "",
                       "humidity": dobj["Humidity"] ? dobj["Humidity"] : "",
                       "pressure": dobj["Pressure"] ? dobj["Pressure"] : "",
                       "visibility": dobj["Visibility"] ? dobj["Visibility"] : "",
                       "uvRisk": dobj["UV risk"] ? dobj["UV risk"] : "",
                       "pollution": dobj["Pollution"] ? dobj["Pollution"] : "",
                       "sunrise": dobj["Sunrise"] ? dobj["Sunrise"] : "",
                       "sunset": dobj["Sunset"] ? dobj["Sunset"] : ""
                    };
           }
           
           model.forecast = { "days" : fcItems, "pubDate" : pubDate };
        }
       else
       {
           status.code = 500;
           status.message = "The forecast page " + forecastUrl + " does not appear to be an RSS feed";
           status.redirect = true;
       }
    }
    else
    {
        status.code = 500;
        status.message = "An error occurred fetching the forecast page " + forecastUrl + " (status code " + forecastResult.status + ")";
        status.redirect = true;
    }
    
    */
    
}

model.json = main();
