#!/bin/sh
if [ -z "$husky_skip_init" ]; then
  debug() {
    [ "$HUSKY_DEBUG" = "1" ] && echo "husky (debug) - $*"
  }
  readonly hook_name="$(basename "$0")"
  debug "starting $hook_name..."
  if [ -z "$HUSKY" ]; then
    echo "husky - Git hooks disabled. Skipping $hook_name hook" >&2
    exit 0
  fi
fi
