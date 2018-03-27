@ECHO OFF
REM Watch back-end modules and build

IF "%1" == "!" (
  parcel build src/back/Main.ts --target node
) ELSE (
  parcel watch src/back/Main.ts --target node
)