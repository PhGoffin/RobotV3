const robot = require('kbm-robot');

async function clickAndType(x, y, text) {
    try {
        // Move mouse and click
        robot.mouseMove(x, y);
        robot.mouseClick('left');
        
        // Wait for application to focus
        await new Promise(resolve => setTimeout(resolve, 100));
        
        // Type the text
        robot.typeString(text);
        
    } catch (error) {
        console.error('Automation failed:', error);
        throw error;
    }
}

// Enhanced version with options
async function advancedClickAndType(x, y, text, options = {}) {
    const { 
        delay = 100, 
        clearFirst = false,
        doubleClick = false 
    } = options;
    
    try {
        robot.mouseMove(x, y);
        
        if (doubleClick) {
            robot.mouseClick('left');
            robot.mouseClick('left');
        } else {
            robot.mouseClick('left');
        }
        
        await new Promise(resolve => setTimeout(resolve, delay));
        
        if (clearFirst) {
            robot.keyTap('ctrl+a');
            await new Promise(resolve => setTimeout(resolve, 50));
        }
        
        robot.typeString(text);
        
    } catch (error) {
        console.error('Advanced automation failed:', error);
        throw error;
    }
}

// Usage
(async () => {
    try {
        await clickAndType(500, 300, "Hello World!");
        
        // With options
        await advancedClickAndType(400, 200, "New text", {
            clearFirst: true,
            delay: 200
        });
        
    } catch (error) {
        console.error('Error:', error);
    }
})();