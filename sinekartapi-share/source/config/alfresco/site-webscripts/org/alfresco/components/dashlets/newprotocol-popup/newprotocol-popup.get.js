var name = "protocollo";
model.user = name;
var destination = remote.call("/it/tlogic/sinekartapi/protocols-adress/" + name);

// TODO: usare un formato decente
model.destination = destination;
//.json.nodeRef;
