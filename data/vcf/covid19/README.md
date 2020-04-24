# Covid-19 VCF generation

## Data
[National Genomics Data Center (NGDC)](https://bigd.big.ac.cn/ncov) of China has made the FASTQ files to the COVID-19 Genome publicly available. The FTP link is available here - [FASTQ FTP](ftp://download.big.ac.cn/Genome/Viruses/Coronaviridae/genome/)

# Methods
DRAGEN requires FASTQ input so the downloaded FASTA files need to be converted to a FASTQ file with a dummy quality score, "#". The tool [Seqtk](https://github.com/lh3/seqtk) was used to perform this conversion
'''
seqtk seq -F '#' SAMPLE.genome.fata> SAMPLE.genome.fq
'''


