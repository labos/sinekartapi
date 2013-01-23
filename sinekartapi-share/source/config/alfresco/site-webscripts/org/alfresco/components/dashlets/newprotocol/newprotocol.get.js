<import resource="classpath:/alfresco/templates/org/alfresco/import/alfresco-util.js">
//check for unauthorized user
var userRole = AlfrescoUtil.getSiteMembership(page.url.templateArgs.site).role ;
if (logger.isLoggingEnabled()){
    logger.warn("Ruolo nel protocollo" + userRole + " sito: " + page.url.templateArgs.site + " membro: " +AlfrescoUtil.getSiteMembership(page.url.templateArgs.site).role);
}
     if (userRole && userRole == "SiteConsumer") {
                status.code = 404;
                status.message = msg.get("message.protocolNotAuthorized");
                status.redirect = true;
        }
var name = "protocollo";
model.user = name;
var destination = remote.call("/it/tlogic/sinekartapi/protocols-adress/" + name);

model.destination = destination;
