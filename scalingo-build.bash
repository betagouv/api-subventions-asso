#!/bin/bash

pushd packages/dto
npm run build
popd
pushd packages/$PACKAGE
npm run build
popd
