const fs = require('fs');
const path = require('path');

const targetDir = path.join(__dirname, 'src/app/dashboard');

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
console.log('Colors replaced successfully in all dashboard files.');
