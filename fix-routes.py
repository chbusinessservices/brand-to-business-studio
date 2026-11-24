import re

files = [
    'src/routes/about.tsx',
    'src/routes/accessibility.tsx', 
    'src/routes/admin.tsx',
    'src/routes/auth.tsx',
    'src/routes/business-backup-check.tsx',
    'src/routes/contact.tsx',
    'src/routes/examples.sample-client-handoff.tsx',
    'src/routes/how-we-work.tsx',
    'src/routes/privacy.tsx',
    'src/routes/reset-password.tsx',
    'src/routes/services.cleaning-business-setup.tsx',
    'src/routes/services.client-journey-systems.tsx',
    'src/routes/services.websites-inquiry.tsx'
]

import os
for filepath in files:
    if not os.path.exists(filepath):
        continue
    with open(filepath, 'r') as f:
        content = f.read()
    
    # Remove trailing slash from createFileRoute paths
    replacements = [
        ('createFileRoute("/about")', 'createFileRoute("/about/")'),
        ('createFileRoute("/accessibility")', 'createFileRoute("/accessibility/")'),
        ('createFileRoute("/admin")', 'createFileRoute("/admin/")'),
        ('createFileRoute("/auth")', 'createFileRoute("/auth/")'),
        ('createFileRoute("/business-backup-check")', 'createFileRoute("/business-backup-check/")'),
        ('createFileRoute("/contact")', 'createFileRoute("/contact/")'),
        ('createFileRoute("/examples/sample-client-handoff")', 'createFileRoute("/examples/sample-client-handoff/")'),
        ('createFileRoute("/how-we-work")', 'createFileRoute("/how-we-work/")'),
        ('createFileRoute("/privacy")', 'createFileRoute("/privacy/")'),
        ('createFileRoute("/reset-password")', 'createFileRoute("/reset-password/")'),
        ('createFileRoute("/services/cleaning-business-setup")', 'createFileRoute("/services/cleaning-business-setup/")'),
        ('createFileRoute("/services/client-journey-systems")', 'createFileRoute("/services/client-journey-systems/")'),
        ('createFileRoute("/services/websites-inquiry")', 'createFileRoute("/services/websites-inquiry/")'),
    ]
    
    for old, new in replacements:
        content = content.replace(old, new)
    
    with open(filepath, 'w') as f:
        f.write(content)

print("Routes updated successfully!")
