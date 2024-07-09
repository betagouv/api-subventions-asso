#!/bin/bash
currentDir="$(pwd)/${1}"
cd $currentDir
mkdir ../tar

tarName="extract-osiris-dossiers.tar.gz"

tar -czf "../tar/${tarName}" *
cd ../tar
mkdir partition
split -b 90M $tarName "./partition/${tarName}.part"

for file in "./partition/*"; do
    fileOption=$fileOption$file
    echo $fileOption;
done

# scalingo -a ${2} run --size 2XL --file