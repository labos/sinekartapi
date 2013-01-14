<import resource="classpath:/alfresco/templates/org/alfresco/import/alfresco-util.js">
//check for unauthorized user
var userRole = AlfrescoUtil.getSiteMembership(model.site).role ;
if (logger.isLoggingEnabled()){
    logger.warn("Ruolo nel protocollo" + userRole);
}
     if (userRole && userRole == "SiteConsumer") {
                status.code = 404;
                status.message = "Not authorized";
                status.redirect = true;
        }
var name = "protocollo";
model.user = name;
var destination = remote.call("/it/tlogic/sinekartapi/protocols-adress/" + name);

model.destination = destination;
