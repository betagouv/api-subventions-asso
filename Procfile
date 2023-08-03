web: lerna run start --scope $PACKAGE
postdeploy: /bin/sh -c 'echo $PACKAGE; if [ $PACKAGE = "api" ]; then npm run migration:apply; fi'
