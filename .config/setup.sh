#!/bin/bash
# Brand Studio Development Environment Setup Script
# For /Users/ec/brand-to-business-studio-1

set -e  # Exit on error

echo "🚀 Brand Studio Development Environment Setup"
echo "=============================================="
echo ""

# Check Node.js and npm versions
echo "📦 Checking development tools..."
node --version
npm --version

# Check if required packages are installed
echo ""
echo "🔍 Validating project dependencies..."
if [ -f package.json ]; then
    echo "✓ package.json found"
    cat package.json | head -20
else
    echo "✗ package.json not found!"
    exit 1
fi

# Check configuration files exist
echo ""
echo "📂 Checking configuration files..."
for file in ".env" "tsconfig.json" "vite.config.ts" "package.json"; do
    if [ -f "$file" ]; then
        echo "✓ $file exists"
    else
        echo "✗ $file missing!"
    fi
done

# Verify key project files
echo ""
echo "📄 Checking critical project files..."
if [ -f "src/lib/site.ts" ]; then
    echo "✓ src/lib/site.ts (business config) exists"
    head -20 src/lib/site.ts | grep -E "name|domain|phone|email" | head -5
else
    echo "✗ src/lib/site.ts not found!"
fi

if [ -f "src/lib/inquiry-schema.ts" ]; then
    echo "✓ src/lib/inquiry-schema.ts (validation rules) exists"
else
    echo "✗ src/lib/inquiry-schema.ts not found!"
fi

# Check Supabase configuration
echo ""
echo "🔌 Checking Supabase connection..."
PROJECT_ID=$(grep "^SUPABASE_PROJECT_ID=" .env | cut -d'=' -f2)
if [ -n "$PROJECT_ID" ]; then
    echo "✓ Supabase project ID: $PROJECT_ID"
else
    echo "⚠️  No Supabase config found in .env"
fi

# Check for generated files headers
echo ""
echo "🔍 Checking for auto-generated files..."
for file in ".mcp-output/" "*.generated.ts" "**/.auto-generated/**"; do
    if [ -d "$file" ] || [ -f "$file" ]; then
        echo "✗ Found potentially auto-generated file: $file"
        echo "  → Should avoid modifying these files"
    fi
done

# Verify MCP resources available
echo ""
echo "🔧 Checking MCP resources..."
if command -v list_mcp_resources &> /dev/null; then
    echo "✓ MCP resource listing available"
else
    echo "⚠️  MCP tools not available, will use shell commands as fallback"
fi

# Create configuration directories
echo ""
echo "📁 Creating configuration directories..."
mkdir -p .config/tools
mkdir -p .config/harnesses
mkdir -p .config/agents

echo ""
echo "✅ Environment setup complete!"
echo ""
echo "📊 Summary:"
echo "  Working directory: $(pwd)"
echo "  Node version: $(node --version | cut -d' ' -f2)"
echo "  Supabase project: $PROJECT_ID"
echo ""
echo "🚀 Ready to use!"
echo ""
echo "Available commands:"
echo "  npm run dev        # Start development server"
echo "  npm run build      # Build for production"
echo "  npm run test       # Run tests"
echo "  npm run format     # Format code with Prettier"
echo "  antigravity spawn  # Spawn agents if available"
