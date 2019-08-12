@ECHO OFF

IF "%1" == "--pre" (
  CALL node .\tools\install-check-global.js
) ELSE (
  CALL node .\tools\setup.js
  CALL pip install psutil
  IF NOT EXIST ".\dist\pages" CALL MKDIR -p .\dist\pages
)