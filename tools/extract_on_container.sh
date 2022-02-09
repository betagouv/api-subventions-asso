#!/bin/bash

mkdir /tmp/files
tar -xf /tmp/uploads/* -C /tmp/files

node ./build/src/cli.js osiris parse requests /tmp/files/osiris_dossiers
node ./build/src/cli.js osiris parse actions /tmp/files/osiris_actions
node ./build/src/cli.js leCompteAsso parse /tmp/files/lca
#node ./build/src/cli.js chorus parse /tmp/files/chorus

for file in "./logs/*"; do
    cat $file;
    echo;
done
