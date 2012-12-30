<#assign controlId = fieldHtmlId + "-cntrl">

<script type="text/javascript">//<![CDATA[

var uploadInit = function functionuploadInit() {
  
};

YUIEvent.onContentReady("${controlId}", uploadInit);
//]]></script>

<div class="hideable toolbar-hidden DocListTree">
            <div class="file-upload">
                     <button id="${controlId}" name="fileUpload">${msg("ALLEGA DOCUMENTO")}</button>
              <img id="${fieldHtmlId}-uploadFinish" "tabindex="0" style="visibility:hidden;position: absolute;right: 5px;top: -23px;" src="/share/res/components/images/check-icon-32.png">
            </div>
</div>