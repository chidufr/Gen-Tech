#!/bin/bash
# Deployment verification script
# Run this locally to test your setup before pushing to GitHub

set -e

echo "🔍 Checking Deployment Setup..."
echo ""

# Check if .github/workflows/deploy.yml exists
if [ -f ".github/workflows/deploy.yml" ]; then
    echo "✅ GitHub Actions workflow found"
else
    echo "❌ Missing .github/workflows/deploy.yml"
    exit 1
fi

# Check if env variables are configured
if grep -q "NEXT_PUBLIC_SUPABASE_URL" .env.example 2>/dev/null; then
    echo "✅ Environment variable template found"
else
    echo "❌ Missing .env.example with Supabase variables"
    exit 1
fi

# Check if .env.local exists (should not be committed)
if [ ! -f ".env.local" ]; then
    echo "⚠️  .env.local not found - you'll need to create it for local development"
fi

# Check if Supabase client is properly configured
if grep -q "NEXT_PUBLIC_SUPABASE_URL" "src/integrations/supabase/client.ts" 2>/dev/null || \
   grep -q "NEXT_PUBLIC_SUPABASE_URL" "src/lib/supabase.ts" 2>/dev/null; then
    echo "✅ Supabase client uses environment variables"
else
    echo "⚠️  Check if Supabase client imports from environment variables"
fi

# Check Next.js config for static export
if grep -q "output: 'export'" "next.config.ts" 2>/dev/null || \
   grep -q 'output: "export"' "next.config.ts" 2>/dev/null; then
    echo "✅ Next.js configured for static export (GitHub Pages compatible)"
else
    echo "⚠️  Next.js may not be configured for static export"
fi

# Check .gitignore for .env.local
if grep -q "\.env\.local" ".gitignore" 2>/dev/null; then
    echo "✅ .env.local is in .gitignore (secrets won't be committed)"
else
    echo "⚠️  Make sure .env.local is in .gitignore to prevent secrets leaking"
fi

echo ""
echo "📋 Deployment Setup Summary:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Workflow:       .github/workflows/deploy.yml"
echo "Environment:    .env.example (template)"
echo "Supabase:       Environment variables (NEXT_PUBLIC_*)"
echo "Hosting:        GitHub Pages (gh-pages branch)"
echo "Build output:   out/ directory"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "✅ Setup looks good! You're ready to deploy."
echo ""
echo "Next steps:"
echo "1. Create .env.local with your Supabase credentials"
echo "2. Test build locally: pnpm build"
echo "3. Add secrets to GitHub Settings → Secrets and variables → Actions"
echo "4. Push to main branch: git push origin main"
echo "5. Watch Actions tab for deployment"
echo ""
