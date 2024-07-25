#!/bin/bash

mkdir /tmp/files
cp /tmp/uploads/* /tmp/files
zip -s 0 /tmp/files/$IMPORT_TYPE-split.zip --out /tmp/files/$IMPORT_TYPE.zip
unzip /tmp/files/$IMPORT_TYPE.zip -d /tmp/files/unzipped

node ./packages/api/build/src/cli.js osiris parse $IMPORT_TYPE /tmp/files/unzipped $TMP_YEAR_OF_FILE

for file in './logs/*'; do
    cat "$file";
    echo;
done

exit;
