<import resource="classpath:/alfresco/templates/org/alfresco/import/alfresco-util.js">

/**
 * Search component GET method
 */
function main()
{
   // fetch the request params required by the search component template
   var siteId = (page.url.templateArgs["site"] != null) ? page.url.templateArgs["site"] : "protocollo";
   var siteTitle = null;
   if (siteId.length != 0)
   {
      // Call the repository for the site profile
      var json = remote.call("/api/sites/" + siteId);
      if (json.status == 200)
      {
         // Create javascript objects from the repo response
         var obj = eval('(' + json + ')');
         if (obj)
         {
            siteTitle = (obj.title.length != 0) ? obj.title : obj.shortName;
         }
      }
   }
   
   // get the search sorting fields from the config
   var sortables = config.scoped["Search"]["sorting"].childrenMap["sort"];
   var sortFields = [];
   for (var i = 0, sort, label; i < sortables.size(); i++)
   {
      sort = sortables.get(i);
      
      // resolve label text
      label = sort.attributes["label"];
      if (label == null)
      {
         label = sort.attributes["labelId"];
         if (label != null)
         {
            label = msg.get(label);
         }
      }
      
      // create the model object to represent the sort field definition
      sortFields.push(
      {
         type: sort.value,
         label: label ? label : sort.value
      });
   }
   
   // Prepare the model
   var repoconfig = config.scoped['Search']['search'].getChildValue('repository-search');
   model.siteId = siteId;
   model.siteTitle = (siteTitle != null ? siteTitle : "");
   model.sortFields = sortFields;
   model.searchTerm = (page.url.args["t"] != null) ? page.url.args["t"] : "";
   model.searchTag = (page.url.args["tag"] != null) ? page.url.args["tag"] : "";
   model.searchSort = (page.url.args["s"] != null) ? page.url.args["s"] : "";
   // config override can force repository search on/off
   model.searchRepo = ((page.url.args["r"] == "true") || repoconfig == "always") && repoconfig != "none";
   model.searchAllSites = (page.url.args["a"] == "true" || siteId.length == 0);
   
   // Advanced search forms based json query
   model.searchQuery = (page.url.args["q"] != null) ? page.url.args["q"] : "";
   
   // Widget instantiation metadata...
   var searchConfig = config.scoped['Search']['search'],
       defaultMinSearchTermLength = searchConfig.getChildValue('min-search-term-length'),
       defaultMaxSearchResults = searchConfig.getChildValue('max-search-results');

   var search = {
      id : "Search", 
      name : "Alfresco.Search",
      options : {
         siteId : model.siteId,
         siteTitle : model.siteTitle,
         initialSearchTerm : model.searchTerm,
         initialSearchTag : model.searchTag,
         initialSearchAllSites : model.searchAllSites,
         initialSearchRepository : model.searchRepo,
         initialSort : model.searchSort,
         searchQuery : model.searchQuery,
         searchRootNode : config.scoped['RepositoryLibrary']['root-node'].value,
         minSearchTermLength : parseInt((args.minSearchTermLength != null) ? args.minSearchTermLength : defaultMinSearchTermLength),
         maxSearchResults : parseInt((args.maxSearchResults != null) ? args.maxSearchResults : defaultMaxSearchResults)
      }
   };
   model.widgets = [search];
   
// Call the repository to see user role
   
   var userRole = null,
   	    isAuthorized = false;
 // var responseMembership = AlfrescoUtil.getSiteMembership(page.url.templateArgs.site) ;
   var isMember= false,
      isManager= false,
      role= "";
/*
   var json = remote.call("/api/sites/" + encodeURIComponent(siteId) + "/memberships/" + encodeURIComponent(user.name));
   if (json.status == 200)
   {
      var response = eval('(' + json + ')');
      if (response)
      {
          	isMember= true;
            isManager= response.role == "SiteManager";
            role= response.role;
      }
   }

   
   if (logger.isLoggingEnabled()){
	    logger.warn("Ruolo nel protocollo" + role + " sito: ");
	}
   if (role) {
	   userRole = role;
	   if (userRole == "SiteCollaborator" || userRole == "SiteManager" || user.isAdmin){
		   isAuthorized  = true;
	   }   
   }
   */
   model.userRole = userRole; 
   model.isAuthorized = isAuthorized;

   
}

main();


