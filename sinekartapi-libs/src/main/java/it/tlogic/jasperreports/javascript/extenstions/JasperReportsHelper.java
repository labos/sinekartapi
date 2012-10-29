package it.tlogic.jasperreports.javascript.extenstions;

import java.io.BufferedInputStream;
import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.io.Serializable;
import java.util.HashMap;
import java.util.Map;

import net.sf.jasperreports.engine.JRException;
import net.sf.jasperreports.engine.JRExporter;
import net.sf.jasperreports.engine.JRExporterParameter;
import net.sf.jasperreports.engine.JasperCompileManager;
import net.sf.jasperreports.engine.JasperFillManager;
import net.sf.jasperreports.engine.JasperPrint;
import net.sf.jasperreports.engine.JasperReport;
import net.sf.jasperreports.engine.data.JRXmlDataSource;
import net.sf.jasperreports.engine.export.JRPdfExporter;

import org.alfresco.model.ContentModel;
import org.alfresco.repo.processor.BaseProcessorExtension;
import org.alfresco.service.cmr.repository.ContentReader;
import org.alfresco.service.cmr.repository.ContentService;
import org.alfresco.service.cmr.repository.ContentWriter;
import org.alfresco.service.cmr.repository.NodeRef;
import org.alfresco.service.cmr.repository.NodeService;
import org.alfresco.service.namespace.NamespaceService;
import org.alfresco.service.namespace.QName;

public class JasperReportsHelper extends BaseProcessorExtension {
	
	private NodeService nodeService;
	private ContentService contentService;
	
	
	public NodeRef generateXMLEtichetta(String xml,  String xpathQuery, NodeRef reportNodeRef) throws IOException, JRException {
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
		ContentWriter contentWriter = contentService.getWriter(reportNodeRef, ContentModel.PROP_CONTENT, true);
		contentWriter.setMimetype("application/pdf");
		
		OutputStream reportOS = contentWriter.getContentOutputStream();
		
		exporter.setParameter(JRExporterParameter.JASPER_PRINT, print);
		exporter.setParameter(JRExporterParameter.OUTPUT_STREAM, reportOS);
		
		try {
			exporter.exportReport();
		} catch (JRException e) {
			throw e;
		} finally {
			reportOS.close();
		}
		return reportNodeRef;
	}
	
	                                           
	public NodeRef generateXMLDataSourceReport(String xml, String xpathQuery, NodeRef jrxmlNodeRef, NodeRef parentOutputNodeRef, String fileName) throws IOException, JRException {
		NodeRef reportNodeRef = null;
		
		ContentReader contentReader = contentService.getReader(jrxmlNodeRef, ContentModel.PROP_CONTENT);
		InputStream jasperReportIS = new BufferedInputStream(contentReader.getContentInputStream(), 4096);
		
		//InputStream jasperReportIS = getClass().getResourceAsStream(jrxmlPath);
		
		JasperReport jasperReport = null;
		// TODO: Should generate report only once to save time. Maybe user can pass in forceRecompile if he wants to regenerate, 
		//       but otherwise after first generation try saving .jasper file somewhere and retrieve it if forceRecompile is false.
		try {
            jasperReport = JasperCompileManager.compileReport(jasperReportIS);
        } finally {
        	jasperReportIS.close();
        }
        JRXmlDataSource jrxmlDS = new JRXmlDataSource(new ByteArrayInputStream(xml.getBytes()), xpathQuery);
        Map<JRExporterParameter, String> parameters = new HashMap<JRExporterParameter, String>();
        JasperPrint print = JasperFillManager.fillReport(jasperReport, parameters, jrxmlDS);
        
		JRExporter exporter = null;
		
		
		
		String reportNodeName = fileName;//String.valueOf(System.currentTimeMillis());
		
		exporter = new JRPdfExporter();
		reportNodeName += ".pdf";
		
		
        HashMap<QName, Serializable> contentProperties = new HashMap<QName, Serializable>();
		contentProperties.put(ContentModel.PROP_NAME, reportNodeName);
		QName assocQName = QName.createQName(NamespaceService.CONTENT_MODEL_1_0_URI, QName.createValidLocalName(reportNodeName));
		
		
		
		reportNodeRef = nodeService.createNode(parentOutputNodeRef, ContentModel.ASSOC_CONTAINS, assocQName, ContentModel.PROP_CONTENT, contentProperties).getChildRef();
		ContentWriter contentWriter = contentService.getWriter(reportNodeRef, ContentModel.PROP_CONTENT, true);
		contentWriter.setMimetype("application/pdf");
		
		OutputStream reportOS = contentWriter.getContentOutputStream();
		
		exporter.setParameter(JRExporterParameter.JASPER_PRINT, print);
		exporter.setParameter(JRExporterParameter.OUTPUT_STREAM, reportOS);
		
		try {
			exporter.exportReport();
		} catch (JRException e) {
			nodeService.deleteNode(reportNodeRef);
			throw e;
		} finally {
			reportOS.close();
		}
		return reportNodeRef;
	}


	// Getters & setters
	
	public void setNodeService(NodeService nodeService) { this.nodeService = nodeService; }
	
	public void setContentService(ContentService contentService) { this.contentService = contentService; }


	
}