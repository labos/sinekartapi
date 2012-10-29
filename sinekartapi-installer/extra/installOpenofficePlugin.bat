set CUR=%CD%
cd "%1\openoffice\App\openoffice\program"
set SYSUSERCONFIG=..\..\..\settings\user
unopkg.com remove -v -f --shared com.sun.star.PDFImport-windows_x86
unopkg.com add -v -f --shared --log-file "%1\sinekarta\extra\uno.log" "%1\sinekarta\extra\oracle-pdfimport.oxt" >"%1\sinekarta\extra\sysout.log" 2>"%1\sinekarta\extra\syserr.log" < "%1\sinekarta\extra\confirm.txt"
IF %ERRORLEVEL% NEQ 0 goto ko
goto end
:ko
echo l'installazione del plugin potrebbe essere andata male
cd %CUR%
rem exit /B 12
:end
cd %CUR%
