const fs = require('fs');
const path = require('path');

function findFiles(dir, filter, fileList = []) {
  if (!fs.existsSync(dir)) return fileList;
  const files = fs.readdirSync(dir);
  files.forEach(file => {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      findFiles(filePath, filter, fileList);
    } else if (filter.test(filePath)) {
      fileList.push(filePath);
    }
  });
  return fileList;
}

const landingFiles = [
  ...findFiles('./app/components/landing', /\.tsx$/),
  ...findFiles('./app/(landing)', /\.tsx$/)
];

let count = 0;
landingFiles.forEach(f => {
    if (f.includes('HeroContent.tsx')) return; // Already reverted manually
    
    let content = fs.readFileSync(f, 'utf8');
    let original = content;
    
    // Reverse the colors
    content = content.replace(/emerald-/g, 'purple-');
    content = content.replace(/teal-/g, 'indigo-');
    content = content.replace(/bg-\[\#0B130E\]/g, 'bg-[#181436]');
    content = content.replace(/to-\[\#050A07\]/g, 'to-[#120E2B]');
    content = content.replace(/bg-\[\#0A100C\]/g, 'bg-[#16132D]');
    
    if (content !== original) {
        fs.writeFileSync(f, content);
        count++;
    }
});
console.log('Reverted ' + count + ' landing page files.');
