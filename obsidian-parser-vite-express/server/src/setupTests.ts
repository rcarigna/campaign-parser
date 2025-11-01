// Jest setup to polyfill punycode module
// This fixes the markdown-it compatibility issue in Jest environment

const fs = require('fs');
const path = require('path');

// Create a minimal punycode file that Jest can find
const punycodeContent = `
// Polyfill for punycode in Jest environment
module.exports = require('punycode');
`;

const punycodeFilePath = path.join(__dirname, '../../punycode');

// Only create the file if it doesn't exist and we're in Jest environment
if (process.env.NODE_ENV === 'test' || process.env.JEST_WORKER_ID !== undefined) {
    try {
        if (!fs.existsSync(punycodeFilePath)) {
            fs.writeFileSync(punycodeFilePath, punycodeContent);

            // Clean up after tests complete
            process.on('exit', () => {
                try {
                    if (fs.existsSync(punycodeFilePath)) {
                        fs.unlinkSync(punycodeFilePath);
                    }
                } catch (e) {
                    // Ignore cleanup errors
                }
            });
        }
    } catch (e: unknown) {
        // If we can't create the file, that's OK - tests might still work
        console.warn('Could not create punycode polyfill:', e instanceof Error ? e.message : String(e));
    }
}