web: node packages/$PACKAGE/build/src/index.js
postdeploy: PACKAGE=api /bin/sh -c 'echo $PACKAGE; if [ $PACKAGE = "api" ]; then npm run migration:apply; fi'