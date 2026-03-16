#!/bin/bash

DOWNLOAD_DIR=./covid19_downloads
REF_DIR=./covid19_ref
BAM_DIR=./covid19_bams_ref
VCF_DIR=./covid19_vcfs

mkdir -p $REF_DIR $BAM_DIR $VCF_DIR

# Index the Wuhan reference genome
REF=${REF_DIR}/reference.fa
cp ${DOWNLOAD_DIR}/NC_045512.genome.fasta $REF
echo "Indexing reference genome..."
bwa index $REF
samtools faidx $REF

# Align each genome to the reference and call variants
for FASTA in ${DOWNLOAD_DIR}/*.genome.fasta; do
  SAMPLE=$(basename "$FASTA" .genome.fasta)
  SORTED_BAM=${BAM_DIR}/${SAMPLE}.sorted.bam
  VCF_OUT=${VCF_DIR}/${SAMPLE}.vcf

  echo "Aligning ${SAMPLE}..."
  bwa mem -x intractg $REF "$FASTA" | samtools sort -o "$SORTED_BAM"
  samtools index "$SORTED_BAM"

  echo "Calling variants for ${SAMPLE}..."
  bcftools mpileup --min-BQ 0 --min-MQ 0 -d 1000 -f $REF "$SORTED_BAM" | \
    bcftools call -mv --ploidy 1 -o "$VCF_OUT"
done

echo "Done. VCFs written to ${VCF_DIR}"
