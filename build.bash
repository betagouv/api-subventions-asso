#!/bin/bash

if [ -z "$PACKAGE" ]
then
  npx lerna run build
else
  npm run build:$PACKAGE
fi

