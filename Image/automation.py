import pyautogui
import sys
import time
import json

def click_and_type(x, y, text, options=None):
    if options is None:
        options = {}
    
    delay = options.get('delay', 0.1)
    clear_first = options.get('clearFirst', False)
    double_click = options.get('doubleClick', False)
    
    try:
        # Disable pyautogui failsafe for automation
        pyautogui.FAILSAFE = False
        
        # Move and click
        pyautogui.moveTo(x, y)
        
        if double_click:
            pyautogui.doubleClick()
        else:
            pyautogui.click()
        
        # Wait for focus
        time.sleep(delay)
        
        # Clear existing text if requested
        if clear_first:
            pyautogui.hotkey('ctrl', 'a')
            time.sleep(0.05)
        
        # Type text
        pyautogui.typewrite(text)
        
        return {"status": "success", "message": "Automation completed"}
        
    except Exception as e:
        return {"status": "error", "message": str(e)}

if __name__ == "__main__":
    if len(sys.argv) < 4:
        result = {"status": "error", "message": "Usage: python automation.py <x> <y> <text> [options_json]"}
    else:
        x = int(sys.argv[1])
        y = int(sys.argv[2])
        text = sys.argv[3]
        options = json.loads(sys.argv[4]) if len(sys.argv) > 4 else {}
        
        result = click_and_type(x, y, text, options)
    
    print(json.dumps(result))