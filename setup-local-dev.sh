#!/bin/bash

# Setup script to clone and configure both bot and site repos for local development
# Usage: bash setup-local-dev.sh

set -e

echo "🚀 Setting up local development environment for IPJ Discord Bot + Site..."
echo ""

# Check if both repos exist locally
BOT_DIR="$(pwd)"
SITE_DIR="../ipj-ls-pr-bzone"

if [ -d "$SITE_DIR" ]; then
  echo "✅ Site repo already exists at $SITE_DIR"
else
  echo "📥 Cloning site repo from GitHub..."
  cd ..
  git clone https://github.com/epicjoc-hub/ipj-ls-pr-bzone.git
  cd "$BOT_DIR"
  echo "✅ Site repo cloned"
fi

# Setup bot repo
echo ""
echo "🤖 Setting up bot repo..."
if [ ! -f "$BOT_DIR/.env" ]; then
  cp "$BOT_DIR/.env.example" "$BOT_DIR/.env"
  echo "✅ Created .env for bot from .env.example"
else
  echo "✅ .env already exists for bot"
fi

npm install
echo "✅ Bot dependencies installed"

# Setup site repo
echo ""
echo "🌐 Setting up site repo..."
cd "$SITE_DIR"
if [ ! -f "$SITE_DIR/.env.local" ]; then
  echo "⚠️  Create .env.local in site repo manually with required variables:"
  echo "   - VERIFY_SECRET (same as in bot .env)"
  echo "   - DISCORD_CLIENT_ID"
  echo "   - DISCORD_CLIENT_SECRET"
  echo "   - NEXT_PUBLIC_BOT_API_URL=http://localhost:3000"
else
  echo "✅ .env.local already exists for site"
fi

if [ -f "$SITE_DIR/package.json" ]; then
  npm install
  echo "✅ Site dependencies installed"
fi

cd "$BOT_DIR"

echo ""
echo "📝 Local development setup complete!"
echo ""
echo "Next steps:"
echo "1. Set environment variables in both .env files:"
echo "   - Bot repo ($BOT_DIR/.env):"
echo "     - BOT_TOKEN: your Discord bot token"
echo "     - VERIFY_SECRET: shared secret with site (e.g., openssl rand -hex 32)"
echo "     - SITE_URL: http://localhost:3000 (or where your site runs)"
echo "     - PORT: 3000 (or your preferred port)"
echo ""
echo "   - Site repo ($SITE_DIR/.env.local):"
echo "     - VERIFY_SECRET: same as bot"
echo "     - DISCORD_CLIENT_ID: from Discord Developer Portal"
echo "     - DISCORD_CLIENT_SECRET: from Discord Developer Portal"
echo "     - NEXT_PUBLIC_BOT_API_URL: http://localhost:3000"
echo ""
echo "2. Start both services:"
echo "   Option A - Docker Compose (recommended):"
echo "     docker-compose up"
echo ""
echo "   Option B - Manual (two terminals):"
echo "     Terminal 1 (Bot): npm start"
echo "     Terminal 2 (Site): cd $SITE_DIR && npm run dev"
echo ""
echo "3. Visit http://localhost:3000 and test the flow"
echo ""
