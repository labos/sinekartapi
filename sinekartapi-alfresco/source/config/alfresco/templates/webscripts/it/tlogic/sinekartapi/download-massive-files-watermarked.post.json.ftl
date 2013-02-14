<#escape x as jsonUtils.encodeJSONString(x)>
{
    "resultCode" : "${resultCode}",
    "response" : {"nodesToArchive" :
    [<#list response as anoderef>
    {"nodeRef" : "${anoderef}" }
    <#if anoderef_has_next>,</#if>
    </#list>]
    }
}
</#escape>