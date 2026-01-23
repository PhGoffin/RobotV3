const { spawn } = require('child_process');
const path = require('path');

class DesktopAutomator {
    constructor() {
        this.pythonScript = path.join(__dirname, 'click.py');
    }
    
    async click(x, y) {
            console.log ('____ click 1')

        return new Promise((resolve, reject) => {
            const args = [this.pythonScript, x.toString(), y.toString()];
            
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
        await automator.click(500, 300);
        console.log('Click with python completed');

        // With options
        await automator.click(400, 200, {
            delay: 0.2
        });        
        
    } catch (error) {
        console.error('Python Automation failed:', error);
    }
}

// main();