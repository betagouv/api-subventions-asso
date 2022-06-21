web: node packages/$PACKAGE/build/src/index.js
postdeploy: /bin/sh -c 'echo $PACKAGE; if [ $PACKAGE = "api" ]; then npm run migration:apply; fi'