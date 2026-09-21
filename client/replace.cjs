const fs = require('fs');
const path = require('path');

function replaceInDir(dir) {
    fs.readdirSync(dir).forEach(file => {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            replaceInDir(fullPath);
        } else if (fullPath.endsWith('.ts') || fullPath.endsWith('.tsx') || fullPath.endsWith('.js')) {
            let content = fs.readFileSync(fullPath, 'utf8');
            let originalContent = content;
            
            // Case 1: inside backticks: `http://localhost:5005/api/...`
            content = content.replace(/`http:\/\/localhost:5005([^`]*)/g, '`${import.meta.env.VITE_API_URL}$1');
            
            // Case 2: inside single quotes: 'http://localhost:5005/api/...'
            content = content.replace(/'http:\/\/localhost:5005([^']*)'/g, '`${import.meta.env.VITE_API_URL}$1`');
            
            if (content !== originalContent) {
                fs.writeFileSync(fullPath, content, 'utf8');
                console.log('Updated: ' + fullPath);
            }
        }
    });
}

replaceInDir('D:\\Aganix tech solutions\\NRAPP\\App\\client\\src');
