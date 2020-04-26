# Covid-19 VCF generation

## Data
[National Genomics Data Center (NGDC)](https://bigd.big.ac.cn/ncov) of China has made the FASTQ files to the COVID-19 Genome publicly available. The FTP link is available here - ftp://download.big.ac.cn/Genome/Viruses/Coronaviridae/genome/

## Methods
Indexing - We chose the following samples to create an alignment index

|         Sample         | Region |
|:----------------------:|:------:|
| NC_045512.genome.fasta |  Wuhan |
| AY323977.genome.fasta  |  Italy |
| MT370977.genome.fasta  | USA-NY |
| MT350280.genome.fasta  | USA-WA |
| AY274119.genome.fasta  | Canada |
| MT370518.genome.fasta  | Taiwan |

### Dependencies
* samtools
* bwa

1. INDEX - Create Index from selected FASTA file. We chose the `NC_045512.genome.fasta`
   ```
   $ DOWNLOAD_DIR={REPLACE: Where downloaded FASTAs are}
   $ IDX_FA=${DOWNLOAD_DIR}/NC_045512.genome.fasta;
   $ bwa index $IDX_FA 
   ```

2. FASTA -> BAM
    ```
    $ ./fastaToBAM.sh $IDX_FA $DOWNLOAD_DIR ./covid19_bams # Creates covid19_bams
    ```

3. BAM -> VCF

    Run [Viral Profiler](https://github.com/DavidStreid/viral-profiler) w/ BAM output directory
