const fs = require('fs');
const path = require('path');

const targetDir = path.join(__dirname, 'src/app/dashboard/organization');
const sidebarPath = path.join(__dirname, 'src/shared/components/layout/OrganizationSidebar.tsx');

function replaceColors(content) {
    // Top KPI cards in page.tsx currently use teal, amber, emerald, rose.
    // The user wants a UNIFIED system. We will make them all primary/muted.
    // Wait, let's just make the script extremely robust by converting the known 
    // offending classes from the screenshot to standard primary ones.
    
    // Convert AI widget indigo/blue to primary
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

    // Convert KPI card specific colors to primary to unify the page
    // (If the user wants unified colors, having 4 different colored KPI cards is counter-productive)
    content = content.replace(/iconBg: "bg-teal-50", iconColor: "text-teal-600"/g, 'iconBg: "bg-primary/10", iconColor: "text-primary"');
    content = content.replace(/iconBg: "bg-amber-50", iconColor: "text-amber-600"/g, 'iconBg: "bg-primary/10", iconColor: "text-primary"');
    content = content.replace(/iconBg: "bg-emerald-50", iconColor: "text-emerald-600"/g, 'iconBg: "bg-primary/10", iconColor: "text-primary"');
    
    // Keep 'rose' for rejected/destructive as it is universally understood
    // But let's unify the background of the urgent action banner to primary instead of amber
    content = content.replace(/from-amber-50 to-orange-50\/50/g, 'from-primary/5 to-primary/10');
    content = content.replace(/border-amber-200/g, 'border-primary/20');
    content = content.replace(/bg-amber-100/g, 'bg-primary/15');
    content = content.replace(/text-amber-600/g, 'text-primary');
    content = content.replace(/text-amber-900/g, 'text-slate-900');
    content = content.replace(/text-amber-700\/80/g, 'text-slate-600');
    content = content.replace(/bg-amber-500 hover:bg-amber-600/g, 'bg-primary hover:bg-primary/90');
    
    // Ensure emerald (from my previous script) is converted to primary globally
    content = content.replace(/bg-emerald-50 /g, 'bg-primary/10 ');
    content = content.replace(/text-emerald-600/g, 'text-primary');
    content = content.replace(/text-emerald-500/g, 'text-primary');
    content = content.replace(/bg-emerald-500/g, 'bg-primary');

    return content;
}

function processFile(filePath) {
    if (fs.existsSync(filePath)) {
        let content = fs.readFileSync(filePath, 'utf8');
        let newContent = replaceColors(content);
        fs.writeFileSync(filePath, newContent, 'utf8');
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

traverseDir(targetDir);
processFile(sidebarPath);

console.log('Unified colors applied successfully.');
