filepath = 'src/routes/services.index.tsx'

with open(filepath, 'r') as f:
    content = f.read()

# Fix Link components that need trailing slashes
content = content.replace('to="/services/cleaning-business-setup"', 'to="/services/cleaning-business-setup/"')
content = content.replace('to="/services/websites-inquiry"', 'to="/services/websites-inquiry/"')
content = content.replace('to="/services/client-journey-systems"', 'to="/services/client-journey-systems/"')

# Fix Link to how-we-work page
content = content.replace('to="/how-we-work",', 'to="/how-we-work/",')

with open(filepath, 'w') as f:
    f.write(content)

print(f"Updated {filepath}")
