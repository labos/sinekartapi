<#assign controlId = fieldHtmlId + "-cntrl">

<script type="text/javascript">//<![CDATA[

var uploadInit = function functionuploadInit() {

 // File Upload button: user needs "create" access
var buttonfileUpload = Alfresco.util.createYUIButton(parent, "${controlId}", onClickUploadButton,
{
type:"link",
value: "create"
});
//buttonfileUpload.render();
   // Force the use of the HTML (rather than Flash) uploader because there are issues with the
   // Flash uploader in these circumstances when Sharepoint is being used. The Flash uploader
   // picks up the wrong JSESSIONID cookie which causes the upload to fail.
/*	if( !this.fileUpload ){
      this.fileUpload = Alfresco.util.ComponentManager.findFirst("Alfresco.HtmlUpload") 
}
*/

//var fileUpload = Alfresco.getFileUploadInstance();
/* var multiUploadConfig =
{

   siteId: siteId,
   containerId: doclibContainerId,
   path: docLibUploadPath,
   
   filter: [],
   mode: fileUpload.MODE_MULTI_UPLOAD,
 }
 */
//this.fileUpload.show(multiUploadConfig);

   // Show uploader for single file select - override the upload URL to use appropriate upload service
/*   var uploadConfig =
   {
      uploadURL: "api/people/upload.html",
      mode: this.fileUpload.MODE_SINGLE_UPLOAD,
      onFileUploadComplete:
      {
         fn: onUsersUploadComplete,
         scope: this
      }
   };

   this.fileUpload.show(uploadConfig);
   */
//alert(fileUpload);
   // Make sure the "use Flash" tip is hidden just in case Flash is enabled...
/*   var singleUploadTip = Dom.get(this.fileUpload.id + "-singleUploadTip-span");
   Dom.addClass(singleUploadTip, "hidden");
   Event.preventDefault(e);
   */
   
   
   function onClickUploadButton(e, args){
   YAHOO.util.Event.stopEvent(e);
   alert("ci siamo");
   
   }
   
   
};

YUIEvent.onContentReady("${controlId}", uploadInit);
//]]></script>

<div class="hideable toolbar-hidden DocListTree">
            <div class="file-upload">
               <span id="${fieldHtmlId}-fileUpload-button" class="yui-button yui-push-button">
                  <span class="first-child">
                     <button id="${controlId}" name="fileUpload">${msg("ALLEGA DOCUMENTO")}</button>
                  </span>
               </span>
              <img id="${fieldHtmlId}-uploadFinish" "tabindex="0" style="visibility:hidden;position: absolute;right: 5px;top: -23px;" src="/share/res/components/images/check-icon-32.png">
            </div>
</div>