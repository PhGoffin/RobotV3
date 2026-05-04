@echo off
    
set API_URL=http://localhost:5000/api/playwright/robot/story

curl -X POST "%API_URL%" ^
  -H "Content-Type: application/json" ^
  --data-binary "@goffipl.json"

pause
    