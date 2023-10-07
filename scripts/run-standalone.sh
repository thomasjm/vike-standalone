#!/usr/bin/env bash

set -eo pipefail

DIR=$(mktemp -d)

echo "Copying dist dir to $DIR"
cp -r dist "$DIR"

echo "Switching to $DIR and starting standalone server..."
cd "$DIR"
export NODE_ENV=production
node dist/server/index.mjs
