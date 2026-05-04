@echo off
      setlocal EnableDelayedExpansion

      set API_URL=http://localhost:5000/api/playwright/robot/story
      set PAYLOAD={\"storyName\":\"Buy Vegetables & Fruits\",\"storyheaderID\":36,\"storyID\":\"148\",\"projectID\":88,\"subprojectID\":24,\"userID\":2,\"userName\":\"goffipl\",\"resetLog\":1}

      curl -X POST "%API_URL%" ^
        -H "Content-Type: application/json" ^
        -d "!PAYLOAD!"

      pause
