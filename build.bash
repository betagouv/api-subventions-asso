#!/bin/bash

if [ -z "$PACKAGE" ]
then
  npx lerna run build
else
  pnpm build:$PACKAGE
fi

