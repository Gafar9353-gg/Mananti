const fs = require('fs');
const path = require('path');

function replaceInDir(dir) {
    fs.readdirSync(dir).forEach(file => {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            replaceInDir(fullPath);
        } else if (fullPath.endsWith('.tsx')) {
            let content = fs.readFileSync(fullPath, 'utf8');
            let originalContent = content;
            
            // Add overflow-x-auto to table containers
            content = content.replace(/className="bg-white rounded-2xl shadow-sm border border-slate-200">(\s*)<table/g, 'className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-x-auto overflow-y-hidden">\n$1<table');
            content = content.replace(/className="bg-white rounded-xl shadow-sm border border-slate-200">(\s*)<table/g, 'className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-x-auto overflow-y-hidden">\n$1<table');
            
            // Fix PatientDetail layout issues on mobile
            // Change fixed grids to responsive grids
            content = content.replace(/className="grid grid-cols-2 gap-6"/g, 'className="grid grid-cols-1 md:grid-cols-2 gap-6"');
            content = content.replace(/className="grid grid-cols-3 gap-6"/g, 'className="grid grid-cols-1 md:grid-cols-3 gap-6"');
            content = content.replace(/className="grid grid-cols-4 gap-4"/g, 'className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4"');
            content = content.replace(/className="grid grid-cols-3 gap-4 mb-6"/g, 'className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6"');
            
            // Update Dashboard responsive cards
            content = content.replace(/className="grid grid-cols-4 gap-6 mb-8"/g, 'className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"');
            content = content.replace(/className="grid grid-cols-3 gap-8"/g, 'className="grid grid-cols-1 lg:grid-cols-3 gap-8"');
            
            if (content !== originalContent) {
                fs.writeFileSync(fullPath, content, 'utf8');
                console.log('Updated responsiveness: ' + fullPath);
            }
        }
    });
}

replaceInDir('D:\\Aganix tech solutions\\NRAPP\\App\\client\\src\\pages');
