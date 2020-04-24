#!/bin/bash

if [[ -z "$1"  ||  -z "$2" || -z "$3" ]]
   then
      printf "Please specify the FASTA Directory, dragen hashtable reference directory, and output directory\n\t./create_vcfs.sh covid19_fasta covid19ref covid19_vcf\n"
      exit 1
fi

FASTQ_DIRECTORY=$1
REF_DIRECTORY=$2
OUT_DIRECTORY=$3

printf "Input: $FASTQ_DIRECTORY\nOutput: $OUT_DIRECTORY\n"

# Default ReadGroup
RG0=covid19

for FASTA in $FASTQ_DIRECTORY/*.fq; do
   FILE=$(basename $FASTA)
   SAMPLE=$( cut -d '.' -f 1 <<< "${FILE}" )
   dragen \
      -r $REF_DIRECTORY \
      -1 $FASTA \
      --output-directory $OUT_DIRECTORY \
      --output-file-prefix $SAMPLE \
      --RGID $RG0 \
      --RGSM $SAMPLE \
      --enable-variant-caller true
done
