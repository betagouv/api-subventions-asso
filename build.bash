#!/bin/bash

if [ -z "$PACKAGE" ]
then
  pnpm build
else
  pnpm build:$PACKAGE
fi

