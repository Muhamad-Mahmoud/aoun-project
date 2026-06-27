const fs = require('fs');
const path = require('path');

const targetDirs = [
    path.join(__dirname, 'src/app/dashboard'),
    path.join(__dirname, 'src/features'),
    path.join(__dirname, 'src/shared')
];

function replaceSecondary(content) {
    // Force absolute unification for the user
    // Replace all remaining 'secondary' (which is Amber in our CSS) with 'primary' (Teal).
    content = content.replace(/bg-secondary/g, 'bg-primary');
    content = content.replace(/text-secondary/g, 'text-primary');
    content = content.replace(/border-secondary/g, 'border-primary');
    content = content.replace(/ring-secondary/g, 'ring-primary');
    content = content.replace(/from-secondary/g, 'from-primary');
    content = content.replace(/to-secondary/g, 'to-primary');
    
    // Fix specific cases shown in screenshots:
    // Donations page: Orange header
    content = content.replace(/text-amber-700/g, 'text-primary');
    content = content.replace(/bg-amber-50/g, 'bg-primary/10');
    content = content.replace(/border-amber-100/g, 'border-primary/20');
    content = content.replace(/text-amber-500/g, 'text-primary');
    
    // Fix Approved page: Red side borders on cards (highly confusing semantic)
    content = content.replace(/w-1.5 h-full \$\{request.aiNeedLevel === 'High' \? 'bg-red-500' : request.aiNeedLevel === 'Medium' \? 'bg-amber-500' : request.aiNeedLevel === 'Low' \? 'bg-green-500' : 'bg-green-500'\}/g, "w-1.5 h-full bg-primary");
    content = content.replace(/bg-green-500\/30/g, "bg-primary/30");
    content = content.replace(/text-green-700/g, "text-primary");
    content = content.replace(/bg-green-100/g, "bg-primary/10");
    content = content.replace(/bg-green-50/g, "bg-primary/5");
    content = content.replace(/border-green-500\/30/g, "border-primary/30");

    // Replace the specific red AI tag in Approved page to use primary if it's already approved
    content = content.replace(/request.aiNeedLevel === 'High' \? 'bg-red-50 text-red-700 border-red-200'/g, "request.aiNeedLevel === 'High' ? 'bg-primary/10 text-primary border-primary/20'");
    
    return content;
}

function processFile(filePath) {
    if (fs.existsSync(filePath)) {
        let content = fs.readFileSync(filePath, 'utf8');
        let newContent = replaceSecondary(content);
        if (content !== newContent) {
            fs.writeFileSync(filePath, newContent, 'utf8');
        }
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
console.log('Final complete unification done.');
