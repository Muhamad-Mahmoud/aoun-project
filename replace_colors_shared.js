const fs = require('fs');
const path = require('path');

const targetDirs = [
    path.join(__dirname, 'src/features'),
    path.join(__dirname, 'src/shared')
];

function replaceInFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Replace indigo with emerald
    content = content.replace(/indigo/g, 'emerald');
    
    // Replace sky with teal
    content = content.replace(/sky/g, 'teal');
    
    // Replace violet and purple with amber
    content = content.replace(/violet/g, 'amber');
    content = content.replace(/purple/g, 'amber');
    
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

targetDirs.forEach(traverseDir);
console.log('Colors replaced successfully in features and shared components.');
