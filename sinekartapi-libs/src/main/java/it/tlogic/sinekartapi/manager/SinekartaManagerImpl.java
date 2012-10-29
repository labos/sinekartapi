package it.tlogic.sinekartapi.manager;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

import it.tlogic.aoo.dao.AooDAO;
import it.tlogic.aoo.dao.CounterDAO;
import it.tlogic.aoo.dao.TitolarioDAO;
import it.tlogic.aoo.dao.TitolarioTreeDAO;
import it.tlogic.aoo.model.Aoo;
import it.tlogic.aoo.model.Counter;
import it.tlogic.aoo.model.Titolario;
import it.tlogic.aoo.model.TitolarioTree;



public class SinekartaManagerImpl implements SinekartaManager {
	
	private AooDAO aooDao;
	private CounterDAO counterDao;
	private TitolarioDAO titolarioDao;
	private TitolarioTreeDAO titolarioTreeDao;
	
	
	public TitolarioTreeDAO getTitolarioTreeDao() {
		return titolarioTreeDao;
	}


	public void setTitolarioTreeDao(TitolarioTreeDAO titolarioTreeDao) {
		this.titolarioTreeDao = titolarioTreeDao;
	}


	public AooDAO getAooDao() {
		return aooDao;
	}


	public void setAooDao(AooDAO aooDao) {
		this.aooDao = aooDao;
	}


	public CounterDAO getCounterDao() {
		return counterDao;
	}


	public void setCounterDao(CounterDAO counterDao) {
		this.counterDao = counterDao;
	}


	public TitolarioDAO getTitolarioDao() {
		return titolarioDao;
	}


	public void setTitolarioDao(TitolarioDAO titolarioDao) {
		this.titolarioDao = titolarioDao;
	}

	@Override
	public synchronized long getCounter(String name) {
		long result = 0;
		Counter counterObj = counterDao.selectByAoo(name);
		if (counterObj != null) {
			result = counterObj.getLastvalue();
			result += 1;
			counterObj.setLastvalue(result);
			counterDao.increment(counterObj);
			
		} else {
			counterObj = counterDao.addCounter(name);
			result = counterObj.getLastvalue();
		}
		
		return result;
	}

	@Override
	public void addArea(String name, String descr) {
		Aoo aooObj = new Aoo();
		aooObj.setName(name);
		aooObj.setDescription(descr);
		aooDao.insert(aooObj);
	}


	@Override
	public Aoo getAreaOmogenea(String name) {
		
		return aooDao.selectByName(name);
	}


	@Override
	public void updateAreaOmogenea(Aoo aoo) {
		// verifico il titolario
		
		Titolario tit = aoo.getTitolario();
		if (tit != null && (tit.getId() == null || tit.getId().longValue() == 0)) {
			// Titolario nuovo
			titolarioDao.insert(tit);
			aooDao.addTitolario(tit, aoo);
		}
		if (tit.getTitolarioTree() != null && tit.getTitolarioTree().size() > 0 && 
					(tit.getTitolarioTree().get(0).getId() == null || tit.getTitolarioTree().get(0).getId().longValue() == 0)) {
			List<TitolarioTree> listaChild = tit.getTitolarioTree();
			
			
			valorizzaIdTree(tit.getId(), listaChild, null);
		}
		
	}


	private void valorizzaIdTree(Long idTitolario, List<TitolarioTree> listaChild, Long idOwner) {
		if (listaChild == null) return;
		Iterator<TitolarioTree> listaChildIter = listaChild.iterator();
		while (listaChildIter.hasNext()) {
			TitolarioTree titChild = listaChildIter.next();
			titChild.setTitolarioId(idTitolario);
			titChild.setIdOwner(idOwner);
			titolarioTreeDao.insert(titChild);
			if (titChild.getChild() != null) 
				valorizzaIdTree(idTitolario, titChild.getChild(), titChild.getId());
		}
	}


	@Override
	public List<String> getTitolarioAsList(String nameAOO) {
		ArrayList<String> titolarioList = new ArrayList<String>();
		Aoo aoo = getAreaOmogenea(nameAOO);
		if (aoo == null) return titolarioList;
		Titolario tree = aoo.getTitolario();
		if (tree == null) return titolarioList;
		List<TitolarioTree> listaRoots = tree.getTitolarioTree();
		if (listaRoots == null) return titolarioList;
		Iterator<TitolarioTree> iterRoots = listaRoots.iterator();
		while (iterRoots.hasNext()) {
			TitolarioTree root = iterRoots.next();
			String ramo = root.getName();
			List<TitolarioTree> child = root.getChild();
			if (child != null && !child.isEmpty()) {
				Iterator<TitolarioTree> iterChild = child.iterator();
				while (iterChild.hasNext()) {
					TitolarioTree childEl = iterChild.next();
					if (childEl != null) {
						ramo = ramo + "/" + childEl.getName();
						titolarioList.add(ramo);
						ramo = root.getName();
					}
				}
			} else
				titolarioList.add(ramo);
			
		}
		return titolarioList;
	}


	@Override
	public String getTitolarioJournal(String aoo) {
		return aooDao.getTitolarioJournal(aoo);
	}

}
