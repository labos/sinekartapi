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

import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.io.BufferedReader;
import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;

import com.izforge.izpack.gui.IzPanelLayout;
import com.izforge.izpack.installer.InstallData;
import com.izforge.izpack.installer.InstallerFrame;
import com.izforge.izpack.installer.IzPanel;
import com.izforge.izpack.installer.ResourceNotFoundException;
import com.izforge.izpack.util.AbstractUIHandler;
import com.izforge.izpack.util.Debug;
import com.izforge.izpack.util.IoHelper;
import com.izforge.izpack.util.OsVersion;
import com.izforge.izpack.util.VariableSubstitutor;

public class SinekartapiPathInputPanel extends IzPanel implements ActionListener
{

    /**
     *
     */
    private static final long serialVersionUID = 3257566217698292531L;

    /**
     * Files which should be exist
     */
    protected String[] existFiles = null;

    /** The path which was chosen */
    // protected String chosenPath;
    /**
     * The path selection sub panel
     */
    protected SinekartapiPathSelectionPanel pathSelectionPanel;

    protected String warnMsg1;

    protected String warnMsg2;

    protected String warnMsg3;

    protected static String defaultInstallDir = null;

    /**
     * The constructor.
     *
     * @param parent The parent window.
     * @param idata  The installation data.
     */
    public SinekartapiPathInputPanel(InstallerFrame parent, InstallData idata)
    {
        super(parent, idata, new IzPanelLayout());
        // Set default values
        warnMsg1 = getI18nStringForClass("warn1", "SinekartaTargetPanel");
        warnMsg2 = getI18nStringForClass("warn2", "SinekartaTargetPanel");
        warnMsg3 = getI18nStringForClass("warn3", "SinekartaTargetPanel");

        String introText = getI18nStringForClass("extendedIntro", "PathInputPanel");
        if (introText == null || introText.endsWith("extendedIntro")
                || introText.indexOf('$') > -1)
        {
            introText = getI18nStringForClass("intro", "PathInputPanel");
            if (introText == null || introText.endsWith("intro"))
            {
                introText = "";
            }
        }
        // Intro
        // row 0 column 0
        add(createMultiLineLabel(introText));

        add(IzPanelLayout.createParagraphGap());

        // Label for input
        // row 1 column 0.
        add(createLabel("info", "SinekartaTargetPanel", "open",
                LEFT, true), NEXT_LINE);
        // Create path selection components and add they to this panel.
        pathSelectionPanel = new SinekartapiPathSelectionPanel(this, idata);
        add(pathSelectionPanel, NEXT_LINE);
        createLayoutBottom();
        getLayoutHelper().completeLayout();
    }

    /**
     * This method does nothing. It is called from ctor of PathInputPanel, to give in a derived
     * class the possibility to add more components under the path input components.
     */
    public void createLayoutBottom()
    {
        // Derived classes implements additional elements.
    }

    /**
     * Actions-handling method.
     *
     * @param e The event.
     */
    public void actionPerformed(ActionEvent e)
    {
        Object source = e.getSource();
        if (source == pathSelectionPanel.getPathInputField())
        {
            parent.navigateNext();
        }

    }

    /**
     * Indicates wether the panel has been validated or not.
     *
     * @return Wether the panel has been validated or not.
     */
    public boolean isValidated()
    {
        String chosenPath = pathSelectionPanel.getPath();
        boolean ok = true;

        // installation directory has to exist in a modification installation
        // We put a warning if the specified target is nameless
        if (chosenPath.length() == 0)
        {
            emitError(parent.langpack.getString("installer.error"), parent.langpack
                    .getString("PathInputPanel.required"));
            return false;
        }
        if (!ok)
        {
            return ok;
        }

        // Expand unix home reference
        if (chosenPath.startsWith("~"))
        {
            String home = System.getProperty("user.home");
            chosenPath = home + chosenPath.substring(1);
        }

        // Normalize the path
        File path = new File(chosenPath).getAbsoluteFile();
        chosenPath = path.toString();
        pathSelectionPanel.setPath(chosenPath);
        if (!path.exists())
        {
            emitError(parent.langpack.getString("installer.error"), parent.langpack
                    .getString(getI18nStringForClass("required", "PathInputPanel")));
            return false;
        }
        if (!pathIsValid())
        {
            emitError(parent.langpack.getString("installer.error"), parent.langpack
                    .getString(getI18nStringForClass("notValid", "PathInputPanel")));
            return false;
        }
        File pathAlfresco = new File(chosenPath + "\\bin\\alfresco-bm.jar").getAbsoluteFile();
        if (!pathAlfresco.exists())
        {
            emitError(parent.langpack.getString("installer.error"), warnMsg1);
            return false;
        }
        File pathAlfrescoExec = new File(chosenPath + "\\tomcat\\webapps\\alfresco\\WEB-INF\\web.xml").getAbsoluteFile();
        if (!pathAlfrescoExec.exists())
        {
            emitError(parent.langpack.getString("installer.error"), warnMsg2);
            return false;
        }
        File pathSinekarta = new File(chosenPath + "\\tomcat\\webapps\\alfresco\\WEB-INF\\lib\\sinekartapi-libs-1.0.0-SNAPSHOT.jar").getAbsoluteFile();
        if (pathSinekarta.exists())
        {
	        int res = askQuestion(parent.langpack.getString("installer.warning"), warnMsg3, AbstractUIHandler.CHOICES_YES_NO, AbstractUIHandler.ANSWER_YES);
	        ok = res == AbstractUIHandler.ANSWER_YES;
        }
        return ok;
    }

