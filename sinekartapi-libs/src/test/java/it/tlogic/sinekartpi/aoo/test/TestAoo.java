package it.tlogic.sinekartpi.aoo.test;


import static org.junit.Assert.*;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

import javax.sql.DataSource;

import it.tlogic.aoo.model.Aoo;
import it.tlogic.aoo.model.Titolario;
import it.tlogic.aoo.model.TitolarioTree;
import it.tlogic.sinekartapi.manager.SinekartaManager;

import org.junit.Before;
import org.junit.BeforeClass;
import org.junit.Test;
import org.springframework.context.ApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;


public class TestAoo {
	private SinekartaManager man;
	private ApplicationContext ctx;
	private DataSource dsSinekarta;
	
	final String TESTAOONAME ="TESTAO1O";
	final String TESTTITOLARIO ="TestTitolario";
	
	@Before
	public void setup() {
		ctx = new ClassPathXmlApplicationContext("sinekartapiContext.xml");
		man = ctx.getBean("manager", SinekartaManager.class);
		dsSinekarta = ctx.getBean("SinekartaDatasource", DataSource.class);
	}
	
	 
	@Test
	public void getCounter() throws Exception {
		long currentValue = 0;
		
		Connection conn = dsSinekarta.getConnection();
		try {
			
			PreparedStatement stTest = conn.prepareStatement("SELECT COUNTER.ID, COUNTER.LASTVALUE " +
									"FROM COUNTER_HAS_AOO, COUNTER, AOO " +
									"WHERE " + 
									"AOO.NAME  = ? " +
									"AND AOO.ID = COUNTER_HAS_AOO.AOO_ID " +
									"AND COUNTER_HAS_AOO.DT_INI_VAL <= CURRENT_DATE AND (COUNTER_HAS_AOO.DT_END_VAL >= CURRENT_DATE) " +
									"AND COUNTER.ID = COUNTER_HAS_AOO.COUNTER_ID ");
			
			try {
				stTest.setString(1, TESTAOONAME);
				
				ResultSet rsTest = stTest.executeQuery();
				try {
					if (rsTest.next()) {
						currentValue = rsTest.getLong("LASTVALUE");
					} 
				} finally {
					rsTest.close();
				}
				
			} finally {
				stTest.close();
			}
			
			stTest = conn.prepareStatement("SELECT ID  " +
					"FROM AOO " +
					"WHERE " + 
						"AOO.NAME  = ? ");

			try {
				stTest.setString(1, TESTAOONAME);
			
				ResultSet rsTest = stTest.executeQuery();
				try {
					if (!rsTest.next()) {
						man.addArea(TESTAOONAME, "Area di test Unit");
					} 
				} finally {
					rsTest.close();
				}
				
			} finally {
				stTest.close();
			}
			
			
		} finally {
			conn.close();
		}
		
		long count = man.getCounter(TESTAOONAME);
		assertEquals("la funzione non ha tornato il valore corretto", ++currentValue, count);
		
	}
	
	@Test
	public void testTitolario() throws Exception  {
		Connection conn = dsSinekarta.getConnection();
		try {
			
			PreparedStatement stTest = conn.prepareStatement("SELECT COUNTER.ID, COUNTER_HAS_AOO.ID_TITOLARIO " +
									"FROM COUNTER_HAS_AOO, COUNTER, AOO " +
									"WHERE " + 
									"	AOO.NAME  = ? " +
									"	AND AOO.ID = COUNTER_HAS_AOO.AOO_ID " +
									"	AND COUNTER_HAS_AOO.DT_INI_VAL <= CURRENT_DATE AND (COUNTER_HAS_AOO.DT_END_VAL >= CURRENT_DATE) " +
									"	AND COUNTER.ID = COUNTER_HAS_AOO.COUNTER_ID ");
			
			try {
				stTest.setString(1, TESTAOONAME);
				
				ResultSet rsTest = stTest.executeQuery();
				try {
					if (!rsTest.next()) {
						long count = man.getCounter(TESTAOONAME);
						
					} 
				} finally {
					rsTest.close();
				}
				
			} finally {
				stTest.close();
			}
			
			
			Aoo aoo = man.getAreaOmogenea(TESTAOONAME);
			assertNotNull(TESTAOONAME + " non trovato", aoo);
			if (aoo.getTitolario() == null  ) {
				Titolario titolario = new Titolario();
				titolario.setDescr(TESTTITOLARIO + " - DESCR");
				titolario.setName(TESTTITOLARIO);
				aoo.setTitolario(titolario);
			}
			if (aoo.getTitolario().getTitolarioTree() == null || aoo.getTitolario().getTitolarioTree().size() == 0 ) {
				
				Titolario titolario = aoo.getTitolario();
				
				ArrayList<TitolarioTree> treeList = new ArrayList<TitolarioTree>();
				titolario.setTitolarioTree(treeList);
				
				TitolarioTree titolarioTree1 = new TitolarioTree();
				titolarioTree1.setName(TESTTITOLARIO + "-CHILD1");
				titolarioTree1.setDescr(TESTTITOLARIO + "-CHILD1-DESCR");
				
				treeList.add(titolarioTree1);
				
				TitolarioTree titolarioTree2 = new TitolarioTree();
				titolarioTree2.setName(TESTTITOLARIO + "-CHILD2");
				titolarioTree2.setDescr(TESTTITOLARIO + "-CHILD2-DESCR");
				
				TitolarioTree titolarioTree21 = new TitolarioTree();
				titolarioTree21.setName(TESTTITOLARIO + "-CHILD2-1");
				titolarioTree21.setDescr(TESTTITOLARIO + "-CHILD2-1-DESCR");
				
				ArrayList<TitolarioTree> treeListChild = new ArrayList<TitolarioTree>();
				treeListChild.add(titolarioTree21);
				titolarioTree2.setChild(treeListChild);
				treeList.add(titolarioTree2);
				
				
				man.updateAreaOmogenea(aoo);
				
			}
			aoo = man.getAreaOmogenea(TESTAOONAME);
			assertNotNull(TESTAOONAME  + " Titolario non trovato", aoo.getTitolario());
			assertNotNull(TESTAOONAME  + " TITOLARIO trovato ma TREE vuoto", aoo.getTitolario().getTitolarioTree());
			assertTrue(TESTAOONAME  + " TITOLARIO trovato ma TREE vuoto", aoo.getTitolario().getTitolarioTree().size() == 2);
			Iterator<TitolarioTree> iterTree = aoo.getTitolario().getTitolarioTree().iterator();
			
			boolean childTrovato = false;
			
			while (!childTrovato && iterTree.hasNext()) {
				TitolarioTree tit = iterTree.next();
				if (tit.getChild() != null && tit.getChild().size() > 0)
					childTrovato = true; 
			}
			
			assertTrue("Non ho trovato Child", childTrovato);
			
			
			List<String> listaPiana = man.getTitolarioAsList(TESTAOONAME);
			assertTrue("errore Lista piana", listaPiana != null && listaPiana.size() > 1);
			
			
			
		} finally {
			conn.close();
		}
	}

	
	
	
}
