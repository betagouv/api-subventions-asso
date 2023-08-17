#!/bin/bash

if [ -z "$PACKAGE" ]
then
  npm run build
else
  npm run build:$PACKAGE
fi

