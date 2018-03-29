@ECHO OFF

IF "%1" == "--pre" (
  CALL node .\tools\install-check-global.js
) ELSE (
  CALL node .\tools\setup.js
  CALL bower install
  CALL pip install psutil
  CALL MKDIR .\dist\pages
)