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

import com.izforge.izpack.gui.IzPanelLayout;
import com.izforge.izpack.gui.LabelFactory;
import com.izforge.izpack.installer.InstallData;
import com.izforge.izpack.installer.InstallerFrame;
import com.izforge.izpack.installer.IzPanel;
import com.izforge.izpack.util.Log;
import com.izforge.izpack.util.VariableSubstitutor;

import java.io.File;

public class SinekartapiFinishPanel extends IzPanel
{

    /**
     *
     */
    private static final long serialVersionUID = 3689911781942572085L;

    /**
     * The variables substitutor.
     */
    private VariableSubstitutor vs;

    /**
     * The constructor.
     *
     * @param parent The parent.
     * @param idata  The installation data.
     */
    public SinekartapiFinishPanel(InstallerFrame parent, InstallData idata)
    {
        super(parent, idata, new IzPanelLayout());
        vs = new VariableSubstitutor(idata.getVariables());
        add(createLabel("info1", "SinekartaFinishPanel", "finish",
                LEFT, true), NEXT_LINE);
        add(IzPanelLayout.createParagraphGap());
        add(createLabel("info2", "SinekartaFinishPanel", "finish",
                LEFT, true), NEXT_LINE);
   }

    /**
     * Indicates wether the panel has been validated or not.
     *
     * @return true if the panel has been validated.
     */
    public boolean isValidated()
    {
        return true;
    }

    /**
     * Called when the panel becomes active.
     */
    public void panelActivate()
    {
        parent.lockNextButton();
        parent.lockPrevButton();
        parent.setQuitButtonText(parent.langpack.getString("FinishPanel.done"));
        parent.setQuitButtonIcon("done");
        if (idata.installSuccess)
        {

            // We set the information
            add(LabelFactory.create(parent.icons.getImageIcon("check")));
            add(IzPanelLayout.createVerticalStrut(5));
            add(LabelFactory.create(parent.langpack.getString("FinishPanel.success"),
                    parent.icons.getImageIcon("preferences"), LEADING), NEXT_LINE);
            add(IzPanelLayout.createVerticalStrut(5));
            if (idata.uninstallOutJar != null)
            {
                // We prepare a message for the uninstaller feature
                String path = translatePath("$INSTALL_PATH") + File.separator + "Uninstaller";

                add(LabelFactory.create(parent.langpack
                        .getString("FinishPanel.uninst.info"), parent.icons
                        .getImageIcon("preferences"), LEADING), NEXT_LINE);
                add(LabelFactory.create(path, parent.icons.getImageIcon("empty"),
                        LEADING), NEXT_LINE);
            }
        }
        else
        {
            add(LabelFactory.create(parent.langpack.getString("FinishPanel.fail"),
                    parent.icons.getImageIcon("stop"), LEADING));
        }
        getLayoutHelper().completeLayout(); // Call, or call not?
        Log.getInstance().informUser();
    }

    /**
     * Translates a relative path to a local system path.
     *
     * @param destination The path to translate.
     * @return The translated path.
     */
    private String translatePath(String destination)
    {
        // Parse for variables
        destination = vs.substitute(destination, null);

        // Convert the file separator characters
        return destination.replace('/', File.separatorChar);
    }
}
