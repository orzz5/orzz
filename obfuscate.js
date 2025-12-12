// Code Obfuscation and Protection Layer

// Simple obfuscation function for production
const obfuscateCode = (code) => {
    // Basic obfuscation techniques
    let obfuscated = code
        // Remove comments
        .replace(/\/\*[\s\S]*?\*\//g, '')
        .replace(/\/\/.*$/gm, '')
        // Remove extra whitespace
        .replace(/\s+/g, ' ')
        // Replace variable names with random ones (basic)
        .replace(/\b(let|const|var)\s+([a-zA-Z_$][a-zA-Z0-9_$]*)/g, (match, keyword, name) => {
            if (name.startsWith('_') || name.includes('Config') || name.includes('Secret')) {
                return match; // Keep important names
            }
            return `${keyword} _${Math.random().toString(36).substr(2, 9)}`;
        })
        // Minify
        .trim();
    
    return obfuscated;
};

// Environment-based code serving
const serveProtectedCode = (req, res, filePath) => {
    const fs = require('fs');
    
    if (process.env.NODE_ENV === 'production') {
        // Serve obfuscated code in production
        try {
            const originalCode = fs.readFileSync(filePath, 'utf8');
            const obfuscatedCode = obfuscateCode(originalCode);
            
            res.setHeader('Content-Type', 'application/javascript');
            res.setHeader('X-Content-Type-Options', 'nosniff');
            res.setHeader('X-Frame-Options', 'DENY');
            res.send(obfuscatedCode);
        } catch (error) {
            res.status(500).send('Error loading protected code');
        }
    } else {
        // Serve original code in development
        res.sendFile(filePath);
    }
};

// Anti-debugging measures
const antiDebugCode = `
    // Anti-debugging protection
    (function() {
        var _0x1a2b = function() {
            var _0x3c4d = ['debugger', 'devtools', 'console', 'log', 'warn', 'error'];
            for (var i = 0; i < _0x3c4d.length; i++) {
                if (window[_0x3c4d[i]]) {
                    window[_0x3c4d[i]] = function() {};
                }
            }
            
            // Detect devtools
            var devtools = /./;
            devtools.toString = function() {
                this.open = function() {
                    window.location.href = 'about:blank';
                };
                return '';
            };
            
            setInterval(function() {
                devtools.toString();
            }, 1000);
        };
        
        if (window.location.protocol !== 'file:') {
            _0x1a2b();
        }
    })();
    
    // Disable right click and F12
    document.addEventListener('contextmenu', function(e) {
        e.preventDefault();
        return false;
    });
    
    document.addEventListener('keydown', function(e) {
        if (e.key === 'F12' || (e.ctrlKey && e.shiftKey && e.key === 'I')) {
            e.preventDefault();
            return false;
        }
    });
`;

// Content Security Policy for inline scripts
const cspNonce = () => {
    return Math.random().toString(36).substr(2, 16);
};

module.exports = {
    obfuscateCode,
    serveProtectedCode,
    antiDebugCode,
    cspNonce
};
