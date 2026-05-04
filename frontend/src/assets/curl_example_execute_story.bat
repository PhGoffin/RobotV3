
@echo off

curl -X POST "http://localhost:5000/api/playwright/robot/story" ^
  -H "Content-Type: application/json" ^
  -d @"C:\Apache24\htdocs\robotv3\frontend\src\assets\payload.json"

