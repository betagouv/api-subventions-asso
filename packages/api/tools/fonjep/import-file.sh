#!/bin/bash

echo "\n\n\nThis script accept only xls or xlsx file \n\n\n"

node  ./packages/api/build/src/cli.js fonjep parse /tmp/uploads $IMPORT_DATE

for file in "./logs/*"; do
    cat $file;
    echo;
done
