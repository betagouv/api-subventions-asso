#!/bin/bash

mkdir /tmp/files
tar -xf /tmp/uploads/* -C /tmp/files

# Est-ce synchrone ? Pour attendre que la collection soit bien drop avant de lancer la suite
node ./packages/api/build/src/cli.js fonjep drop
node ./packages/api/build/src/cli.js fonjep parse /tmp/files/$FILE_NAME $IMPORT_DATE

for file in "./logs/*"; do
    cat $file;
    echo;
done
