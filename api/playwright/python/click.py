import pyautogui
import sys
import time
import json

def click(x, y, options=None):
    if options is None:
        options = {}
    
    delay = options.get('delay', 0.1)
    
    try:
        # Disable pyautogui failsafe for automation
        pyautogui.FAILSAFE = False
        
        # Move and click
        pyautogui.moveTo(x, y)
        
        pyautogui.click()
        
        # Wait for focus
        time.sleep(delay)
                
        return {"status": "success", "message": "Python Automation completed"}
        
    except Exception as e:
        return {"status": "error", "message": str(e)}

if __name__ == "__main__":
    if len(sys.argv) < 3:
        result = {"status": "error", "message": "Usage: python click.py <x> <y> [options_json]"}
    else:
        x = int(sys.argv[1])
        y = int(sys.argv[2])
        options = json.loads(sys.argv[3]) if len(sys.argv) > 3 else {}
        
        result = click(x, y, options)
    
    print(json.dumps(result))