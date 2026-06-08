web: pnpm --filter "$PACKAGE" start
postdeploy: /bin/sh -c 'echo $PACKAGE; if [ "$PACKAGE" = "api" ]; then pnpm migration:apply; fi'