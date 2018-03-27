@ECHO OFF

CALL node .\data\setup.js
CALL bower install
CALL pip install psutil
MKDIR .\dist\pages