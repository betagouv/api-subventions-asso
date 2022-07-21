#!/bin/bash

mkdir /tmp/files
tar -xf /tmp/uploads/* -C /tmp/files

node ./packages/api/build/src/cli.js osiris parse requests /tmp/files $TMP_YEAR_OF_FILE

for file in "./logs/*"; do
    cat $file;
    echo;
done

exit;