    /**
     * Returns whether the chosen path is true or not. If existFiles are not null, the existence of
     * it under the choosen path are detected. This method can be also implemented in derived
     * classes to handle special verification of the path.
     *
     * @return true if existFiles are exist or not defined, else false
     */
    protected boolean pathIsValid()
    {
        if (existFiles == null)
        {
            return true;
        }
        for (String existFile : existFiles)
        {
            File path = new File(pathSelectionPanel.getPath(), existFile).getAbsoluteFile();
            if (!path.exists())
            {
                return false;
            }
        }
        return true;
    }

    /**
     * Returns the array of strings which are described the files which must exist.
     *
     * @return paths of files which must exist
     */
    public String[] getExistFiles()
    {
        return existFiles;
    }

    /**
     * Sets the paths of files which must exist under the chosen path.
     *
     * @param strings paths of files which must exist under the chosen path
     */
    public void setExistFiles(String[] strings)
    {
        existFiles = strings;
    }

    /**
     * Loads up the "dir" resource associated with TargetPanel. Acceptable dir resource names:
     * <code>
     * TargetPanel.dir.macosx
     * TargetPanel.dir.mac
     * TargetPanel.dir.windows
     * TargetPanel.dir.unix
     * TargetPanel.dir.xxx,
     * where xxx is the lower case version of System.getProperty("os.name"),
     * with any spaces replace with underscores
     * TargetPanel.dir (generic that will be applied if none of above is found)
     * </code>
     * As with all IzPack resources, each the above ids should be associated with a separate
     * filename, which is set in the install.xml file at compile time.
     */
    public static void loadDefaultInstallDir(InstallerFrame parentFrame, InstallData idata)
    {
        // Load only once ...
        if (getDefaultInstallDir() != null)
        {
            return;
        }
        BufferedReader br = null;
        try
        {
            InputStream in = null;
            String os = System.getProperty("os.name");
            // first try to look up by specific os name
            os = os.replace(' ', '_'); // avoid spaces in file names
            os = os.toLowerCase(); // for consistency among TargetPanel res
            // files
            try
            {
                in = parentFrame.getResource("SinekartaTargetPanel.dir.".concat(os));
            }
            catch (ResourceNotFoundException rnfe)
            {
            }
            if (in == null)
            {
                if (OsVersion.IS_WINDOWS)
                {
                    try
                    {
                        in = parentFrame.getResource("SinekartaTargetPanel.dir.windows");
                    }
                    catch (ResourceNotFoundException rnfe)
                    {
                    }//it's usual, that the resource does not exist
                }
                else if (OsVersion.IS_OSX)
                {
                    try
                    {
                        in = parentFrame.getResource("SinekartaTargetPanel.dir.macosx");
                    }
                    catch (ResourceNotFoundException rnfe)
                    {
                    }//it's usual, that the resource does not exist
                }
                else
                {
                    try
                    {
                        in = parentFrame.getResource("SinekartaTargetPanel.dir.unix");
                    }
                    catch (ResourceNotFoundException eee)
                    {
                    }//it's usual, that the resource does not exist
                }
            }

            // if all above tests failed, there is no resource file,
            // so use system default
            if (in == null)
            {
                try
                {
                    in = parentFrame.getResource("SinekartaTargetPanel.dir");
                }
                catch (ResourceNotFoundException eee)
                {
                }
            }

            if (in != null)
            {
                // now read the file, once we've identified which one to read
                InputStreamReader isr = new InputStreamReader(in);
                br = new BufferedReader(isr);
                String line;
                while ((line = br.readLine()) != null)
                {
                    line = line.trim();
                    // use the first non-blank line
                    if (!"".equals(line))
                    {
                        break;
                    }
                }
                defaultInstallDir = line;
                VariableSubstitutor vs = new VariableSubstitutor(idata.getVariables());
                defaultInstallDir = vs.substitute(defaultInstallDir, null);
            }
        }
        catch (Exception e)
        {
            //mar: what's the common way to log an exception ?
            e.printStackTrace();
            defaultInstallDir = null;
            // leave unset to take the system default set by Installer class
        }
        finally
        {
            try
            {
                if (br != null)
                {
                    br.close();
                }
            }
            catch (IOException ignored)
            {
            }
        }
    }

    /**
     * This method determines whether the chosen dir is writeable or not.
     *
     * @return whether the chosen dir is writeable or not
     */
    public boolean isWriteable()
    {
        File existParent = IoHelper.existingParent(new File(pathSelectionPanel.getPath()));
        if (existParent == null)
        {
            return false;
        }
        // On windows we cannot use canWrite because
        // it looks to the dos flags which are not valid
        // on NT or 2k XP or ...
        if (OsVersion.IS_WINDOWS)
        {
            File tmpFile;
            try
            {
                tmpFile = File.createTempFile("izWrTe", ".tmp", existParent);
                tmpFile.deleteOnExit();
            }
            catch (IOException e)
            {
                Debug.trace(e.toString());
                return false;
            }
            return true;
        }
        return existParent.canWrite();
    }

    /**
     * Returns the default for the installation directory.
     *
     * @return the default for the installation directory
     */
    public static String getDefaultInstallDir()
    {
        return defaultInstallDir;
    }

    /**
     * Sets the default for the installation directory to the given string.
     *
     * @param string path for default for the installation directory
     */
    public static void setDefaultInstallDir(String string)
    {
        defaultInstallDir = string;
    }

}
