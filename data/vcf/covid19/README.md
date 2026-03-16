# Covid-19 VCF generation

## Data
[National Genomics Data Center (NGDC)](https://bigd.big.ac.cn/ncov) of China has made the FASTQ files to the COVID-19 Genome publicly available. The original FTP link is - ftp://download.big.ac.cn/Genome/Viruses/Coronaviridae/genome/ (may be inaccessible).

Sequences are also available directly from NCBI using the accession numbers below.

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
* bcftools
* curl

---

### Step 0 — Download the genome sequences

Fetches the complete genome and coding region (CDS) sequences for each sample from NCBI and saves them into `./covid19_downloads/`. Each accession gets two files: a full genome FASTA and a CDS-only FASTA.

```
$ ./download_fastas.sh
```

---

### Step 1 — Align genomes and produce BAM files

Builds a BWA index from the CDS sequences so alignments focus on coding regions, then aligns each complete genome against that index. Outputs sorted alignment files (BAMs) to `./covid19_bams/`. Any BAMs that fail validation are automatically removed.

```
$ ./fastaToBAM.sh ./covid19_downloads
```

---

### Step 2 — Call variants and produce VCF files

**Option A — Viral Profiler**: Run [Viral Profiler](https://github.com/DavidStreid/viral-profiler) pointing at the `./covid19_bams/` output directory.

**Option B — bcftools**: Uses the Wuhan reference genome (NC_045512) as the baseline. Re-aligns each genome to that reference, then compares each sequence position-by-position to identify SNPs. Outputs one VCF per sample to `./covid19_vcfs/`.

```
$ ./bamToVCF.sh
```
