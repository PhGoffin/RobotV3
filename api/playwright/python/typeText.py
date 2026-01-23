import pyautogui
import sys
import time
import json

def type_text(text, options=None):
    if options is None:
        options = {}
    
    delay = options.get('delay', 0.1)
    clear_first = options.get('clearFirst', False)
    
    try:
        # Disable pyautogui failsafe for automation
        pyautogui.FAILSAFE = False
                
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
    if len(sys.argv) < 2:
        result = {"status": "error", "message": "Usage: python typeText.py <text> [options_json]"}
    else:
        text = sys.argv[1]
        options = json.loads(sys.argv[2]) if len(sys.argv) > 2 else {}
        
        result = type_text(text, options)
    
    print(json.dumps(result))