const fs = require('fs');
const path = require('path');

const targetDirs = [
    path.join(__dirname, 'src/app/dashboard'),
    path.join(__dirname, 'src/shared'),
    path.join(__dirname, 'src/features')
];

function replaceColors(content) {
    // Unify all distinct colors from previous redesigns to standard primary
    
    // Indigo / Blue -> Primary
    content = content.replace(/bg-indigo-50 /g, 'bg-primary/10 ');
    content = content.replace(/text-indigo-600/g, 'text-primary');
    content = content.replace(/bg-indigo-500/g, 'bg-primary');
    content = content.replace(/border-indigo-100/g, 'border-primary/20');
    content = content.replace(/border-indigo-200/g, 'border-primary/30');

    content = content.replace(/bg-blue-50 /g, 'bg-primary/10 ');
    content = content.replace(/text-blue-600/g, 'text-primary');
    content = content.replace(/bg-blue-500/g, 'bg-primary');
    content = content.replace(/border-blue-100/g, 'border-primary/20');
    content = content.replace(/border-blue-200/g, 'border-primary/30');

    // Teal / Sky -> Primary (except when explicitly mapping categories)
    content = content.replace(/iconBg: "bg-teal-50", iconColor: "text-teal-600"/g, 'iconBg: "bg-primary/10", iconColor: "text-primary"');
    content = content.replace(/iconBg: "bg-sky-50", iconColor: "text-sky-600"/g, 'iconBg: "bg-primary/10", iconColor: "text-primary"');
    
    // Amber / Orange -> Primary (except for specific urgent UI elements we might want to keep, but user requested strict unification)
    content = content.replace(/iconBg: "bg-amber-50", iconColor: "text-amber-600"/g, 'iconBg: "bg-primary/10", iconColor: "text-primary"');
    content = content.replace(/iconBg: "bg-orange-50", iconColor: "text-orange-600"/g, 'iconBg: "bg-primary/10", iconColor: "text-primary"');
    
    // Emerald / Green -> Primary 
    content = content.replace(/iconBg: "bg-emerald-50", iconColor: "text-emerald-600"/g, 'iconBg: "bg-primary/10", iconColor: "text-primary"');
    content = content.replace(/bg-emerald-50 /g, 'bg-primary/10 ');
    content = content.replace(/text-emerald-600/g, 'text-primary');
    content = content.replace(/text-emerald-500/g, 'text-primary');
    content = content.replace(/bg-emerald-500/g, 'bg-primary');

    // Violet / Purple -> Primary
    content = content.replace(/bg-violet-50 /g, 'bg-primary/10 ');
    content = content.replace(/text-violet-600/g, 'text-primary');
    content = content.replace(/bg-violet-500/g, 'bg-primary');
    content = content.replace(/bg-purple-50 /g, 'bg-primary/10 ');
    content = content.replace(/text-purple-600/g, 'text-primary');

    return content;
}

function processFile(filePath) {
    if (fs.existsSync(filePath)) {
        let content = fs.readFileSync(filePath, 'utf8');
        let newContent = replaceColors(content);
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
console.log('Global unification completed.');
