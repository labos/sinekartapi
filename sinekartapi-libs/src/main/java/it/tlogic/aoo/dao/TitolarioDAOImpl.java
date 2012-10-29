package it.tlogic.aoo.dao;

import it.tlogic.aoo.model.Titolario;
import org.springframework.orm.ibatis.support.SqlMapClientDaoSupport;

public class TitolarioDAOImpl extends SqlMapClientDaoSupport implements TitolarioDAO {

    /**
     * This method was generated by Abator for iBATIS.
     * This method corresponds to the database table titolario
     *
     * @abatorgenerated Wed Mar 21 17:27:12 CET 2012
     */
    public TitolarioDAOImpl() {
        super();
    }

    /**
     * This method was generated by Abator for iBATIS.
     * This method corresponds to the database table titolario
     *
     * @abatorgenerated Wed Mar 21 17:27:12 CET 2012
     */
    public void insert(Titolario record) {
        getSqlMapClientTemplate().insert("titolario.abatorgenerated_insert", record);
    }

    /**
     * This method was generated by Abator for iBATIS.
     * This method corresponds to the database table titolario
     *
     * @abatorgenerated Wed Mar 21 17:27:12 CET 2012
     */
    public int updateByPrimaryKey(Titolario record) {
        int rows = getSqlMapClientTemplate().update("titolario.abatorgenerated_updateByPrimaryKey", record);
        return rows;
    }

    /**
     * This method was generated by Abator for iBATIS.
     * This method corresponds to the database table titolario
     *
     * @abatorgenerated Wed Mar 21 17:27:12 CET 2012
     */
    public int updateByPrimaryKeySelective(Titolario record) {
        int rows = getSqlMapClientTemplate().update("titolario.abatorgenerated_updateByPrimaryKeySelective", record);
        return rows;
    }

    /**
     * This method was generated by Abator for iBATIS.
     * This method corresponds to the database table titolario
     *
     * @abatorgenerated Wed Mar 21 17:27:12 CET 2012
     */
    public Titolario selectByPrimaryKey(Long id) {
        Titolario key = new Titolario();
        key.setId(id);
        Titolario record = (Titolario) getSqlMapClientTemplate().queryForObject("titolario.abatorgenerated_selectByPrimaryKey", key);
        return record;
    }

    /**
     * This method was generated by Abator for iBATIS.
     * This method corresponds to the database table titolario
     *
     * @abatorgenerated Wed Mar 21 17:27:12 CET 2012
     */
    public int deleteByPrimaryKey(Long id) {
        Titolario key = new Titolario();
        key.setId(id);
        int rows = getSqlMapClientTemplate().delete("titolario.abatorgenerated_deleteByPrimaryKey", key);
        return rows;
    }
}