# Covid-19 VCF generation

## Data
[National Genomics Data Center (NGDC)](https://bigd.big.ac.cn/ncov) of China has made the FASTQ files to the COVID-19 Genome publicly available. The FTP link is available here - ftp://download.big.ac.cn/Genome/Viruses/Coronaviridae/genome/

## Methods
### Dependencies
* samtools
* bwa

1. INDEX - Create Index from selected FASTA file. We chose the `NC_045512.genome.fasta`
    ```
    $ mkdir covid19ref
    $ mv ./covid19_downloads/NC_045512.genome.fasta covid19_idx
    $ bwa idx ./covid19_idx/NC_045512.genome.fasta
    ```

2. FASTA -> BAM
    ```
    $ ./fastaToBAM.sh ./bwaIdx/NC_045512.genome.fasta ./covid19_downloads ./covid19_bams
    ```

3. BAM -> VCF

    Run [Viral Profiler](https://github.com/DavidStreid/viral-profiler) w/ BAM output directory
