package it.tlogic.aoo.dao;

import java.math.BigInteger;
import java.util.HashMap;
import java.util.Map;

import it.tlogic.aoo.model.Aoo;
import it.tlogic.aoo.model.Titolario;

import org.springframework.orm.ibatis.support.SqlMapClientDaoSupport;

public class AooDAOImpl extends SqlMapClientDaoSupport implements AooDAO {

    /**
     * This method was generated by Abator for iBATIS.
     * This method corresponds to the database table aoo
     *
     * @abatorgenerated Wed Mar 21 17:27:12 CET 2012
     */
    public AooDAOImpl() {
        super();
    }

    /**
     * This method was generated by Abator for iBATIS.
     * This method corresponds to the database table aoo
     *
     * @abatorgenerated Wed Mar 21 17:27:12 CET 2012
     */
    public void insert(Aoo record) {
        getSqlMapClientTemplate().insert("aoo.abatorgenerated_insert", record);
    }

    /**
     * This method was generated by Abator for iBATIS.
     * This method corresponds to the database table aoo
     *
     * @abatorgenerated Wed Mar 21 17:27:12 CET 2012
     */
    public int updateByPrimaryKey(Aoo record) {
        int rows = getSqlMapClientTemplate().update("aoo.abatorgenerated_updateByPrimaryKey", record);
        return rows;
    }

    

    /**
     * This method was generated by Abator for iBATIS.
     * This method corresponds to the database table aoo
     *
     * @abatorgenerated Wed Mar 21 17:27:12 CET 2012
     */
    public Aoo selectByPrimaryKey(Long id) {
        Aoo key = new Aoo();
        key.setId(id);
        Aoo record = (Aoo) getSqlMapClientTemplate().queryForObject("aoo.abatorgenerated_selectByPrimaryKey", key);
        return record;
    }

    /**
     * This method was generated by Abator for iBATIS.
     * This method corresponds to the database table aoo
     *
     * @abatorgenerated Wed Mar 21 17:27:12 CET 2012
     */
    public int deleteByPrimaryKey(Long id) {
        Aoo key = new Aoo();
        key.setId(id);
        int rows = getSqlMapClientTemplate().delete("aoo.abatorgenerated_deleteByPrimaryKey", key);
        return rows;
    }

	@Override
	public Aoo selectByName(String name) {
		 Aoo key = new Aoo();
	     key.setName(name);
	     Aoo record = (Aoo) getSqlMapClientTemplate().queryForObject("aoo.selectByName", key);
	     return record;
	}

	@Override
	public int addTitolario(Titolario tit, Aoo aoo) {
		Map<String, Object> map = new HashMap<String, Object>();
		map.put("id_titolario", tit.getId());
		map.put("id_aoo", aoo.getId());
		int rows = getSqlMapClientTemplate().update("aoo.addTitolario", map);
        return rows;
	}

	@Override
	public String getTitolarioJournal(String aoo) {
		Aoo aooObj = selectByName(aoo);
		return aooObj.getTitolarioJournal();
	}
    
    
}