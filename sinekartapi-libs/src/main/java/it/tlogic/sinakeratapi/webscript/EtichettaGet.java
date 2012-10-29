package it.tlogic.sinakeratapi.webscript;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.io.Serializable;
import java.net.SocketException;
import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

import javax.servlet.ServletContext;
import javax.servlet.http.HttpServletResponse;

import net.sf.jasperreports.engine.JRException;
import net.sf.jasperreports.engine.JRExporter;
import net.sf.jasperreports.engine.JRExporterParameter;
import net.sf.jasperreports.engine.JasperCompileManager;
import net.sf.jasperreports.engine.JasperFillManager;
import net.sf.jasperreports.engine.JasperPrint;
import net.sf.jasperreports.engine.JasperReport;
import net.sf.jasperreports.engine.data.JRXmlDataSource;
import net.sf.jasperreports.engine.export.JRPdfExporter;

import org.alfresco.cmis.CMISObjectReference;
import org.alfresco.cmis.CMISRenditionService;
import org.alfresco.model.ContentModel;
import org.alfresco.repo.cmis.reference.ReferenceFactory;
import org.alfresco.repo.content.MimetypeMap;
import org.alfresco.service.cmr.dictionary.DictionaryService;
import org.alfresco.service.cmr.repository.ContentIOException;
import org.alfresco.service.cmr.repository.MimetypeService;
import org.alfresco.service.cmr.repository.NodeRef;
import org.alfresco.service.cmr.repository.NodeService;
import org.alfresco.service.namespace.QName;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.extensions.webscripts.AbstractWebScript;
import org.springframework.extensions.webscripts.Cache;
import org.springframework.extensions.webscripts.WebScriptException;
import org.springframework.extensions.webscripts.WebScriptRequest;
import org.springframework.extensions.webscripts.WebScriptResponse;
import org.springframework.util.FileCopyUtils;
import org.springframework.web.context.ServletContextAware;

