@echo off
cls
echo [Orion Assistant Dev Menu]
npx electron-packager "X:\Projects\NodeJS\Orion-Assistant" "launcher" --icon="X:\Projects\NodeJS\Orion-Assistant\Data\Images\logo.ico" --platform=win32 --arch=ia32 --prune=true --out=release-builds
pause