<#-- import "/org/alfresco/components/form/form.lib.ftl" as formLib /-->

<#if formUI == "true">
   <@formLib.renderFormsRuntime formId=formId />
</#if>

<@formLib.renderFormContainer formId=formId>
	<div class="set-bordered-panel">
        <div class="set-bordered-panel-heading">Dati Obbligatori</div>
        
        <div class="set-bordered-panel-body">
		
			<div class="yui-g">
			   <div class="yui-u first">
		    	  <@formLib.renderField field=form.fields["prop_skpi_tipo"] />
		       </div>
		       <div class="yui-u first">
		    	  <@formLib.renderField field=form.fields["prop_skpi_oggetto"] />
		       </div>
		    </div>
		
		    <div class="yui-g">
			   <div class="yui-u first">
		    	  <@formLib.renderField field=form.fields["prop_skpi_mittente"] />
		       </div>
		       <div class="yui-u first">
		    	  <@formLib.renderField field=form.fields["prop_skpi_titolario"] />
		       </div>
		    </div>
		
		<div class="yui-u first">
		    	  <@formLib.renderField field=form.fields["prop_cm_content"] />
		       </div>
		</div>
	</div>
	
	<div class="set-bordered-panel">
        <div class="set-bordered-panel-heading">Dati Opzionali</div>
        <div class="set-bordered-panel-body">
		    <div class="yui-g">
			   <div class="yui-u first">		    	  
		    	  <div class="yui-g">
		    	  	 <div class="yui-u first">
		    	  		<#--<@formLib.renderField field=form.fields["prop_skpi_protocolloPrecedente"] />-->
		    	  	 </div>		    	 
		    	  	 <div class="yui-u"> 
		    	  		<#--<@formLib.renderField field=form.fields["prop_skpi_dataProtocolloPrecedente"] />-->
		    	  	</div>
		    	  </div>
		    	  <div class="yui-g">
		    	  	 <div class="yui-u first">
		    	  		<#--<@formLib.renderField field=form.fields["prop_skpi_protocolloMittente"] />-->
		    	  	 </div>		    	 
		    	  	 <div class="yui-u"> 
		    	  		<#--<@formLib.renderField field=form.fields["prop_skpi_dataProtocolloMittente"] />-->
		    	  	</div>
		    	  </div>
		    	  <div class="yui-g">
		    	  	 <div class="yui-u first">
		    	  		<#--<@formLib.renderField field=form.fields["prop_skpi_numeroProtocolloEmergenza"] />-->
		    	  	 </div>		    	 
		    	  	 <div class="yui-u"> 
		    	  		<#--<@formLib.renderField field=form.fields["prop_skpi_dataProtocolloEmergenza"] />-->
		    	  	</div>
		    	  </div>
		       </div>
		       <div class="yui-u">
		       	  <#--<@formLib.renderField field=form.fields["prop_skpi_formato"] />  	  
		    	  <@formLib.renderField field=form.fields["prop_skpi_fascicolo"] />-->		    	  
		       </div>
		    </div-->
		</div>
	</div-->
</@>

<script type="text/javascript">//<![CDATA[
(function() 
{
//	new YAHOO.widget.TabView('${formId}-tabview');
})();
//]]></script>
