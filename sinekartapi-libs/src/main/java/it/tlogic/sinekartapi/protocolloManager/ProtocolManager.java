package it.tlogic.sinekartapi.protocolloManager;

import it.tlogic.aoo.model.Aoo;
import it.tlogic.aoo.model.Titolario;
import it.tlogic.aoo.model.TitolarioTree;
import it.tlogic.sinekartapi.manager.SinekartaManager;

import java.io.IOException;
import java.io.InputStream;
import java.sql.SQLException;
import java.util.List;
import java.util.Properties;

import javax.sql.DataSource;

import org.apache.log4j.Logger;
import org.springframework.context.ApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;


/**
 * Singleton class to manage all the protocol requests in a thread-safe way.
 * Note that the synchronization is quite coarse-grained. We however believe that
 * given the common usage of this module, this will hardly be a limit.
 * 
 * @author tommaso
 *
 */
public class ProtocolManager  {

	private static SinekartaManager man = null;
	private static ApplicationContext ctx = null;
	
	/**
	 * Private constructor to avoid external access
	 */
	private ProtocolManager() {
		
	};

	/**
	 * Logger
	 */
	private static Logger log = Logger.getLogger(ProtocolManager.class);


	/**
	 * Safely increments the counter and returns its new value
	 * @throws Throwable 
	 */
	public synchronized static long nextValue(String aoo) throws Throwable {
		verificaManager();
		log.debug("GetCounter - " + aoo) ;
		return man.getCounter(aoo);
	}
	
	public synchronized static String getTitolarioJournal(String aoo) throws Throwable {
		verificaManager();
		
		return man.getTitolarioJournal(aoo);
	}
	


	private synchronized static void verificaManager()  throws Throwable {
		if (man == null || ctx == null) {
			log.info("Create Spring manager instance");
			try {
				ctx = new ClassPathXmlApplicationContext("sinekartapiContext.xml");
				log.info("Context loaded");
				man = ctx.getBean("manager", SinekartaManager.class);
				log.info("manager loaded");
			} catch(Throwable e) {
				log.error("error CreateInstance: " + e.getMessage(), e);
				ctx = null;
				man = null;
				throw e;
			}
			
			
			
		}
		
	}


	/**
	 * 
	 * @return 
	 * @throws Throwable 
	 */
	public  static List<String> getTitolarioAsList (String aoo) throws Throwable {
		verificaManager();
		return man.getTitolarioAsList(aoo);
	}

	/**
	 * 
	 * @return 
	 * @throws Throwable 
	 */
	public  static Titolario getTitolario (String aoo) throws Throwable {
		verificaManager();
		//return man.getTitolarioAsList(aoo);
		Aoo area = man.getAreaOmogenea(aoo);
		Titolario tit = area.getTitolario();
		return tit;
//		List<TitolarioTree> tree = tit.getTitolarioTree();
//		
//		 JSONObject object=new JSONObject();
//		 object.put("name","Amit Kumar");
//		 object.put("Max.Marks",new Integer(100));
//		 object.put("Min.Marks",new Double(40));
//		 object.put("Scored",new Double(66.67));
//		 object.put("nickname","Amit");
//		 System.out.println(object);
		
	}
	
}
