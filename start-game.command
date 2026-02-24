#!/bin/bash
cd "$(dirname "$0")"
echo "Starting FitHero Kids..."
echo "Opening browser at http://localhost:3002"
echo ""
if ! command -v npx &> /dev/null; then
  echo "Node.js not found. Please install from https://nodejs.org and try again."
  read -p "Press Enter to close."
  exit 1
fi
(sleep 2 && open "http://localhost:3002") &
npx -y serve@latest out -l 3002
echo ""
read -p "Press Enter to close."
