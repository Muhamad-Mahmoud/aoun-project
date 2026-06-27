const fs = require('fs');
const path = require('path');

const targetDir = path.join(__dirname, 'src/app/dashboard/organization');

function replaceInFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // We want to make the Association Dashboard look distinct and professional.
    // Deep Blue (blue) is the main brand color.
    // Amber/Orange is the warning/action color.
    // Emerald is the success color.
    // Indigo/Violet is the AI/Tech color.
    
    // Reverse the previous bad script replacements just for the main layout classes
    // Note: We won't touch 'emerald' if it's used for success (like approved status), 
    // but the previous script blindly replaced all 'indigo' with 'emerald'.
    
    // Let's replace the overused 'emerald' and 'teal' in layout backgrounds/text
    // We will use 'blue' as the primary distinct color.
    content = content.replace(/bg-emerald-600/g, 'bg-blue-600');
    content = content.replace(/text-emerald-600/g, 'text-blue-600');
    content = content.replace(/border-emerald-500/g, 'border-blue-500');
    content = content.replace(/from-emerald-/g, 'from-blue-');
    content = content.replace(/to-emerald-/g, 'to-blue-');
    
    // Replace 'teal' with 'sky' to give it a fresh data look
    content = content.replace(/teal-/g, 'sky-');
    
    fs.writeFileSync(filePath, content, 'utf8');
}

function traverseDir(dir) {
    if (!fs.existsSync(dir)) return;
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            traverseDir(fullPath);
        } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
            replaceInFile(fullPath);
        }
    }
}

traverseDir(targetDir);
console.log('Fixed Organization dashboard colors.');
