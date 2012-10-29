/*
 * Copyright (C) 2011 - 2012 T Logic.
 *
 * This file is part of SinekartaPI
 *
 * Sinekarta PI is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Sinekarta PI is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 */


package com.izforge.izpack.panels;

import com.izforge.izpack.adaptator.IXMLElement;
import com.izforge.izpack.installer.InstallData;
import com.izforge.izpack.installer.InstallerFrame;

public class SinekartapiTargetPanel extends SinekartapiPathInputPanel
{

    /**
     *
     */
    private static final long serialVersionUID = 3256443616359429170L;

    /**
     * The constructor.
     *
     * @param parent The parent window.
     * @param idata  The installation data.
     */
    public SinekartapiTargetPanel(InstallerFrame parent, InstallData idata)
    {
        super(parent, idata);
        // load the default directory info (if present)
        loadDefaultInstallDir(parent, idata);
        if (getDefaultInstallDir() != null)
        {
            // override the system default that uses app name (which is set in
            // the Installer class)
            idata.setInstallPath(getDefaultInstallDir());
        }
    }

    /**
     * Called when the panel becomes active.
     */
    public void panelActivate()
    {
        // Resolve the default for chosenPath
        super.panelActivate();
        // Set the default or old value to the path selection panel.
        pathSelectionPanel.setPath(idata.getInstallPath());
    }

    /**
     * This method simple delegates to <code>PathInputPanel.loadDefaultInstallDir</code> with the
     * current parent as installer frame.
     */
    public void loadDefaultDir()
    {
        super.loadDefaultInstallDir(parent, idata);
    }

    /**
     * Indicates wether the panel has been validated or not.
     *
     * @return Wether the panel has been validated or not.
     */
    public boolean isValidated()
    {
        // Standard behavior of PathInputPanel.
        if (!super.isValidated())
        {
            return (false);
        }
        idata.setInstallPath(pathSelectionPanel.getPath());
        return (true);
    }

    /**
     * Returns the default install directory. This is equal to
     * <code>PathInputPanel.getDefaultInstallDir</code>
     *
     * @return the default install directory
     */
    public String getDefaultDir()
    {
        return getDefaultInstallDir();
    }

    /**
     * Sets the default install directory to the given String. This is equal to
     * <code>PathInputPanel.setDefaultInstallDir</code>
     *
     * @param defaultDir path to be used for the install directory
     */
    public void setDefaultDir(String defaultDir)
    {
        setDefaultInstallDir(defaultDir);
    }

    /**
     * Asks to make the XML panel data.
     *
     * @param panelRoot The tree to put the data in.
     */
    public void makeXMLData(IXMLElement panelRoot)
    {
        new SinekartapiTargetPanelAutomationHelper().makeXMLData(idata, panelRoot);
    }

    /*
     * (non-Javadoc)
     * 
     * @see com.izforge.izpack.installer.IzPanel#getSummaryBody()
     */
    public String getSummaryBody()
    {
        return (idata.getInstallPath());
    }

}
