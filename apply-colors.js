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
    let content = fs.readFileSync(f, 'utf8');
    let original = content;
    
    // Apply Emerald colors
    content = content.replace(/purple-/g, 'emerald-');
    content = content.replace(/indigo-/g, 'teal-');
    content = content.replace(/bg-\[\#181436\]/g, 'bg-[#0B130E]'); // Deep dark emerald
    content = content.replace(/to-\[\#120E2B\]/g, 'to-[#050A07]');
    content = content.replace(/bg-\[\#16132D\]/g, 'bg-[#0A100C]');
    
    // Specifically fix HeroContent.tsx text colors for dark background if needed, but since it was restored, let's also fix text visibility
    if (f.includes('HeroContent.tsx')) {
        content = content.replace(/text-slate-900/g, 'text-white');
        content = content.replace(/text-slate-800/g, 'text-slate-200');
        content = content.replace(/bg-white\/95/g, 'bg-black/50 backdrop-blur-md border border-white/20');
        content = content.replace(/bg-white/g, 'bg-black/40 backdrop-blur-md');
        content = content.replace(/text-slate-600/g, 'text-slate-300');
    }
    
    if (content !== original) {
        fs.writeFileSync(f, content);
        count++;
    }
});
console.log('Applied new colors to ' + count + ' landing page files.');
