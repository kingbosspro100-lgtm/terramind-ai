#!/bin/bash
# Setup Script for TerraMind AI Production Deployment
# This script helps configure the application for production

set -e

echo "🚀 TerraMind AI - Setup Guide"
echo "=============================="
echo ""

# Check if .env.local exists
if [ ! -f .env.local ]; then
    echo "⚠️  .env.local not found. Creating from .env.example..."
    cp .env.example .env.local
    echo "✅ .env.local created. Please update with your credentials."
fi

# Check Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js not found. Please install Node.js 18+ first."
    exit 1
fi
echo "✅ Node.js $(node --version) found"

# Check npm
if ! command -v npm &> /dev/null; then
    echo "❌ npm not found. Please install npm first."
    exit 1
fi
echo "✅ npm $(npm --version) found"

echo ""
echo "📦 Installing dependencies..."
npm install

echo ""
echo "🔍 Checking TypeScript..."
npm run build --dry-run || true

echo ""
echo "✅ Setup complete!"
echo ""
echo "📝 Next steps:"
echo "1. Edit .env.local with your credentials:"
echo "   - NEXT_PUBLIC_SUPABASE_URL"
echo "   - NEXT_PUBLIC_SUPABASE_ANON_KEY"
echo "   - AUTH_SECRET (generate with: openssl rand -base64 32)"
echo "   - AUTH_GOOGLE_ID / AUTH_GOOGLE_SECRET"
echo "   - AUTH_FACEBOOK_ID / AUTH_FACEBOOK_SECRET"
echo ""
echo "2. Start development server:"
echo "   npm run dev"
echo ""
echo "3. Visit: http://localhost:3000"
echo ""
echo "4. Test authentication flows:"
echo "   - Email login (create account first)"
echo "   - Google OAuth"
echo "   - Facebook OAuth"
echo ""
echo "5. Deploy to production:"
echo "   npm run build"
echo "   npm start"
echo ""
