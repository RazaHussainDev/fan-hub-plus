@echo off
REM ═══════════════════════════════════════════════════════════════════
REM Fan Hub Plus — Intro Video Compressor
REM Run this once to create a mobile-optimized version of intro.mp4
REM Requirements: FFmpeg installed (https://ffmpeg.org/download.html)
REM ═══════════════════════════════════════════════════════════════════

echo [Fan Hub+] Compressing intro.mp4 for mobile...

REM Check if FFmpeg is available
where ffmpeg >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo [ERROR] FFmpeg not found. Download from: https://www.gyan.dev/ffmpeg/builds/
    echo Install it and add to PATH, then re-run this script.
    pause
    exit /b 1
)

REM Compress for desktop (720p, H.264 baseline, optimized for web streaming)
ffmpeg -i client\public\intro.mp4 ^
  -vcodec libx264 ^
  -crf 28 ^
  -preset fast ^
  -vf "scale=1280:720:force_original_aspect_ratio=decrease,pad=1280:720:(ow-iw)/2:(oh-ih)/2" ^
  -acodec aac ^
  -b:a 96k ^
  -movflags +faststart ^
  -y ^
  client\public\intro_compressed.mp4

echo [Fan Hub+] Done! intro_compressed.mp4 created.
echo [Fan Hub+] Rename it to intro.mp4 to use it.

pause