public class EtichettaGet extends AbstractWebScript implements
		ServletContextAware {
	
	private static final Log logger = LogFactory.getLog(EtichettaGet.class);
	private NodeService nodeService;
	

	public void setNodeService(NodeService nodeService) {
		this.nodeService = nodeService;
	}

	@SuppressWarnings("unused")
	private ServletContext servletContext;
	private ReferenceFactory referenceFactory;
	@SuppressWarnings("unused")
	private DictionaryService dictionaryService;
	@SuppressWarnings("unused")
	private CMISRenditionService renditionService;
	
	protected MimetypeService mimetypeService;

    /**
     * @param mimetypeService
     */
    public void setMimetypeService(MimetypeService mimetypeService)
    {
        this.mimetypeService = mimetypeService; 
    }

	/**
	 * @param
	 */
	public void setServletContext(ServletContext servletContext) {
		this.servletContext = servletContext;
	}

	/**
	 * @param reference
	 *            factory
	 */
	public void setReferenceFactory(ReferenceFactory referenceFactory) {
		this.referenceFactory = referenceFactory;
	}

	/**
	 * @param dictionaryService
	 */
	public void setDictionaryService(DictionaryService dictionaryService) {
		this.dictionaryService = dictionaryService;
	}

	/**
	 * @param renditionService
	 */
	public void setCMISRenditionService(CMISRenditionService renditionService) {
		this.renditionService = renditionService;
	}

	@Override
	public void execute(WebScriptRequest req, WebScriptResponse res)
			throws IOException {
		// create map of args
		String[] names = req.getParameterNames();
		Map<String, String> args = new HashMap<String, String>(names.length,
				1.0f);
		for (String name : names) {
			args.put(name, req.getParameter(name));
		}

		// create map of template vars
		Map<String, String> templateVars = req.getServiceMatch()
				.getTemplateVars();

		// create object reference from url
		CMISObjectReference reference = referenceFactory
				.createObjectReferenceFromUrl(args, templateVars);
		NodeRef nodeRef = reference.getNodeRef();
		if (nodeRef == null) {
			throw new WebScriptException(HttpServletResponse.SC_NOT_FOUND,
					"Unable to find " + reference.toString());
		}

		// determine attachment
		//boolean attach = Boolean.valueOf(req.getParameter("a"));
		Map<QName, Serializable> props = nodeService.getProperties(nodeRef);
		String nProtocollo = (String)props.get(QName.createQName("{it.tlogic.skpi}numero_protocollo"));
		logger.info("[PROTOCOLLO] obtained protocol number " + nProtocollo);
		Date dataProtocollo = (Date)props.get(QName.createQName("{it.tlogic.skpi}data_protocollazione"));
		logger.info("[PROTOCOLLO] obtained protocol date " + dataProtocollo);
		Date dtTmp = Calendar.getInstance().getTime();
		if (dataProtocollo != null)
			dtTmp = dataProtocollo;
		String annoProtocollo = String.valueOf(dtTmp.getYear() + 1900);
		String classificazione = (String)props.get(QName.createQName("{it.tlogic.skpi}titolario"));
		logger.info("[PROTOCOLLO] obtained protocol year " + annoProtocollo);
		String areaAoo = (String)props.get(QName.createQName("{it.tlogic.skpi}aoo"));
		String associazione = "Comune di Recanati"; 
		String text =
				"<items><item>"; text += "<numProtocollo>" + areaAoo + annoProtocollo + nProtocollo + "</numProtocollo>"; 
		text += "<classificazione>" +
				classificazione + "</classificazione>"; 
		text += "<nomeAssociazione>" +
				associazione + "</nomeAssociazione>";
		text += "<area>" + areaAoo +
				"</area>"; 
		text += "</item></items>";
		
		logger.info("[PROTOCOLLO] xml: " + text);
		String fileName = nodeService.getProperty(nodeRef, ContentModel.PROP_NAME) + "-ettichetta.pdf";
		try {
			byte[] stream = generateXMLEtichetta(text, "/items/item");
			streamContentImpl(req, res, stream, "UTF-8", false, Calendar.getInstance().getTime(), fileName, "application/pdf");
		} catch (JRException e) {
			logger.error("[PROTOCOLLO] xml: " + e.getMessage(), e);
			throw new IOException(e);
		}

	}

	protected void streamContentImpl(WebScriptRequest req,
			WebScriptResponse res, byte[] stream, String encoding, boolean attach,
			Date modified, String attachFileName,
			String mimetype) throws IOException {
		setAttachment(res, attach, attachFileName);

		// establish mimetype
		
		String extensionPath = req.getExtensionPath();
		if (mimetype == null || mimetype.length() == 0) {
			mimetype = MimetypeMap.MIMETYPE_BINARY;
			int extIndex = extensionPath.lastIndexOf('.');
			if (extIndex != -1) {
				String ext = extensionPath.substring(extIndex + 1);
				mimetype = mimetypeService.getMimetype(ext);
			}
		}

		// set mimetype for the content and the character encoding + length for
		// the stream
		res.setContentType(mimetype);
		res.setContentEncoding(encoding);
		res.setHeader("Content-Length", Long.toString(stream.length));

		// set caching
		//setResponseCache(res, modified, eTag, model);

		// get the content and stream directly to the response output stream
		// assuming the repository is capable of streaming in chunks, this
		// should allow large files
		// to be streamed directly to the browser response stream.
		ByteArrayInputStream is = new ByteArrayInputStream(stream);
		OutputStream os = res.getOutputStream();
		try {
			FileCopyUtils.copy(is, os);
			
		} catch (SocketException e1) {
			// the client cut the connection - our mission was accomplished
			// apart from a little error message
			if (logger.isInfoEnabled())
				logger.info("Client aborted stream read:\n\tcontent");
		} catch (ContentIOException e2) {
			if (logger.isInfoEnabled())
				logger.info("Client aborted stream read:\n\tcontent");
		} finally {
			os.close();
		}
	}

	/**
	 * Set the cache settings on the response
	 * 
	 * @param res
	 * @param modified
	 * @param eTag
	 */
	protected void setResponseCache(WebScriptResponse res, Date modified,
			String eTag, Map<String, Object> model) {
		Cache cache = new Cache();
		if (model == null || model.get("allowBrowserToCache") == null
				|| ((String) model.get("allowBrowserToCache")).equals("false")) {
			cache.setNeverCache(false);
			cache.setMustRevalidate(true);
			cache.setMaxAge(0L);
			cache.setLastModified(modified);
			cache.setETag(eTag);
		} else {
			cache.setNeverCache(false);
			cache.setMustRevalidate(false);
			cache.setMaxAge(Long.MAX_VALUE);
			cache.setLastModified(modified);
			cache.setETag(eTag);
			res.setCache(cache);
		}
		res.setCache(cache);
	}

	/**
	 * Set attachment header
	 * 
	 * @param res
	 * @param attach
	 * @param attachFileName
	 */
	protected void setAttachment(WebScriptResponse res, boolean attach,
			String attachFileName) {
		//if (attach == true) {
			String headerValue = "attachment";
			if (attachFileName != null && attachFileName.length() > 0) {
				if (logger.isDebugEnabled())
					logger.debug("Attaching content using filename: "
							+ attachFileName);

				headerValue += "; filename=" + attachFileName;
			}

			// set header based on filename - will force a Save As from the
			// browse if it doesn't recognize it
			// this is better than the default response of the browser trying to
			// display the contents
			res.setHeader("Content-Disposition", headerValue);
		//}
	}

	
	public byte[] generateXMLEtichetta(String xml,  String xpathQuery) throws IOException, JRException {
		//	, String fileName) throws IOException, JRException {
		//NodeRef reportNodeRef = null;
		JasperReport jasperReport = null;
		InputStream jasperReportIS = getClass().getResourceAsStream("/alfresco/templates/webscripts/it/tlogic/sinekartapi/reportBarcode.jrxml");
		try {
            jasperReport = JasperCompileManager.compileReport(jasperReportIS);
        } finally {
        	jasperReportIS.close();
        }
        JRXmlDataSource jrxmlDS = new JRXmlDataSource(new ByteArrayInputStream(xml.getBytes()), xpathQuery);
        Map<JRExporterParameter, String> parameters = new HashMap<JRExporterParameter, String>();
        JasperPrint print = JasperFillManager.fillReport(jasperReport, parameters, jrxmlDS);
        
		JRExporter exporter = new JRPdfExporter();
		//String reportNodeName = fileName;
		//reportNodeName += ".pdf";
		//HashMap<QName, Serializable> contentProperties = new HashMap<QName, Serializable>();
		//contentProperties.put(ContentModel.PROP_NAME, reportNodeName);
		
		//QName assocQName = QName.createQName(NamespaceService.CONTENT_MODEL_1_0_URI, QName.createValidLocalName(reportNodeName));

		//reportNodeRef = nodeService.createNode(parentOutputNodeRef, ContentModel.ASSOC_CONTAINS, assocQName, ContentModel.PROP_CONTENT, contentProperties).getChildRef();
		//ContentWriter contentWriter = contentService.getWriter(reportNodeRef, ContentModel.PROP_CONTENT, true);
		//contentWriter.setMimetype("application/pdf");
		
		ByteArrayOutputStream reportOS = new ByteArrayOutputStream();
		
		exporter.setParameter(JRExporterParameter.JASPER_PRINT, print);
		exporter.setParameter(JRExporterParameter.OUTPUT_STREAM, reportOS);
		
		try {
			exporter.exportReport();
			return reportOS.toByteArray();
		} catch (JRException e) {
			throw e;
		} finally {
			reportOS.close();
		}
		
	}
}
