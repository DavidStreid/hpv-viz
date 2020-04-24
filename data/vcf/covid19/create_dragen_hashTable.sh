#!/bin/bash

if [[ -z "$1"  ||  -z "$2" ]]
  then
    printf "Please provide a reference FASTA and output\n\t./create_dragen_hashTable.sh NC_045512.genome.fasta ./covid19ref\n"
  exit 1
fi

REF=$1
OUT=$2

echo "Creating reference for $REF"
/opt/edico/bin/dragen --build-hash-table true --ht-reference $REF --output-directory $OUT
