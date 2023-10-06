#!/usr/bin/env bash

set -eo pipefail

pnpm run build

DIR=$(mktemp -d)

echo "Copying dist dir to $DIR"
cp -r dist "$DIR"

echo "Switching to dir and starting standalone server..."
cd "$DIR"
node dist/server/index.mjs
