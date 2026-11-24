import os

files = [
    'src/routes/index.tsx',
    'src/routes/terms.tsx',
]

for filepath in files:
    if not os.path.exists(filepath):
        continue
        
    with open(filepath, 'r') as f:
        content = f.read()
    
    # Fix remaining routes
    content = content.replace('createFileRoute("/")({', 'createFileRoute("/")({')
    content = content.replace('createFileRoute("/terms")({', 'createFileRoute("/terms/")({')
    
    with open(filepath, 'w') as f:
        f.write(content)

print(f"Updated routes in {len(files)} files")
