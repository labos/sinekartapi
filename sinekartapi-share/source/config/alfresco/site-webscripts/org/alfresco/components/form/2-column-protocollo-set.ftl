<#list set.children as item>
   <#if item.kind != "set">
      <#if (item_index % 2) == 0>
      	<#if (item.id) == "prop_skpi_oggetto">
            <div class="yui-gb"><div class="skpi-cell" style="width:100%">
        <#else>
        	<div class="yui-gb"><div class="skpi-cell">
      </#if>
      <#else>
      <div class="skpi-cell">
      </#if>

      <@formLib.renderField field=form.fields[item.id] />
      </div>
      <#if ((item_index % 2) != 0) || !item_has_next></div></#if>
   </#if>
</#list>
