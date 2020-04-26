# Covid-19 VCF generation

## Data
[National Genomics Data Center (NGDC)](https://bigd.big.ac.cn/ncov) of China has made the FASTQ files to the COVID-19 Genome publicly available. The FTP link is available here - ftp://download.big.ac.cn/Genome/Viruses/Coronaviridae/genome/

## Methods
Indexing - We chose the following samples to create an alignment index

|         Sample        | Region |
|:---------------------:|:------:|
| MT370518.genome.fasta |  Wuhan |
| AY323977.genome.fasta |  Italy |
| MT370977.genome.fasta | USA-NY |
| MT350280.genome.fasta | USA-WA |
| AY274119.genome.fasta | Canada |
| MT370518.genome.fasta | Taiwan |

### Dependencies
* samtools
* bwa

1. INDEX - Create Index from selected FASTA file. We chose the `NC_045512.genome.fasta`
   ```
   $ DOWNLOAD_DIR={REPLACE: Where FASTAs were downloaded to}
   $ IDX_DIR=./covid_idx && mkdir $IDX_DIR
   $ IDX_FA=${IDX_DIR}/covid_idx.fa
   $ REF_FASTAS=( MT370518.genome.fasta AY323977.genome.fasta MT370977.genome.fasta MT350280.genome.fasta AY274119.genome.fasta MT370518.genome.fasta )
   $ for FASTA in ${REF_FASTAS[@]}; do cat ${DOWNLOAD_DIR}/$FASTA >> ${IDX_FA}; done
   $ bwa index $IDX_FA
   ```

2. FASTA -> BAM
    ```
    $ ./fastaToBAM.sh $IDX_FA $DOWNLOAD_DIR ./covid19_bams
    ```

3. BAM -> VCF

    Run [Viral Profiler](https://github.com/DavidStreid/viral-profiler) w/ BAM output directory
