<import "/org/alfresco/components/form/form.lib.ftl" as formLib />

<#if formUI == "true">
   <@formLib.renderFormsRuntime formId=formId />
</#if>

<@formLib.renderFormContainer formId=formId>
	<div class="set-bordered-panel">
		<div class="set-bordered-panel-heading">Dati Obbligatori</div>
        
		<div class="set-bordered-panel-body skpi-block">
		
			<div class="skpi-row">
				<div class="skpi-cell skpi-first">
					<#-- <@formLib.renderField field=form.fields["prop_skpi_aoo"] /> -->

					<div class="form-field">
						<label for="protocol-select_aoo">
							Area Organizzativa Omogenea
							<span class="mandatory-indicator">*</span>
						</label>
						<select id="protocol-select_aoo" tabindex="0" name="prop_skpi_tipo">
							<option value="AO1">A01</option>
							<option value="AO2">A02</option>
						</select>
					</div>
				</div>
		    
				<div class="skpi-cell">
					<@formLib.renderField field=form.fields["prop_skpi_titolario"] />
				</div>
			</div>
		
			<div class="skpi-row">
			   <div class="skpi-cell skpi-first">
		    	  <@formLib.renderField field=form.fields["prop_skpi_tipo"] />
		       </div>
		       <div class="skpi-cell">
		    	  <@formLib.renderField field=form.fields["prop_skpi_oggetto"] />
		       </div>
		    </div>
		
			<div class="skpi-row">
				<div class="skpi-cell skpi-first">
					<@formLib.renderField field=form.fields["prop_skpi_mittente"] />
				</div>
				<div class="skpi-cell">
					<@formLib.renderField field=form.fields["prop_skpi_destinatario"] />
				</div>
			</div>
		    
			<div class="skpi-row">
				<@formLib.renderField field=form.fields["prop_cm_content"] />
			</div>
		</div>
	</div>

	<div class="set-bordered-panel">
		<div class="set-bordered-panel-heading">Dati Opzionali</div>
		<div class="set-bordered-panel-body skpi-block">
			
			<div class="skpi-row">
				<!-- <div class="skpi-cell first"> -->		    	  
					<div class="skpi-row">
						<div class="skpi-cell skpi-first">
							<@formLib.renderField field=form.fields["prop_skpi_protocollo_precedente"] />
						</div>		    	 
						<div class="skpi-cell"> 
							<@formLib.renderField field=form.fields["prop_skpi_data_protocollo_precedente"] />
						</div>
					</div>
				
				<div class="skpi-row">
					<div class="skpi-cell skpi-first">
						<@formLib.renderField field=form.fields["prop_skpi_protocollo_mittente"] />
					</div>		    	 
					<div class="skpi-cell"> 
						<@formLib.renderField field=form.fields["prop_skpi_data_protocollo_mittente"] />
					</div>
				</div>
				
				<div class="skpi-row">
					<div class="skpi-cell skpi-first">
						<@formLib.renderField field=form.fields["prop_skpi_protocollo_emergenza"] />
					</div>		    	 
					<div class="skpi-cell"> 
						<@formLib.renderField field=form.fields["prop_skpi_data_protocollo_emergenza"] />
					</div>
				</div>
			</div>
			
			<div class="skpi-cell">
				<div class="skpi-row">
					<@formLib.renderField field=form.fields["prop_skpi_fascicolo"] />
				</div>
				
				<div class="skpi-row">
					<@formLib.renderField field=form.fields["prop_skpi_note"] />
				</div>
			</div>
			
		</div>
	</div>
</@>

<script type="text/javascript">//<![CDATA[
(function() 
{
//	new YAHOO.widget.TabView('${formId}-tabview');
})();
//]]></script>
