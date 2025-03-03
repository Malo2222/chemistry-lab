@echo off
echo Creating package for Chemistry Lab Simulation...

:: Create a temporary directory for packaging
mkdir temp_package 2>nul
cd temp_package

:: Copy the built files
echo Copying built files...
xcopy /E /I /Y ..\dist\* .

:: Create a launcher script
echo Creating launcher...
echo @echo off > StartChemistryLab.bat
echo echo Starting Chemistry Lab Simulation... >> StartChemistryLab.bat
echo start http://localhost:8000 >> StartChemistryLab.bat
echo python -m http.server 8000 >> StartChemistryLab.bat

:: Create a README
echo Creating README...
echo Chemistry Lab Simulation > README.txt
echo. >> README.txt
echo To run the application: >> README.txt
echo 1. Double-click StartChemistryLab.bat >> README.txt
echo 2. The application will open in your default web browser >> README.txt
echo. >> README.txt
echo Requirements: >> README.txt
echo - Python 3.x (for the local server) >> README.txt
echo - Modern web browser >> README.txt

:: Create a zip file
echo Creating zip file...
powershell Compress-Archive -Path * -DestinationPath ..\ChemistryLab.zip -Force

:: Clean up
cd ..
rmdir /S /Q temp_package

echo.
echo Package created successfully!
echo You can now use IExpress to create an installer:
echo 1. Open IExpress
echo 2. Choose "Create new Self Extraction Directive file"
echo 3. Select "Extract files and run an installation command"
echo 4. Set the package title to "Chemistry Lab Simulation"
echo 5. Choose "No prompt"
echo 6. Set the display license to "Do not display license"
echo 7. Add ChemistryLab.zip as the packaged file
echo 8. Set the install program to: cmd /c "powershell -Command "Expand-Archive -Path ChemistryLab.zip -DestinationPath . -Force" && StartChemistryLab.bat"
echo 9. Choose "Hidden"
echo 10. Set "Do not save" for temporary files
echo 11. Choose "No message"
echo 12. Set the output file name and location
echo 13. Choose "No restart"
echo 14. Save the SED file and create the package
echo.
pause 