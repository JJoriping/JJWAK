@ECHO OFF
REM Install a package with the related TS package via NPM

IF "%1" == "+" (
  npm i %2
  npm i @types/%2 -D
  EXIT
)
IF "%1" == "-" (
  npm r %2
  npm r @types/%2 -D
  EXIT
)
ECHO Usage: tnpm opt name
ECHO   opt: the operation
ECHO     +: install
ECHO     -: uninstall
ECHO   name: the package name