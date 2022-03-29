#!/bin/bash

mkdir /tmp/files

wget -O /tmp/files/unite_legal.zip $TMP_LAST_FILE_DATGOUV

unzip /tmp/files/unite_legal.zip -d /tmp/files/

node ./build/src/cli.js datagouv parse_unite_legal /tmp/files/StockUniteLegale_utf8.csv

exit