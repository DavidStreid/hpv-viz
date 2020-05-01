# Covid-19 VCF generation

## Data
[National Genomics Data Center (NGDC)](https://bigd.big.ac.cn/ncov) of China has made the FASTQ files to the COVID-19 Genome publicly available. The FTP link is available here - ftp://download.big.ac.cn/Genome/Viruses/Coronaviridae/genome/

## Methods
Indexing - We choose all coding region (CDS) FASTAs to index our downloaded FASTA files 

Note - Variants can also be called using specific complete genome FASTA records

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

1. Align downloaded FASTAs and create BAM files. This will write the BWA MEM indexing directory, `./covid19_idx`, and BAM directory, `./covid19_bams`. 
   ```
   $ DOWNLOAD_DIR={REPLACE: Where FASTAs were downloaded to}
   $ ./fastaToBAM.sh $DOWNLOAD_DIR
   ```

2. BAM -> VCF

    Run [Viral Profiler](https://github.com/DavidStreid/viral-profiler) w/ BAM output directory
