<#escape x as jsonUtils.encodeJSONString(x)>
{
	"items":
	[
		<#list data.items as item>
		{
			"nodeRef": "${item.nodeRef}",
			"type": "${item.type}",
			"name": "${item.name!''}",
			"displayName": "${item.displayName!''}",
			<#if item.title??>
			"title": "${item.title}",
			</#if>
			"description": "${item.description!''}",
			"modifiedOn": "${xmldate(item.modifiedOn)}",
			"modifiedByUser": "${item.modifiedByUser}",
			"modifiedBy": "${item.modifiedBy}",
			"size": ${item.size?c},
			"mimetype": "${item.mimetype!''}",
			<#if item.site??>
			"site":
			{
				"shortName": "${item.site.shortName}",
				"title": "${item.site.title}"
			},
			"container": "${item.container}",
			</#if>
			<#if item.path??>
			"path": "${item.path}",
			</#if>
			<#if item.mittente??>
			"skpi_mittente": "${item.mittente}",
			</#if>
			<#if item.destinatario??>
			"skpi_destinatario": "${item.destinatario}",
			</#if>
			<#if item.oggetto??>
			"skpi_oggetto": "${item.oggetto}",
			</#if>
			<#if item.address??>
			"skpi_address": "${item.address}",
			</#if>
			<#if item.city??>
			"skpi_city": "${item.city}",
			</#if>
			<#if item.postalCode??>
			"skpi_postalCode": "${item.postalCode}",
			</#if>
			<#if item.arrival_hour??>
			"skpi_arrival_hour": "${item.arrival_hour}",
			</#if>
			<#if item.arrival_date??>
			"skpi_arrival_date": "${item.arrival_date?string("dd MMM yyyy")}",
			</#if>
			<#if item.tipo??>
			"skpi_tipo": "${item.tipo}",
			</#if>
			"tags": [<#list item.tags as tag>"${tag}"<#if tag_has_next>,</#if></#list>]
		}<#if item_has_next>,</#if>
		</#list>
	]
}
</#escape>