web: lerna run start --scope $PACKAGE
postdeploy: /bin/sh -c 'echo $PACKAGE; if [ $PACKAGE = "api" ]; then pnpm migration:apply; fi'
