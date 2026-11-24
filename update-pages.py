import re
import os

files = [
    'src/routes/about.tsx',
    'src/routes/accessibility.tsx', 
    'src/routes/business-backup-check.tsx',
    'src/routes/contact.tsx',
    'src/routes/examples.index.tsx',
    'src/routes/examples.sample-client-handoff.tsx',
    'src/routes/privacy.tsx',
    'src/routes/reset-password.tsx',
    'src/routes/terms.tsx'
]

for filepath in files:
    if not os.path.exists(filepath):
        continue
        
    with open(filepath, 'r') as f:
        content = f.read()
    
    # Fix various pageHead calls - handle multi-line cases carefully
    
    # Simple replacements first
    content = content.replace('pageHead("/about",', 'pageHead("/about/",')
    content = content.replace('pageHead("/accessibility",', 'pageHead("/accessibility/",')
    content = content.replace('pageHead("/business-backup-check",', 'pageHead("/business-backup-check/",')
    content = content.replace('pageHead("/contact",', 'pageHead("/contact/",')
    content = content.replace('pageHead("/examples",', 'pageHead("/examples/",')
    content = content.replace('pageHead("/how-we-work",', 'pageHead("/how-we-work/",')
    content = content.replace('pageHead("/privacy",', 'pageHead("/privacy/",')
    content = content.replace('pageHead("/reset-password",', 'pageHead("/reset-password/",')
    
    with open(filepath, 'w') as f:
        f.write(content)

print(f"Updated {len(files)} files with consistent pageHead calls")
