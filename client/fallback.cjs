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
            
            content = content.replace(/\$\{import\.meta\.env\.VITE_API_URL\}/g, "${import.meta.env.VITE_API_URL || 'http://localhost:5005'}");
            
            if (content !== originalContent) {
                fs.writeFileSync(fullPath, content, 'utf8');
                console.log('Updated fallback: ' + fullPath);
            }
        }
    });
}

replaceInDir('D:\\Aganix tech solutions\\NRAPP\\App\\client\\src');
