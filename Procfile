web: pnpm start --scope $PACKAGE
postdeploy: /bin/sh -c 'echo $PACKAGE; if [ $PACKAGE = "api" ]; then pnpm migration:apply; fi'