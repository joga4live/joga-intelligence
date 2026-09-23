#!/bin/sh
set -eu
JSC=/System/Library/Frameworks/JavaScriptCore.framework/Versions/A/Helpers/jsc
"$JSC" tests/jogamind-compact.test.js
"$JSC" tests/verify-production.js
CHANGED=$( { git diff --name-only; git ls-files --others --exclude-standard; } | sort -u )
BAD=$(printf '%s\n' "$CHANGED" | grep -Ev '^(subment\.html|sw\.js|jogamind-compact-core\.js|jogamind-compact-ui\.js|tests/.*)$' || true)
test -z "$BAD" || { echo "Unexpected files changed:"; echo "$BAD"; exit 1; }
echo "isolation-check: OK"
