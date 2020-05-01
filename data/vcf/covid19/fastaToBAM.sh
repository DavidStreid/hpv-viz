#!/bin/bash

if [[ -z "$1"  ]]
   then
      printf "please specify location of downloaded FASTA files - ./fastaToBAM.sh {FASTA_DIR} e.g.\n\t"
      printf "./fastaToBAM.sh ./covid19_downloads \n"
   exit 1
fi

FASTA_DIR=$1

# Default output directory locations
IDX_DIR=./covid19_idx
IDX_FA=${IDX_DIR}/covid19_idx.fa
BAM_DIR=./covid19_bams
LOG_DIR=${BAM_DIR}/logs

echo "Creating BWA index of CDS FASTA files: ${IDX_DIR}"
mkdir -p $IDX_DIR && touch $IDX_FA
for FASTA in ${FASTA_DIR}/*cds*; do
   is_human_gene=$(head -1 $FASTA | grep -i "gene" | grep -i "human")
   if [[ ${is_human_gene}  ]]; then
      cat $FASTA >> ${IDX_FA}
   fi
done
bwa index $IDX_FA

echo "Creating BWA index of CDS FASTA files: ${IDX_DIR}"
mkdir -p $BAM_DIR

# Add log files
mkdir -p $LOG_DIR
LOG=${LOG_DIR}/alignment.log
ERR=${LOG_DIR}/bad_bams.log

# Create BAMs
for FASTA in ${FASTA_DIR}/*.fasta; do
   FILE_NAME=$(basename $FASTA)
   SAMPLE=$( cut -d '.' -f 1 <<< "${FILE_NAME}" )
   SAM_FILE=${BAM_DIR}/${SAMPLE}.aln.sam
   BAM_FILE=${BAM_DIR}/${SAMPLE}.bam
   bwa mem $IDX_FA $FASTA  > $SAM_FILE 2>> ${LOG}
   samtools view -bS $SAM_FILE > $BAM_FILE 2>> ${LOG}

   # Verify valid BAMs. Delete if invalid
   samtools quickcheck -v ${BAM_FILE} >> ${ERR} 2>&1  && : || (echo Invalid BAM from sample: ${SAMPLE} && rm ${BAM_FILE})
done
echo "Done."
