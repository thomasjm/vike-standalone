#!/usr/bin/env bash

set -eo pipefail

SCRIPTDIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$SCRIPTDIR/.."

sed -i "s|pageFiles: () => import(null)|pageFiles: () => import('./pageFiles.mjs')|g" dist/server/index.mjs
sed -i "s|clientManifest: () => import(null)|clientManifest: () => import('../assets.json', { assert: {type: 'json'} })|g" dist/server/index.mjs
sed -i "s|pluginManifest: () => import(null)|pluginManifest: () => import('../client/vike.json', { assert: {type: 'json'} })|g" dist/server/index.mjs
