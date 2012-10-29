package it.tlogic.aoo.dao;

import it.tlogic.aoo.model.Titolario;

public interface TitolarioDAO {
    /**
     * This method was generated by Abator for iBATIS.
     * This method corresponds to the database table titolario
     *
     * @abatorgenerated Wed Mar 21 17:27:12 CET 2012
     */
    void insert(Titolario record);

    /**
     * This method was generated by Abator for iBATIS.
     * This method corresponds to the database table titolario
     *
     * @abatorgenerated Wed Mar 21 17:27:12 CET 2012
     */
    int updateByPrimaryKey(Titolario record);

    /**
     * This method was generated by Abator for iBATIS.
     * This method corresponds to the database table titolario
     *
     * @abatorgenerated Wed Mar 21 17:27:12 CET 2012
     */
    int updateByPrimaryKeySelective(Titolario record);

    /**
     * This method was generated by Abator for iBATIS.
     * This method corresponds to the database table titolario
     *
     * @abatorgenerated Wed Mar 21 17:27:12 CET 2012
     */
    Titolario selectByPrimaryKey(Long id);

    /**
     * This method was generated by Abator for iBATIS.
     * This method corresponds to the database table titolario
     *
     * @abatorgenerated Wed Mar 21 17:27:12 CET 2012
     */
    int deleteByPrimaryKey(Long id);
}