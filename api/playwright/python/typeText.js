const { spawn } = require('child_process');
const path = require('path');

class DesktopAutomator {
    constructor() {
        this.pythonScript = path.join(__dirname, 'typeText.py');
    }
    
    async typeText(text, options = {}) {
        return new Promise((resolve, reject) => {
            const optionsJson = JSON.stringify(options);
            const args = [this.pythonScript, text, optionsJson];
            
            const python = spawn('python', args);
            let output = '';
            let error = '';
            
            python.stdout.on('data', (data) => {
                output += data.toString();
            });
            
            python.stderr.on('data', (data) => {
                error += data.toString();
            });
            
            python.on('close', (code) => {
                if (code !== 0) {
                    reject(new Error(`Python script failed: ${error}`));
                    return;
                }
                
                try {
                    const result = JSON.parse(output.trim());
                    if (result.status === 'success') {
                        resolve(result);
                    } else {
                        reject(new Error(result.message));
                    }
                } catch (parseError) {
                    reject(new Error(`Failed to parse Python output: ${output}`));
                }
            });
        });
    }
}

// Usage
async function main() {
    const automator = new DesktopAutomator();
    
    try {
        // Simple usage
        await automator.typeText("Hello my World");
        console.log('First automation completed');
        
        // With options
        // await automator.typeText("New text", {
        //     delay: 0.2,
        //     clearFirst: true
        // });
        // console.log('Second automation completed');
        
    } catch (error) {
        console.error('Automation failed:', error);
    }
}

main();