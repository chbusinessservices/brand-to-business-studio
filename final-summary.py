import re
import os

print("=" * 80)
print("ROUTE FIXING SUMMARY - CONSISTENT TRAILING SLASHES (TanStack Router v2)")
print("=" * 80)

routes_with_slash = []
routes_without_slash = []

# Check all route files
route_files = [
    'src/routes/about.tsx',
    'src/routes/accessibility.tsx', 
    'src/routes/admin.tsx',
    'src/routes/auth.tsx',
    'src/routes/business-backup-check.tsx',
    'src/routes/contact.tsx',
    'src/routes/examples.index.tsx',
    'src/routes/examples.sample-client-handoff.tsx',
    'src/routes/how-we-work.tsx',
    'src/routes/index.tsx',
    'src/routes/privacy.tsx',
    'src/routes/reset-password.tsx',
    'src/routes/services.cleaning-business-setup.tsx',
    'src/routes/services.client-journey-systems.tsx',
    'src/routes/services.index.tsx',
    'src/routes/services.websites-inquiry.tsx',
    'src/routes/terms.tsx'
]

for filepath in route_files:
    if not os.path.exists(filepath):
        continue
        
    with open(filepath, 'r') as f:
        content = f.read()
    
    # Extract route definitions
    match = re.search(r'export const Route = createFileRoute\("([^"]+)"\)', content)
    if match:
        route_path = match.group(1)
        has_slash = route_path.endswith('/') and not route_path == '/'
        
        if has_slash:
            routes_with_slash.append(f"✓ {filepath} -> '{route_path}'")
        else:
            routes_without_slash.append(f"✗ {filepath} -> '{route_path}'")

print("\n✅ ROUTES WITH CONSISTENT TRAILING SLASHES:")
for route in routes_with_slash:
    print(f"  {route}")

print(f"\n{'' * 70}\n⚠️  ROUTES WITHOUT TRAILING SLASHES (need attention):")
if routes_without_slash:
    for route in routes_without_slash:
        print(f"  {route}")
else:
    print("  None - All routes are consistent! ✅")

print(f"\n{'' * 70}\n📄 MANIFEST STATUS:")
manifest_path = 'src/routes/_generated-route-manifest.md'
if os.path.exists(manifest_path):
    with open(manifest_path, 'r') as f:
        content = f.read()
    # Count TODO vs DONE
    todo_count = len(re.findall(r'\|\s`/\w+`\s\|.*TODO', content))
    done_count = len(re.findall(r'\|\s`/\w+`\s\|.*DONE', content))
    print(f"  TODO routes: {done_count}")
    print(f"  DONE routes: {todo_count}")

print("\n" + "=" * 80)
print("NEXT STEPS:")
print("=" * 80)
if routes_without_slash:
    print(f"1. Fix the {len(routes_without_slash)} routes missing trailing slashes")
    print("2. Deploy and test to verify routing works correctly")
else:
    print("✓ All routes now have consistent trailing slash conventions!")
    print("3. Deploy to production")

