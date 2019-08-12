@ECHO OFF
REM Watch back-end modules and build

IF "%1" == "!" (
  webpack -p --config .\tools\webpack.back.config.js
) ELSE (
  webpack -d --watch --config .\tools\webpack.back.config.js
)