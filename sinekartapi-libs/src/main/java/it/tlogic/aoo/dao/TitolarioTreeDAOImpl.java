package it.tlogic.aoo.dao;

import it.tlogic.aoo.model.TitolarioTree;
import org.springframework.orm.ibatis.support.SqlMapClientDaoSupport;

public class TitolarioTreeDAOImpl extends SqlMapClientDaoSupport implements TitolarioTreeDAO {

    /**
     * This method was generated by Abator for iBATIS.
     * This method corresponds to the database table titolario_tree
     *
     * @abatorgenerated Thu Mar 22 14:59:42 CET 2012
     */
    public TitolarioTreeDAOImpl() {
        super();
    }

    /**
     * This method was generated by Abator for iBATIS.
     * This method corresponds to the database table titolario_tree
     *
     * @abatorgenerated Thu Mar 22 14:59:42 CET 2012
     */
    public void insert(TitolarioTree record) {
        getSqlMapClientTemplate().insert("titolario_tree.abatorgenerated_insert", record);
    }

    /**
     * This method was generated by Abator for iBATIS.
     * This method corresponds to the database table titolario_tree
     *
     * @abatorgenerated Thu Mar 22 14:59:42 CET 2012
     */
    public int updateByPrimaryKey(TitolarioTree record) {
        int rows = getSqlMapClientTemplate().update("titolario_tree.abatorgenerated_updateByPrimaryKey", record);
        return rows;
    }

    /**
     * This method was generated by Abator for iBATIS.
     * This method corresponds to the database table titolario_tree
     *
     * @abatorgenerated Thu Mar 22 14:59:42 CET 2012
     */
    public TitolarioTree selectByPrimaryKey(Long id) {
        TitolarioTree key = new TitolarioTree();
        key.setId(id);
        TitolarioTree record = (TitolarioTree) getSqlMapClientTemplate().queryForObject("titolario_tree.abatorgenerated_selectByPrimaryKey", key);
        return record;
    }

    /**
     * This method was generated by Abator for iBATIS.
     * This method corresponds to the database table titolario_tree
     *
     * @abatorgenerated Thu Mar 22 14:59:42 CET 2012
     */
    public int deleteByPrimaryKey(Long id) {
        TitolarioTree key = new TitolarioTree();
        key.setId(id);
        int rows = getSqlMapClientTemplate().delete("titolario_tree.abatorgenerated_deleteByPrimaryKey", key);
        return rows;
    }
}