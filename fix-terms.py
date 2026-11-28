filepath = 'src/routes/terms.tsx'

with open(filepath, 'r') as f:
    content = f.read()

content = content.replace('pageHead("/terms", "Website Terms"', 'pageHead("/terms/", "Website Terms"')

with open(filepath, 'w') as f:
    f.write(content)

print(f"Updated {filepath}")
