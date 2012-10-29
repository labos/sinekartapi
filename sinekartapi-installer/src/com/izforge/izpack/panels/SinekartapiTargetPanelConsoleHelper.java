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

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.PrintWriter;
import java.util.Properties;

import com.izforge.izpack.installer.AutomatedInstallData;
import com.izforge.izpack.installer.PanelConsole;
import com.izforge.izpack.installer.PanelConsoleHelper;
import com.izforge.izpack.installer.ScriptParser;
import com.izforge.izpack.util.VariableSubstitutor;

public class SinekartapiTargetPanelConsoleHelper extends PanelConsoleHelper implements PanelConsole
{

    public boolean runGeneratePropertiesFile(AutomatedInstallData installData,PrintWriter printWriter)
    {
        printWriter.println(ScriptParser.INSTALL_PATH + "=");
        return true;
    }

    public boolean runConsoleFromPropertiesFile(AutomatedInstallData installData, Properties p)
    {
        String strTargetPath = p.getProperty(ScriptParser.INSTALL_PATH);
        if (strTargetPath == null || "".equals(strTargetPath.trim()))
        {
            System.err.println("Inputting the target path is mandatory!!!!");
            return false;
        }
        else
        {
            VariableSubstitutor vs = new VariableSubstitutor(installData.getVariables());
            strTargetPath = vs.substitute(strTargetPath, null);
            installData.setInstallPath(strTargetPath);
            return true;
        }
    }

    public boolean runConsole(AutomatedInstallData idata)
    {

        String strTargetPath = "";
        String strDefaultPath = idata.getVariable("SYSTEM_user_dir"); // this is a special
                                                                      // requirement to make the
                                                                      // default path point to the
                                                                      // current location
        System.out.println("Select target path [" + strDefaultPath + "] ");
        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
        try
        {
            String strIn = br.readLine();
            if (!strIn.trim().equals(""))
            {
                strTargetPath = strIn;
            }
            else
            {
                strTargetPath = strDefaultPath;
            }
        }
        catch (IOException e)
        {

            e.printStackTrace();
        }

        VariableSubstitutor vs = new VariableSubstitutor(idata.getVariables());

        strTargetPath = vs.substitute(strTargetPath, null);

        idata.setInstallPath(strTargetPath);
        int i = askEndOfConsolePanel();
        if (i == 1)
        {
            return true;
        }
        else if (i == 2)
        {
            return false;
        }
        else
        {
            return runConsole(idata);
        }

    }
}
