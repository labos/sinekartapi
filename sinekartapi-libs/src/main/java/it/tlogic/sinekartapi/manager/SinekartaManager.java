package it.tlogic.sinekartapi.manager;

import java.util.List;

import it.tlogic.aoo.model.Aoo;



public interface SinekartaManager {

	long getCounter(String name);

	void addArea(String name, String descr);

	Aoo getAreaOmogenea(String name);

	void updateAreaOmogenea(Aoo aoo);
	
	List<String> getTitolarioAsList(String nameAOO);

	String getTitolarioJournal(String aoo); 

}
