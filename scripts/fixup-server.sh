#!/usr/bin/env bash

set -eo pipefail

SCRIPTDIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$SCRIPTDIR/.."

# sed -i '1iimport "./importBuild.cjs";' dist/server/index.mjs
