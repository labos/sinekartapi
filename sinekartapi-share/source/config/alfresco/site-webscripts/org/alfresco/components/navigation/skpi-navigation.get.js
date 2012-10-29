<import resource="classpath:alfresco/templates/org/alfresco/import/alfresco-util.js">
<import resource="classpath:alfresco/templates/org/alfresco/valid-user-site-access.lib.js">

/**
 * Share Collaboration Site Navigation component GET method
 */

// set model properties
model.pages = AlfrescoUtil.getPages();
model.siteExists = model.pages != null;
model.siteValid = isValidUserOrSite();

var name = "protocollo";
model.destination = remote.call("/it/tlogic/sinekartapi/protocols-adress/" + name);