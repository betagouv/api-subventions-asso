#!/bin/bash

mkdir /tmp/files

if [ -z "$EXPORT_DATE" ]
then 
    EXPORT_DATE=`date +%Y-%m-%d` # Use on case of crontask run upload
fi

wget -O /tmp/files/StockUniteLegaleHistorique_utf8.zip https://files.data.gouv.fr/insee-sirene/StockUniteLegaleHistorique_utf8.zip

unzip /tmp/files/StockUniteLegaleHistorique_utf8.zip -d /tmp/files/

node ./build/src/cli.js datagouv parse /tmp/files/StockUniteLegaleHistorique_utf8.csv $EXPORT_DATE

exit
