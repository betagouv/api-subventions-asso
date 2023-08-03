#!/bin/bash

if [ -z "$PACKAGE" ]
then
  lerna bootstrap && husky install
else
   lerna bootstrap --scope dto && lerna bootstrap --scope $PACKAGE
fi
