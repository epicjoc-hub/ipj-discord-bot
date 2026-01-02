#!/bin/bash

# Setup script for monorepo (bot + site together)
# Usage: bash setup-local-dev.sh

set -e

echo "🚀 Setting up monorepo (IPJ Discord Bot + Site)..."
echo ""

BOT_DIR="./bot"
SITE_DIR="./site"

# Check if both directories exist
if [ ! -d "$BOT_DIR" ]; then
  echo "❌ Bot directory not found at $BOT_DIR"
  exit 1
fi

if [ ! -d "$SITE_DIR" ]; then
  echo "❌ Site directory not found at $SITE_DIR (clone ipj-ls-pr-bzone there)"
  exit 1
fi

# Setup bot repo
echo ""
echo "🤖 Setting up bot..."
if [ ! -f "$BOT_DIR/.env" ]; then
  cp "$BOT_DIR/.env.example" "$BOT_DIR/.env"
  echo "✅ Created .env for bot from .env.example"
else
  echo "✅ .env already exists for bot"
fi

cd "$BOT_DIR"
npm install
echo "✅ Bot dependencies installed"
cd ..

# Setup site repo
echo ""
echo "🌐 Setting up site..."
if [ ! -f "$SITE_DIR/.env.local" ]; then
  echo "⚠️  Create .env.local in site directory with:"
  echo "   - VERIFY_SECRET (same as in bot .env)"
  echo "   - DISCORD_CLIENT_ID"
  echo "   - DISCORD_CLIENT_SECRET"
  echo "   - NEXT_PUBLIC_BOT_API_URL=http://localhost:3000"
else
  echo "✅ .env.local already exists for site"
fi

cd "$SITE_DIR"
if [ -f "package.json" ]; then
  npm install
  echo "✅ Site dependencies installed"
fi
cd ..

echo ""
echo "📝 Monorepo setup complete!"
echo ""
echo "Next steps:"
echo "1. Set environment variables:"
echo "   - Bot ($BOT_DIR/.env):"
echo "     - BOT_TOKEN: Discord bot token"
echo "     - VERIFY_SECRET: shared secret with site"
echo "     - SITE_URL: http://localhost:3000"
echo "     - PORT: 3000"
echo ""
echo "   - Site ($SITE_DIR/.env.local):"
echo "     - VERIFY_SECRET: same as bot"
echo "     - DISCORD_CLIENT_ID: from Discord Developer Portal"
echo "     - DISCORD_CLIENT_SECRET: from Discord Developer Portal"
echo "     - NEXT_PUBLIC_BOT_API_URL: http://localhost:3000"
echo ""
echo "2. Start services:"
echo "   docker-compose up"
echo ""
echo "3. Visit http://localhost:3000 or http://localhost:3001"
echo ""
