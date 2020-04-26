#!/bin/bash

if [[ -z "$1"  ||  -z "$2"  || -z "$3" ]]
   then
      printf "please specify FASTA index (from bwa idx), directory of FASTA files, and output for BAMs - ./fastaToBAM.sh {FASTA_IDX} {FASTA_DIR} {BAM_DIR}\ne.g.\n\t"
      printf "./fastaToBAM.sh ./bwaIdx/NC_045512.genome.fasta ./covid19_downloads ./covid19_bams\n"
   exit 1
fi

FASTA_IDX=$1
FASTA_DIR=$2
BAM_DIR=$3

# Param Validation
if [[ ! -f ${FASTA_IDX}  ]]
  then
    echo "Invalid FASTA index: ${FASTA_IDX}"
  exit 1
fi
if [[ ! -d ${FASTA_DIR}  ]]
  then
    echo "Invalid FASTA directory: ${FASTA_DIR}"
  exit 1
fi

# Create $BAM_DIR if not existent
mkdir -p $BAM_DIR

for FASTA in ${FASTA_DIR}/*.fasta; do
   FILE_NAME=$(basename $FASTA)
   SAMPLE=$( cut -d '.' -f 1 <<< "${FILE_NAME}" )
   SAM_FILE=${BAM_DIR}/${SAMPLE}.aln.sam
   BAM_FILE=${BAM_DIR}/${SAMPLE}.bam
   bwa mem $FASTA_IDX $FASTA  > $SAM_FILE
   samtools view -S -b $SAM_FILE > $BAM_FILE
done
