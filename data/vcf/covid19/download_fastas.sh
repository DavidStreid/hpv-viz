#!/bin/bash

DOWNLOAD_DIR=./covid19_downloads
ACCESSIONS=("NC_045512" "AY323977" "MT370977" "MT350280" "AY274119" "MT370518")

mkdir -p $DOWNLOAD_DIR

for ACC in "${ACCESSIONS[@]}"; do
  echo "Downloading $ACC..."
  curl -s "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi?db=nuccore&id=${ACC}&rettype=fasta&retmode=text" \
    -o "${DOWNLOAD_DIR}/${ACC}.genome.fasta"
  curl -s "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi?db=nuccore&id=${ACC}&rettype=fasta_cds_na&retmode=text" \
    -o "${DOWNLOAD_DIR}/${ACC}.cds.fasta"
  sleep 0.5
done

echo "Done. Files written to ${DOWNLOAD_DIR}"
