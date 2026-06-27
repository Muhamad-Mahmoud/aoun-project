const fs = require('fs');
const path = require('path');

const targetDirs = [
    path.join(__dirname, 'src/shared/components/layout'),
    path.join(__dirname, 'src/app/dashboard')
];

function replaceSecondary(content) {
    // Replace structural 'secondary' classes with 'primary' to unify the layout
    // We only do this for layout elements like sidebars and topbars.
    // Wait, let's just do it for Sidebars explicitly, as they dictate the app's navigation brand.
    
    // Instead of doing it everywhere and ruining 'secondary' buttons, I'll do it carefully.
    return content;
}

function processFile(filePath) {
    if (fs.existsSync(filePath)) {
        let content = fs.readFileSync(filePath, 'utf8');
        
        // If it's a Sidebar or TopBar, we want it to use Primary instead of Secondary for its main active states.
        if (filePath.includes('Sidebar') || filePath.includes('TopBar') || filePath.includes('DashboardLayout')) {
            content = content.replace(/text-secondary/g, 'text-primary');
            content = content.replace(/bg-secondary/g, 'bg-primary');
            content = content.replace(/border-secondary/g, 'border-primary');
            content = content.replace(/from-secondary/g, 'from-primary');
            content = content.replace(/to-secondary/g, 'to-primary');
            content = content.replace(/ring-secondary/g, 'ring-primary');
        }
        
        fs.writeFileSync(filePath, content, 'utf8');
    }
}

function traverseDir(dir) {
    if (!fs.existsSync(dir)) return;
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            traverseDir(fullPath);
        } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
            processFile(fullPath);
        }
    }
}

targetDirs.forEach(traverseDir);
console.log('Fixed Sidebars to use Primary color.');
