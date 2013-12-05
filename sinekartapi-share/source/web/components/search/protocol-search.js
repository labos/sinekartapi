/**
 * Copyright (C) 2005-2012 Alfresco Software Limited.
 *
 * This file is part of Alfresco
 *
 * Alfresco is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Lesser General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Alfresco is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public License
 * along with Alfresco. If not, see <http://www.gnu.org/licenses/>.
 */

/**
 * Search component.
 * 
 * @namespace Alfresco
 * @class Alfresco.Search
 */
(function()
{
   /**
    * YUI Library aliases
    */
   var Dom = YAHOO.util.Dom,
       Event = YAHOO.util.Event;

   /**
    * Alfresco Slingshot aliases
    */
   var $html = Alfresco.util.encodeHTML;

   /**
    * Search constructor.
    * 
    * @param {String} htmlId The HTML id of the parent element
    * @return {Alfresco.Search} The new Search instance
    * @constructor
    */
   Alfresco.Search = function(htmlId)
   {
      Alfresco.Search.superclass.constructor.call(this, "Alfresco.Search", htmlId, ["button", "container", "datasource", "datatable", "paginator", "json"]);
      
      // Decoupled event listeners
      YAHOO.Bubbling.on("onSearch", this.onSearch, this);
      
      return this;
   };
   
   YAHOO.extend(Alfresco.Search, Alfresco.component.SearchBase,
   {
      /**
       * Object container for initialization options
       *
       * @property options
       * @type object
       */
      options:
      {
         /**
          * Current siteId
          * 
          * @property siteId
          * @type string
          */
         siteId: "",
         
         /**
          * Current site title
          * 
          * @property siteTitle
          * @type string
          */
         siteTitle: "",
         
         /**
          * Maximum number of results displayed.
          * 
          * @property maxSearchResults
          * @type int
          * @default 250
          */
         maxSearchResults: 250,
         
         /**
          * Results page size.
          * 
          * @property pageSize
          * @type int
          * @default 50
          */
         pageSize: 25,
         
         /**
          * Search term to use for the initial search
          * @property initialSearchTerm
          * @type string
          * @default ""
          */
         initialSearchTerm: "",
         
         /**
          * Search tag to use for the initial search
          * @property initialSearchTag
          * @type string
          * @default ""
          */
         initialSearchTag: "",
         
         /**
          * States whether all sites should be searched.
          * 
          * @property initialSearchAllSites
          * @type boolean
          */
         initialSearchAllSites: true,
         
         /**
          * States whether repository should be searched.
          * This is in preference to current or all sites.
          * 
          * @property initialSearchRepository
          * @type boolean
          */
         initialSearchRepository: false,
         
         /**
          * Sort property to use for the initial search.
          * Empty default value will use score relevance default.
          * @property initialSort
          * @type string
          * @default ""
          */
         initialSort: "",
         
         /**
          * Advanced Search query - forms data json format based search.
          * @property searchQuery
          * @type string
          * @default ""
          */
         searchQuery: "",
         
         /**
          * Search root node.
          * @property searchRootNode
          * @type string
          * @default ""
          */
         searchRootNode: "",
         
         /**
          * Number of characters required for a search.
          *
          * @property minSearchTermLength
          * @type int
          * @default 1
          */
         minSearchTermLength: 1
      },
      
      /**
       * Search term used for the last search.
       */
      searchTerm: "",
      
      /**
       * Search tag used for the last search.
       */
      searchTag: "",
      
      /**
       * Whether the search was over all sites or just the current one
       */
      searchAllSites: true,
      
      /**
       * Whether the search is over the entire repository - in preference to site or all sites
       */
      searchRepository: false,
      
      /**
       * Search sort used for the last search.
       */
      searchSort: "",
      
      /**
       * Number of search results.
       */
      resultsCount: 0,
      
      /**
       * Current visible page index - counts from 1
       */
      currentPage: 1,
      
      /**
       * True if there are more results than the ones listed in the table.
       */
      hasMoreResults: false,
      
      /**
       * Fired by YUI when parent element is available for scripting.
       * Component initialisation, including instantiation of YUI widgets and event listener binding.
       *
       * @method onReady
       */
      onReady: function Search_onReady()
      {
         var me = this;
         
         // DataSource definition
         var uriSearchResults = Alfresco.constants.PROXY_URI_RELATIVE + "slingshot/search?";
         this.widgets.dataSource = new YAHOO.util.DataSource(uriSearchResults,
         {
            responseType: YAHOO.util.DataSource.TYPE_JSON,
            connXhrMode: "queueRequests",
            responseSchema:
            {
                resultsList: "items"
            }
         });
         
         // YUI Paginator definition
         var handlePagination = function Search_handlePagination(state, me)
         {
            me.currentPage = state.page;
            me.widgets.paginator.setState(state);
         };
         this.widgets.paginator = new YAHOO.widget.Paginator(
         {
            containers: [this.id + "-paginator-top", this.id + "-paginator-bottom"],
            rowsPerPage: this.options.pageSize,
            initialPage: 1,
            template: this.msg("pagination.template"),
            pageReportTemplate: this.msg("pagination.template.page-report"),
            previousPageLinkLabel: this.msg("pagination.previousPageLinkLabel"),
            nextPageLinkLabel: this.msg("pagination.nextPageLinkLabel")
         });
         this.widgets.paginator.subscribe("changeRequest", handlePagination, this);
         
         // setup of the datatable.
         this._setupDataTable();
         
         // set initial value and register the "enter" event on the search text field
         var queryInput = Dom.get(this.id + "-search-text");
         
         if( queryInput)
         {
         queryInput.value = this.options.initialSearchTerm;
         
         this.widgets.enterListener = new YAHOO.util.KeyListener(queryInput, 
         {
            keys: YAHOO.util.KeyListener.KEY.ENTER
         }, 
         {
            fn: me._searchEnterHandler,
            scope: this,
            correctScope: true
         }, "keydown").enable();
         
    
         
         // search YUI button
         this.widgets.searchButton = Alfresco.util.createYUIButton(this, "search-button", this.onSearchClick);
         
         // toggle site scope links
         var toggleLink = Dom.get(this.id + "-site-link");
         Event.addListener(toggleLink, "click", this.onSiteSearch, this, true);
         toggleLink = Dom.get(this.id + "-all-sites-link");
         Event.addListener(toggleLink, "click", this.onAllSiteSearch, this, true);
         toggleLink = Dom.get(this.id + "-repo-link");
         Event.addListener(toggleLink, "click", this.onRepositorySearch, this, true);
      }
         
         // trigger the initial search
         YAHOO.Bubbling.fire("onSearch",
         {
            searchTerm: this.options.initialSearchTerm,
            searchTag: this.options.initialSearchTag,
            searchSort: this.options.initialSort,
            searchAllSites: this.options.initialSearchAllSites,
            searchRepository: this.options.initialSearchRepository
         });
         

         
         
         
         // menu button for sort options
         this.widgets.sortButton = new YAHOO.widget.Button(this.id + "-sort-menubutton",
         {
            type: "menu", 
            menu: this.id + "-sort-menu",
            menualignment: ["tr", "br"],
            lazyloadmenu: false
         });
         // set initially selected sort button label
         var menuItems = this.widgets.sortButton.getMenu().getItems();
         for (var m in menuItems)
         {
            if (menuItems[m].value === this.options.initialSort)
            {
               this.widgets.sortButton.set("label", this.msg("label.sortby", menuItems[m].cfg.getProperty("text")));
               break;
            }
         }
         // event handler for sort menu
         this.widgets.sortButton.getMenu().subscribe("click", function(p_sType, p_aArgs)
         {
            var menuItem = p_aArgs[1];
            if (menuItem)
            {
               me.refreshSearch(
               {
                  searchSort: menuItem.value
               });
            }
         });
         
         // Hook action events
         var fnActionHandler = function Search_fnActionHandler(layer, args)
         {
            var owner = YAHOO.Bubbling.getOwnerByTagName(args[1].anchor, "span");
            if (owner !== null)
            {
               if (typeof me[owner.className] == "function")
               {
                  args[1].stop = true;
                  var tagId = owner.id.substring(me.id.length + 1);
                  me[owner.className].call(me, tagId);
               }
            }
            return true;
         };
         
         // Hook action events
         var fnActionHandlerProtocol = function Search_fnActionHandlerProtocol(layer, args)
         {
        	 var owner = YAHOO.Bubbling.getOwnerByTagName(args[1].anchor, "span");
            var nodeDomProtocol = args[1].anchor;
            if (owner !== null)
            {
               if (typeof me[owner.className] == "function")
               {
                  args[1].stop = true;
                  YAHOO.util.Event.preventDefault(args[1].event);
             
                  var nodeRefId = nodeDomProtocol.href;
                  me[owner.className].call(me, nodeRefId);
               }
            }
            return false;
         };
         YAHOO.Bubbling.addDefaultAction("search-tag", fnActionHandler);
         //add an download protocol file action
         YAHOO.Bubbling.addDefaultAction("print-protocol", fnActionHandlerProtocol);
         
         // Finally show the component body here to prevent UI artifacts on YUI button decoration
         Dom.setStyle(this.id + "-body", "visibility", "visible");
      },
      
      _setupDataTable: function Search_setupDataTable()
      {
         /**
          * DataTable Cell Renderers
          *
          * Each cell has a custom renderer defined as a custom function. See YUI documentation for details.
          * These MUST be inline in order to have access to the Alfresco.Search class (via the "me" variable).
          */
         var me = this;
         
         /**
          * Thumbnail custom datacell formatter
          *
          * @method renderCellThumbnail
          * @param elCell {object}
          * @param oRecord {object}
          * @param oColumn {object}
          * @param oData {object|string}
          */
         renderCellThumbnail = function Search_renderCellThumbnail(elCell, oRecord, oColumn, oData)
         {
            oColumn.width = 100;
            Dom.setStyle(elCell.parentNode, "width", oColumn.width + "px");
            Dom.setStyle(elCell.parentNode, "background-color", "#f4f4f4");
            Dom.addClass(elCell, "thumbnail-cell");
            if (oRecord.getData("type") === "document")
            {
               Dom.addClass(elCell, "thumbnail");
            }
            
            elCell.innerHTML = me.buildThumbnailHtml(oRecord);
         };

         /**
          * Description/detail custom cell formatter
          *
          * @method renderCellDescription
          * @param elCell {object}
          * @param oRecord {object}
          * @param oColumn {object}
          * @param oData {object|string}
          */
         renderCellDescription = function Search_renderCellDescription(elCell, oRecord, oColumn, oData)
         {
            // apply class to the appropriate TD cell
            Dom.addClass(elCell.parentNode, "description");
            // set background color based on protocol type
            if( oRecord.getData("skpi_tipo") ==  "Uscita" ){
                Dom.addClass(elCell, "row-search-outcoming");	
            }

            // site and repository items render with different information available
            var site = oRecord.getData("site");
            var url = me._getBrowseUrlForRecord(oRecord);
            
            // displayname and link to details page
            var subjectName = oRecord.getData("skpi_oggetto");
            var desc = '<h3 class="itemname"><a target="_blank" href="' + url + '" class="theme-color-1">' + $html(subjectName) + '';
   
            if (oRecord.getData("skpi_oggetto"))
            {
               desc += ' <span class="meta">' + '- ';
               desc += $html(oRecord.getData("displayName"))  + '</span> ';
            }
            
            desc += '</a></h3>';
            
            // description (if any)
            var txt = oRecord.getData("description");
            if (txt)
            {
               desc += '<div class="details meta">' + $html(txt) + '</div>';
            }
            
            // detailed information, includes site etc. type specific
            desc += '<div class="details">';
            
      

            if (oRecord.getData("skpi_mittente"))
            {
               desc += ' | ' + me.msg("message.mittente") + ': ';
               desc += '<strong>' + $html(oRecord.getData("skpi_mittente")) + '</strong>';
            }
            if (oRecord.getData("skpi_destinatario"))
            {
               desc += ' | ' + me.msg("message.destinatario") + ': ';
               desc += '<strong>' + $html(oRecord.getData("skpi_destinatario")) + '</strong>';
            }
    
            if (oRecord.getData("skpi_arrival_date"))
            {
               desc += ' | ' + me.msg("message.arrivalDate") + ': ';
               desc += '<strong>' + $html(oRecord.getData("skpi_arrival_date"))  + '</strong>';
            }
            desc += ' | ' + me.msg("message.modifiedon") + ' <span class="meta">' + Alfresco.util.formatDate(oRecord.getData("modifiedOn")) + '</span>';
           
            if (oRecord.getData("modifiedBy"))
            {
               desc += ' ' + me.msg("message.employee") + ': ';
               desc += '<strong>' + ' <a href="' + Alfresco.constants.URL_PAGECONTEXT + 'user/' + encodeURI(oRecord.getData("modifiedByUser")) + '/profile">' + $html(oRecord.getData("modifiedBy")) + '</a>'+ '</strong>';
            }
            
            desc += '</div>';
            
            
            // categories (if any)
            var cats = oRecord.getData("categories");
            if (cats.length !== 0)
            {
               var i, j;
               desc += '<div class="details"><span class="tags">Ufficio: ';
               for (i = 0, j = cats.length; i < j; i++)
               {
                   desc += '<span class="searchByTag">' + $html(cats[i]) + ' </span>';
               }
               desc += '</span></div>';
            }
            
            
            // tags (if any)
            var tags = oRecord.getData("tags");
            if (tags.length !== 0)
            {
               var i, j;
               desc += '<div class="details"><span class="tags">' + me.msg("label.tags") + ': ';
               for (i = 0, j = tags.length; i < j; i++)
               {
                   desc += '<span id="' + me.id + '-' + $html(tags[i]) + '" class="searchByTag"><a class="search-tag" href="#">' + $html(tags[i]) + '</a> </span>';
               }
               desc += '</span></div>';
            }

            if (oRecord.getData("skpi_oggetto") && !oRecord.getData("skpi_annullato"))
            {
            	var protocolIconType = ( oRecord.getData("skpi_tipo") ==  "Entrata" )? "protocol-incoming" : "protocol-exit";
            	
             
               desc += '<div class="details">';
               desc += '<span class="' + protocolIconType + '"></span>';
               desc += '<span class="printProtocol"><a class="print-protocol"  href="' + oRecord.getData("nodeRef") +'">Stampa protocollato</a> </span>';

               
               desc += '</div>';
            }
            
            elCell.innerHTML = desc;
         };

         // DataTable column defintions
         var columnDefinitions = [
         {
            key: "image", label: me.msg("message.preview"), sortable: false, formatter: renderCellThumbnail, width: 100
         },
         {
            key: "summary", label: me.msg("label.description"), sortable: false, formatter: renderCellDescription
         }];

         // DataTable definition
         this.widgets.dataTable = new YAHOO.widget.DataTable(this.id + "-results", columnDefinitions, this.widgets.dataSource,
         {
            renderLoopSize: Alfresco.util.RENDERLOOPSIZE,
            initialLoad: false,
            paginator: this.widgets.paginator,
            MSG_LOADING: ""
         });

         // show initial message
         this._setDefaultDataTableErrors(this.widgets.dataTable);
         if (this.options.initialSearchTerm.length === 0 && this.options.initialSearchTag.length === 0)
         {
            this.widgets.dataTable.set("MSG_EMPTY", "");
         }
         
         // Override abstract function within DataTable to set custom error message
         this.widgets.dataTable.doBeforeLoadData = function Search_doBeforeLoadData(sRequest, oResponse, oPayload)
         {
            if (oResponse.error)
            {
               try
               {
                  var response = YAHOO.lang.JSON.parse(oResponse.responseText);
                  me.widgets.dataTable.set("MSG_ERROR", response.message);
               }
               catch(e)
               {
                  me._setDefaultDataTableErrors(me.widgets.dataTable);
               }
            }
            else if (oResponse.results)
            {
               // clear the empty error message
               me.widgets.dataTable.set("MSG_EMPTY", "");
               
               // update the results count, update hasMoreResults.
               me.hasMoreResults = (oResponse.results.length > me.options.maxSearchResults);
               if (me.hasMoreResults)
               {
                  oResponse.results = oResponse.results.slice(0, me.options.maxSearchResults);
                  me.resultsCount = me.options.maxSearchResults;
               }
               else
               {
                  me.resultsCount = oResponse.results.length;
               }
               
               if (me.resultsCount > me.options.pageSize)
               {
                  Dom.removeClass(me.id + "-paginator-top", "hidden");
                  Dom.removeClass(me.id + "-search-bar-bottom", "hidden");
               }
               
               // display help text if no results were found
               if (me.resultsCount === 0)
               {
                  Dom.removeClass(me.id + "-help", "hidden");
               }
            }
            // Must return true to have the "Loading..." message replaced by the error message
            return true;
         };
         
         // Rendering complete event handler
         me.widgets.dataTable.subscribe("renderEvent", function()
         {
            // Update the paginator
            me.widgets.paginator.setState(
            {
               page: me.currentPage,
               totalRecords: me.resultsCount
            });
            me.widgets.paginator.render();
         });
      },

      /**
       * Constructs the completed browse url for a record.
       * @param record {string} the record
       */
      _getBrowseUrlForRecord: function Search__getBrowseUrlForRecord(record)
      {
        return this.getBrowseUrlForRecord(record);
      },
      
      /**
       * Constructs the folder url for a record.
       * @param path {string} folder path
       *        For a site relative item this can be empty (root of doclib) or any path - without a leading slash
       *        For a repository item, this can never be empty - but will contain leading slash and Company Home root
       */
      _getBrowseUrlForFolderPath: function Search__getBrowseUrlForFolderPath(path, site)
      {
        return this.getBrowseUrlForFolderPath(path, site);
      },
      
      _buildSpaceNamePath: function Search__buildSpaceNamePath(pathParts, name)
      {
        return this.buildSpaceNamePath(pathParts, name);
      },

      /**
       * DEFAULT ACTION EVENT HANDLERS
       * Handlers for standard events fired from YUI widgets, e.g. "click"
       */

      /**
       * Perform a search for a given tag
       * The tag is simply handled as search term
       */
      searchByTag: function Search_searchTag(param)
      {
         this.refreshSearch(
         {
            searchTag: param,
            searchTerm: "",
            searchQuery: ""
         });
      },
      
      /**
       * DEFAULT ACTION EVENT HANDLERS
       * Handlers for standard events fired from YUI widgets, e.g. "click"
       */

      /**
       * Perform a protocol download
       * The tag is simply handled as search term
       */
      printProtocol: function Search_printProtocol(paramNodeRef)
      {
    	  
    	  var nodeRefProtocol = new Alfresco.util.NodeRef(paramNodeRef);
  		var protocolToPrintMap = {"message": this.msg("message.company"), "nodeRef":  nodeRefProtocol.nodeRef} ;

      	Alfresco.util.Ajax.request(
    			{
    				url: Alfresco.constants.PROXY_URI + "it/tlogic/sinekartapi/download-file-watermarked",
    				method: "post",
    				requestContentType: Alfresco.util.Ajax.JSON,
					dataObj : protocolToPrintMap,
    				successCallback: {
    	                   fn: function dlA_onActionDetails_success(obj) {

    	      				 if(obj.json.result && obj.json.result!='' && obj.json.result!='0' && obj.json.response!=''){
    	    					 
    	      					window.open(Alfresco.constants.PROXY_URI + "api/node/content" + obj.json.response.replace("/d/a/", "/")  + '.pdf');}
    	      					 else{  
    	      						 Alfresco.util.PopupManager.displayMessage(
    	      	                     {
    	      	                        text: this.msg("message.printWithWatermark.failure")
    	      	                     });

    	      	} 
    						},
    	        			scope: this
    				},
    				
    				failureCallback:
    					{
    						fn: function dlA_onActionDetails_failure(response) {
    	                		var msgResult = response.json.message;
    	                		Alfresco.util.PopupManager.displayMessage(
    	                        	{
    	                            	text: me.msg("message.scheduleError")
    	                            });
    	        		},
    	        	scope: this
    			}

    		});
    	  
      },
      
      /**
       * Refresh the search page by full URL refresh
       *
       * @method refreshSearch
       * @param args {object} search args
       */
      refreshSearch: function Search_refreshSearch(args)
      {
         var searchTerm = this.searchTerm;
         if (args.searchTerm !== undefined)
         {
            searchTerm = args.searchTerm;
         }
         var searchTag = this.searchTag;
         if (args.searchTag !== undefined)
         {
            searchTag = args.searchTag;
         }
         var searchAllSites = this.searchAllSites;
         if (args.searchAllSites !== undefined)
         {
            searchAllSites = args.searchAllSites;
         }
         var searchRepository = this.searchRepository;
         if (args.searchRepository !== undefined)
         {
            searchRepository = args.searchRepository;
         }
         var searchSort = this.searchSort;
         if (args.searchSort !== undefined)
         {
            searchSort = args.searchSort;
         }
         var searchQuery = this.options.searchQuery;
         if (args.searchQuery !== undefined)
         {
            searchQuery = args.searchQuery;
         }
         
         // redirect back to the search page - with appropriate site context
         var url = Alfresco.constants.URL_PAGECONTEXT;
         if (this.options.siteId.length !== 0)
         {
            url += "site/" + this.options.siteId + "/";
         }
         
         // add search data webscript arguments
         url += "search?t=" + encodeURIComponent(searchTerm);
         if (searchSort.length !== 0)
         {
            url += "&s=" + searchSort;
         }
         if (searchQuery.length !== 0)
         {
            // if we have a query (already encoded), then apply it
            // most other options such as tag, terms are trumped
            url += "&q=" + searchQuery;
         }
         else if (searchTag.length !== 0)
         {
            url += "&tag=" + encodeURIComponent(searchTag);
         }
         url += "&a=" + searchAllSites + "&r=" + searchRepository;
         window.location = url;
      },

      /**
       * BUBBLING LIBRARY EVENT HANDLERS FOR PAGE EVENTS
       * Disconnected event handlers for inter-component event notification
       */

      /**
       * Execute Search event handler
       *
       * @method onSearch
       * @param layer {object} Event fired
       * @param args {array} Event parameters (depends on event type)
       */
      onSearch: function Search_onSearch(layer, args)
      {
         var obj = args[1];
         if (obj !== null)
         {
            var searchTerm = this.searchTerm;
            if (obj.searchTerm !== undefined)
            {
               searchTerm = obj.searchTerm;
            }
            var searchTag = this.searchTag;
            if (obj.searchTag !== undefined)
            {
               searchTag = obj.searchTag;
            }
            var searchAllSites = this.searchAllSites;
            if (obj.searchAllSites !== undefined)
            {
               searchAllSites = obj.searchAllSites;
            }
            var searchRepository = this.searchRepository;
            if (obj.searchRepository !== undefined)
            {
               searchRepository = obj.searchRepository;
            }
            var searchSort = this.searchSort;
            if (obj.searchSort !== undefined)
            {
               searchSort = obj.searchSort;
            }
            this._performSearch(
            {
               searchTerm: searchTerm,
               searchTag: searchTag,
               searchAllSites: searchAllSites,
               searchRepository: searchRepository,
               searchSort: searchSort
            });
         }
      },
      
      /**
       * Event handler that gets fired when user clicks the Search button.
       *
       * @method onSearchClick
       * @param e {object} DomEvent
       * @param obj {object} Object passed back from addListener method
       */
      onSearchClick: function Search_onSearchClick(e, obj)
      {
         this.refreshSearch(
         {
            searchTag: "",
            searchTerm: YAHOO.lang.trim(Dom.get(this.id + "-search-text").value),
            searchQuery: ""
         });
      },
      
      /**
       * Click event for Current Site search link
       * 
       * @method onSiteSearch
       */
      onSiteSearch: function Search_onSiteSearch(e, args)
      {
         this.refreshSearch(
         {
            searchAllSites: false,
            searchRepository: false
         });
      },
      
      /**
       * Click event for All Sites search link
       * 
       * @method onAllSiteSearch
       */
      onAllSiteSearch: function Search_onAllSiteSearch(e, args)
      {
         this.refreshSearch(
         {
            searchAllSites: true,
            searchRepository: false
         });
      },
      
      /**
       * Click event for Repository search link
       * 
       * @method onRepositorySearch
       */
      onRepositorySearch: function Search_onRepositorySearch(e, args)
      {
         this.refreshSearch(
         {
            searchRepository: true
         });
      },

      /**
       * Search text box ENTER key event handler
       * 
       * @method _searchEnterHandler
       */
      _searchEnterHandler: function Search__searchEnterHandler(e, args)
      {
         this.refreshSearch(
         {
            searchTag: "",
            searchTerm: YAHOO.lang.trim(Dom.get(this.id + "-search-text").value),
            searchQuery: ""
         });
      },
      
      /**
       * Updates search results list by calling data webscript with current site and query term
       *
       * @method _performSearch
       * @param args {object} search args
       */
      _performSearch: function Search__performSearch(args)
      {
         var searchTerm = YAHOO.lang.trim(args.searchTerm),
             searchTag = YAHOO.lang.trim(args.searchTag),
             searchAllSites = args.searchAllSites,
             searchRepository = args.searchRepository,
             searchSort = args.searchSort;
         
         if (this.options.searchQuery.length === 0 &&
             searchTag.length === 0 &&
             searchTerm.replace(/\*/g, "").length < this.options.minSearchTermLength)
         {
            Alfresco.util.PopupManager.displayMessage(
            {
               text: this.msg("message.minimum-length", this.options.minSearchTermLength)
            });
            return;
         }
         
         // empty results table
         this.widgets.dataTable.deleteRows(0, this.widgets.dataTable.getRecordSet().getLength());
         
         // update the ui to show that a search is on-going
         this.widgets.dataTable.set("MSG_EMPTY", "");
         this.widgets.dataTable.render();
         
         // Success handler
         function successHandler(sRequest, oResponse, oPayload)
         {
            // update current state on success
            this.searchTerm = searchTerm;
            this.searchTag = searchTag;
            this.searchAllSites = searchAllSites;
            this.searchRepository = searchRepository;
            this.searchSort = searchSort;
            
            this.widgets.dataTable.onDataReturnInitializeTable.call(this.widgets.dataTable, sRequest, oResponse, oPayload);
            
            // update the results info text
            this._updateResultsInfo();
            var me = this;
            var protocolsFound = [],
            	menuButtonSchedule = Dom.get(this.id + "-schedule-menubutton");
            // if schedule button is present then setup a schedule request
           if ( !menuButtonSchedule ) {
        	   return;
           }
           
            // menu button for sort options
            this.widgets.scheduleButton = new YAHOO.widget.Button(this.id + "-schedule-menubutton",
            {
               type: "menu", 
               menu: this.id + "-schedule-menu",
               menualignment: ["tr", "br"],
               lazyloadmenu: false
            });
            // set initially selected sort button label
            var menuItems = this.widgets.scheduleButton.getMenu().getItems();
            for (var m in menuItems)
            {
               if (menuItems[m].value === "zip")
               {
            	   this.widgets.scheduleButton.set("label", this.msg("label.schedule", menuItems[m].cfg.getProperty("text")));
                  break;
               }
            }
            // event handler for sort menu
            this.widgets.scheduleButton.getMenu().subscribe("click", function(p_sType, p_aArgs)
            {
               var menuItem = p_aArgs[1];
               if (menuItem)
               {
            	   
            	     if(menuItem.value === "zip"){
            	    	 YAHOO.util.Dom.setStyle("ajax-loader","visibility",'visible');

            	     //call massive download
                         var start = (me.currentPage - 1) * me.options.pageSize;
                         var end = me.currentPage * me.options.pageSize;
                         end = (end <= me.resultsCount) ? end : me.resultsCount;
                         protocolsFound = [];
                       	for (var i = start; i < end; i++) {          	
                        	protocolsFound.push(oResponse.results[i].nodeRef);
                        }

                     	Alfresco.util.Ajax.request(
                    			{
                    				url: Alfresco.constants.PROXY_URI + "/it/tlogic/sinekartapi/download-massive-files-watermarked",
                    				method: "post",
                    				requestContentType: Alfresco.util.Ajax.JSON,
                					dataObj : {"protocolsFound" : protocolsFound },
                    				successCallback: {
                    	                   fn: function dlA_onActionDetails_success(response) {
                    	                	   if(YAHOO.lang.isObject(response.json)  && response.json.response){
                       	                	   
                    	                        if(response.json.response.nodesToArchive) {
                    	                        	var downloadDialog = Alfresco.getArchiveAndDownloadInstance();
                    	               	    	 YAHOO.util.Dom.setStyle("ajax-loader","visibility",'hidden');                    	                        	downloadDialog.show( response.json.response );
                    	                        } 
                    	                	   }
            

                    						},
                    	        			scope: this
                    				},
                    				
                    				failureCallback:
                    					{
                    						fn: function dlA_onActionDetails_failure(response) {
                    	                		//var msgResult = response.json.message;
                   	               	    	 YAHOO.util.Dom.setStyle("ajax-loader","visibility",'hidden');                    	                        	downloadDialog.show( response.json.response );

                    	                		Alfresco.util.PopupManager.displayMessage(
                    	                        	{
                    	                            	text: me.msg("message.downloaMassiveError")
                    	                            });
                    	        		},
                    	        	scope: this
                    			}

                    		});
            	    	 
            	    	 
            	    	 
            	    	 
                   /*  	
                        var downloadDialog = Alfresco.getArchiveAndDownloadInstance(),
                        config = { nodesToArchive: [] };
                    
                    if (oResponse.results.length == 1)
                    {
                       config.nodesToArchive.push({"nodeRef": oResponse.results[0].nodeRef});
                       config.archiveName = oResponse.results[0].name;
                    }
                    else if(oResponse.results.length > 1)
                    {
   
                       
                   	for (var i = 0; i < oResponse.results.length; i++) { 
                   		config.nodesToArchive.push({"nodeRef": oResponse.results[i].nodeRef})
                     
                     }
                       
                    }
                    else{
                    	config.nodesToArchive = {};
                    }
              
                    if(config.nodesToArchive.length) {
                    	downloadDialog.show(config);
                    }
                     */
                     	
            	     }
            	     else if(menuItem.value === "send-results"){
            	    	 var searchResultsUrl = window.location.href;
            	    	 
            	         Alfresco.util.PopupManager.getUserInput({
            	              title: "Copia link di ricerca di protocollo",
            	              text: "Ecco il link che devi copiare (copia con tasto desto o Ctrl+c):",
            	              value: searchResultsUrl,
            	              callback:
            	              {
            	                  fn: function onClickOK(value, obj) {
            	   
            	                  },
            	                  scope: this
            	              }
            	          });

            	    	 


            	    	 
            	    	 
            	    	 // open email client
            	    	//window.location.href ='mailto:email@echoecho.com?body=' + 'Salve, vedi tutti i documenti del protocollo al seguente link:\n' +'&subject=Invio documenti protocollo';
            	     }
            	    	 
            	   
               else if(menuItem.value === "schedule"){
            	   protocolsFound = [];
                	for (var i = 0; i < oResponse.results.length; i++) {          	
                    	protocolsFound.push(oResponse.results[i].nodeRef);
                    }
                	
 

               	//pop up a dialog to filter protocols to print
                	/*
                	this.widgets.filterProtocolDialog = new Alfresco.module.SimpleDialog(this.id + "-configDialog").setOptions(
                	        {
                	        	width: "40em",
                	           actionUrl: Alfresco.constants.URL_SERVICECONTEXT + "modules/wiki/config/",
                	          destroyOnHide: true,
                	          
                	             onSuccess:
                	           {
                	            	 fn: function filterProtocolDialog_callback(e)
                                 {
                	            	    	// Update the content via the parser
                                         Dom.get(me.id + "-configDialog").innerHTML = "prova";
                                 }
                             
                	        
                	           },
                	           onFailure:
                	        	 {
                	        	    fn: function filterProtocolDialog_failure(response)
                	        	     {
                	        	       Alfresco.util.PopupManager.displayMessage(
                	        	         {
                	        	           text: me.msg("message.details.failure")
                	        	         });
                	        	         },
                	        	        scope: this
                	        	      }
                	        	    }).show();
   
                	*/
                	
                	 YAHOO.util.Dom.setStyle("ajax-loader","visibility",'visible');
                	Alfresco.util.Ajax.request(
                			{
                				url: Alfresco.constants.PROXY_URI + "it/tlogic/sinekartapi/schedule-journal",
                				method: "post",
                				requestContentType: Alfresco.util.Ajax.JSON,
            					dataObj : {"protocolsFound" : protocolsFound },
                				successCallback: {
                	                   fn: function dlA_onActionDetails_success(response) {
                	                	   YAHOO.util.Dom.setStyle("ajax-loader","visibility",'hidden');
                	       				window.open(Alfresco.constants.PROXY_URI + 'api/node/content/' + response.json.response.replace(":/", ""));
	
                	                	   		/*
                	                			var msgResult = response.json.message;
                				                Alfresco.util.PopupManager.displayMessage(
                	                                {
                	                                        text: msgResult
                	                                });
                				                */
                						},
                	        			scope: this
                				},
                				
                				failureCallback:
                					{
                						fn: function dlA_onActionDetails_failure(response) {
                	                		var msgResult = response.json.message;
                	                		 YAHOO.util.Dom.setStyle("ajax-loader","visibility",'hidden');
                	                		Alfresco.util.PopupManager.displayMessage(
                	                        	{
                	                            	text: me.msg("message.scheduleError")
                	                            });
                	        		},
                	        	scope: this
                			}

                		});
                	
                	
                	
                	
                	            	                  
                }
                else if(menuItem.value === "daily"){
                	Alfresco.util.Ajax.request(
                			{
                				url: Alfresco.constants.PROXY_URI + "it/tlogic/sinekartapi/protocol-journal/A01",
                				method: "post",
                				successCallback: {
                	                   fn: function dlA_onActionDetails_success(response) {
                	                         

                				                // Display success message
                	                			var msgResult = response.json.message;
                				                Alfresco.util.PopupManager.displayMessage(
                	                                {
                	                                        text: msgResult
                	                                });
                						},
                	        			scope: this
                				},
                				
                				failureCallback:
                					{
                						fn: function dlA_onActionDetails_failure(response) {
                	                		var msgResult = response.json.message;
                	                		Alfresco.util.PopupManager.displayMessage(
                	                        	{
                	                            	text: msgResult
                	                            });
                	        		},
                	        	scope: this
                			}

                		});       	
                	
                	
                }// end else if

                }
                	         });
                	
                	

                	
                 //   var a = document.createElement('a');
               //     Dom.insertAfter(a , Dom.get(this.id + '-search-info'));
                	
            
            // set focus to search input textbox
           // Dom.get(this.id + "-search-text").focus();
         }
         
         // Failure handler
         function failureHandler(sRequest, oResponse)
         {
            switch (oResponse.status)
            {
               case 401:
                  // Session has likely timed-out, so refresh to display login page
                  window.location.reload();
                  break;
               case 408:
                  // Timeout waiting on Alfresco server - probably due to heavy load
                  Dom.get(this.id + '-search-info').innerHTML = this.msg("message.timeout");
                  break;
               default:
                  // General server error code
                  if (oResponse.responseText)
                  {
                     var response = YAHOO.lang.JSON.parse(oResponse.responseText);
                     Dom.get(this.id + '-search-info').innerHTML = response.message;
                  }
                  else
                  {
                     Dom.get(this.id + '-search-info').innerHTML = oResponse.statusText;
                  }
                  break;
            }
         }
         
         this.widgets.dataSource.sendRequest(this._buildSearchParams(searchRepository, searchAllSites, searchTerm, searchTag, searchSort),
         {
            success: successHandler,
            failure: failureHandler,
            scope: this
         });
      },
      /**
       * Return current search url
       *
       * @method getSearchLink
       */
      getSearchLink: function Search_getSearchLink()
      {
         var searchTerm = this.searchTerm;

         var searchTag = this.searchTag;

         var searchAllSites = this.searchAllSites;

         var searchRepository = this.searchRepository;

         var searchSort = this.searchSort;

         var searchQuery = this.options.searchQuery;

         
         // redirect back to the search page - with appropriate site context
         var url = Alfresco.constants.URL_PAGECONTEXT;
         if (this.options.siteId.length !== 0)
         {
            url += "site/" + this.options.siteId + "/";
         }
         
         // add search data webscript arguments
         url += "search?t=" + encodeURIComponent(searchTerm);
         if (searchSort.length !== 0)
         {
            url += "&s=" + searchSort;
         }
         if (searchQuery.length !== 0)
         {
            // if we have a query (already encoded), then apply it
            // most other options such as tag, terms are trumped
            url += "&q=" + searchQuery;
         }
         else if (searchTag.length !== 0)
         {
            url += "&tag=" + encodeURIComponent(searchTag);
         }
         url += "&a=" + searchAllSites + "&r=" + searchRepository;
         return url;
      },
      
      /**
       * Updates the results info text.
       * 
       * @method _updateResultsInfo
       */
      _updateResultsInfo: function Search__updateResultsInfo()
      {
         // update the search results field
         var text;
         var resultsCount = '<b>' + this.resultsCount + '</b>';
         if (this.hasMoreResults)
         {
            text = this.msg("search.info.resultinfomore", resultsCount);
         }
         else
         {
            text = this.msg("search.info.resultinfo", resultsCount);
         }
         
         // apply the context
         if (this.searchRepository || this.options.searchQuery.length !== 0)
         {
            text += ' ' + this.msg("search.info.foundinrepository");
         }
         else if (this.searchAllSites)
         {
            text += ' ' + this.msg("search.info.foundinallsite");
         }
         else
         {
            text += ' ' + this.msg("search.info.foundinsite", $html(this.options.siteTitle));
         }
         
         // set the text
         Dom.get(this.id + '-search-info').innerHTML = text;
      },

      /**
       * Build URI parameter string for search JSON data webscript
       *
       * @method _buildSearchParams
       */
      _buildSearchParams: function Search__buildSearchParams(searchRepository, searchAllSites, searchTerm, searchTag, searchSort)
      {
         var site = searchAllSites ? "" : this.options.siteId;
         var params = YAHOO.lang.substitute("site={site}&term={term}&tag={tag}&maxResults={maxResults}&sort={sort}&query={query}&repo={repo}&rootNode={rootNode}",
         {
            site: encodeURIComponent(site),
            repo: searchRepository.toString(),
            term: encodeURIComponent(searchTerm),
            tag: encodeURIComponent(searchTag),
            sort: encodeURIComponent(searchSort),
            query: encodeURIComponent(this.options.searchQuery),
            rootNode: encodeURIComponent(this.options.searchRootNode),
            maxResults: this.options.maxSearchResults + 1 // to calculate whether more results were available
         });
         
         return params;
      },
      
      /**
       * Resets the YUI DataTable errors to our custom messages
       * NOTE: Scope could be YAHOO.widget.DataTable, so can't use "this"
       *
       * @method _setDefaultDataTableErrors
       * @param dataTable {object} Instance of the DataTable
       */
      _setDefaultDataTableErrors: function Search__setDefaultDataTableErrors(dataTable)
      {
         var msg = Alfresco.util.message;
         dataTable.set("MSG_EMPTY", msg("message.empty", "Alfresco.Search"));
         dataTable.set("MSG_ERROR", msg("message.error", "Alfresco.Search"));
      }
   });
})();