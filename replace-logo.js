const fs = require('fs');
const path = require('path');

const files = [
  'app/contact/page.tsx',
  'app/blog/page.tsx',
  'app/politique-de-confidentialite/page.tsx',
  'app/conditions/page.tsx',
  'app/cookies/page.tsx',
  'app/mentions-legales/page.tsx',
  'app/support/page.tsx',
  'app/login/page.tsx',
  'app/register/page.tsx',
  'app/forgot-password/page.tsx',
  'app/reset-password/page.tsx',
  'app/verify-email/page.tsx'
];

// In the regex, we match:
// <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center font-bold text-white shadow-lg shadow-purple-600/30">\s*🌱\s*</div>
const targetPattern = /<div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center font-bold text-white shadow-lg shadow-purple-600\/30">\s*🌱\s*<\/div>/g;

files.forEach(f => {
  const fullPath = path.join(process.cwd(), f);
  if (fs.existsSync(fullPath)) {
    let content = fs.readFileSync(fullPath, 'utf8');
    let original = content;
    
    // Replace the icon with Logo
    content = content.replace(targetPattern, '<Logo width={36} height={36} />');
    
    // Add Logo import if necessary
    if (content !== original && !content.includes('import Logo from')) {
      if (content.includes('import {')) {
        content = content.replace(/(import .* from "lucide-react";)/, '$1\nimport Logo from "@/app/components/ui/Logo";');
      } else {
        content = 'import Logo from "@/app/components/ui/Logo";\n' + content;
      }
    }
    
    // Check if the logo replacement actually happened but the text size wasn't hidden on small screens
    // Actually the user just wanted the logo.
    
    if (content !== original) {
      fs.writeFileSync(fullPath, content);
      console.log('Updated', f);
    }
  }
});
