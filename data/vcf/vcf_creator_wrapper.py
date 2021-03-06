#!/usr/bin/env python

import sys
from os import path

if len(sys.argv) != 3:
  sys.exit("Runtime command: 'python vcf_creator_wrapper.py [INPUT_FILE] [OUTPUT_FILE]'\n\tpython vcf_creator_wrapper.py included_snps.txt diagnostic_snps.vcf")

INPUT = sys.argv[1]
OUTPUT = sys.argv[2]

print("Input: %s, VCF: %s" % (INPUT, OUTPUT))

if path.exists(OUTPUT):
  continue_resp=raw_input("This will overwrite an existing file, %s. Continue (y/n)?\n" % OUTPUT)
  if "n" in continue_resp.lower():
    sys.exit("Not writing to file. Exiting.")
  else:
    print("Removing contents from %s" % OUTPUT)
    open(OUTPUT, 'w').close()

print("Reading file...")
f=open(INPUT, "r")
contents = f.read()
f.close()
lines = contents.split("\n")
entries = []
pair = []
for line in lines:
  pair.append(line)
  if(len(pair) == 2):
    entries.append(pair)
    pair = []

print("Verifying input file (%s) contents..." % INPUT)
# Sanity check
if (len(pair) != 0) and pair[0] != '':
  sys.exit("Check input file - improper parsing")

print("Creating file contents")
file_contents = '##fileformat=VCFv4.1\n#CHROM\tPOS\tID\tREF\tALT\tQUAL\tFILTER\tINFO\tFORMAT\n'
id = 1
for entry in entries:
  chrom = entry[0]
  SNPs = entry[1].split(',')
  for snp in SNPs:
    snp = snp.strip(',').strip()
    variant = snp[-1]
    pos = snp[0:-1]
    line = '%s\t%s\t%s\t.\t%s\t.\t.\t.' % (chrom, str(pos), str(id), variant)
    id += 1
    file_contents += '%s\n' % line

print("Writing file %s..." % OUTPUT)
f=open(OUTPUT, "a+")
f.write(file_contents)
f.close()
print("DONE")
