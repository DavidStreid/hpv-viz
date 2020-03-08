import { Injectable }     from '@angular/core';
import {  HEADER_START,
          COLUMN_START,
          FILE_DATE,
          EQUALS }          from './vcf-constants';
import * as moment_ from 'moment';
const moment = moment_;

@Injectable({
  providedIn: 'root'
})
export class VcfParserService {

  constructor() {}

  /**
   * Returns whether the VCF file is valid
   * TODO - Add more checks
   *
   * @param line (string) - line in the vcf file
   */
  isInvalidVCF(vcfFile: string) {
    if ( vcfFile == null ) { return true; }
    return false;
  }

  /**
   * Returns whether the input line contains the header marker
   *
   * @param line (string) - line in the vcf file
   */
  isNotHeaderLine(line: string): boolean {
    const trimmedLine = line.trim();  // Remove any whitespace
    return !trimmedLine.startsWith(HEADER_START) && !trimmedLine.startsWith(COLUMN_START);
  }

  /**
   * Looking for line that begins w/ the COLUMN_START character, e.g. '#'. And not HEADER_START, e.g. '##'
   *
   * @param line - line of vcf file
   */
  isColumnHeader(line: string): boolean {
    const trimmedLine = line.trim();  // Remove any whitespace
    return !trimmedLine.startsWith(HEADER_START) && trimmedLine.startsWith(COLUMN_START);
  }

  /**
   * Returns the columns of a file that describe the variant info
   * TODO - This reads through the entire file, which often has happened before or will happen after. This method
   *        is modular, but inefficient.
   *
   * @param vcfContents(string) - string contents of vcf file
   */
  getColumns(vcfContents: string): string[] {
    if ( this.isInvalidVCF(vcfContents) ) {
      console.error('VCF File not detected');
      return;
    }

    const lines = vcfContents.split('\n');
    const columnLines = lines.filter(this.isColumnHeader);

    // There should only be one line for columns
    if (columnLines.length !== 1) { return []; }

    // Remove any headers and split
    return columnLines[0].replace(COLUMN_START, '').split(/\s+/);
  }

  /**
   * Returns only the variant lines (not including the header) of the vcf file
   *
   * @param vcfFile - vcf contents as string
   */
  getVariantLines(vcfFile: string): string[] {
    if ( this.isInvalidVCF(vcfFile) ) {
      console.error('VCF File not detected');
      return;
    }

    // Read through lines and parse out non-header lines
    const lines = vcfFile.split('\n');
    const variantLines = lines.filter(this.isNotHeaderLine);

    return variantLines;
  }

  /**
   * Returns only the variant lines (not including the header) of the vcf file
   *
   * @param vcfFile - vcf contents as string
   */
  getMetadatLines(vcfFile: string): string[] {
    if ( this.isInvalidVCF(vcfFile) ) {
      console.error('VCF File not detected');
      return;
    }

    // Read through lines and parse out non-header lines
    const lines = vcfFile.split('\n');
    const variantLines = lines.filter((line) => {return !this.isNotHeaderLine(line)});

    return variantLines;
  }

  /**
   * Parses the date from the "fileDate" field of a vcf field. There are other date fields, but this is the common field
   *
   * @param vcfFile - string
   */
  extractDate( vcfFile: string): Date {
    if ( this.isInvalidVCF(vcfFile) ) {
      console.error('VCF File not detected');
      return;
    }

    const lines = vcfFile.split('\n');
    for ( const line of lines ) {
      // Searching for '##fileDate=DATE' line
      if ( line.includes(FILE_DATE) ) {
        const equalsSplit = line.split(EQUALS);
        const dateString = equalsSplit[1];

        let date = new Date(dateString);
        if (isNaN(date.getTime())) {  // invalid date
          const mDate = moment(dateString, 'YYYYMMDD').format();
          date = new Date(mDate);
        }

        if ( date instanceof Date ) {
          return date;
        }
      }
    }

    return null;
  }

  /**
   * Performs any cleaning of the vcf file
   *
   * @param vcfFile, string - contents of vcf file
   */
  cleanVcf(vcfFile: string) {
    // Remove white space (including new lines)
    return vcfFile.trim();
  }

  /**
   * Extracts enriched mutation objects from the vcf file
   *
   * @param vcfFile - string contents of a vcf file
   */
  extractVariantInfo(vcfFile: string): Object[] {
    const cleanVcf = this.cleanVcf(vcfFile);

    const data = this.getVariantLines(cleanVcf);
    const columns: string[] = this.getColumns(cleanVcf);

    const mutationInfo: Object[] = [];

    const vcfTypes: Set<string> = new Set<string>();

    // Parse through lines of data and create object of data
    for ( const line of data ) {
      const variantInfo = {};

      const lineSplit = line.split(/\s+/);
      for ( let i = 0; i < columns.length; i++ ) {
        variantInfo[ columns[i] ] = lineSplit[i];
      }

      // Extract unique type information
      vcfTypes.add(variantInfo['CHROM']);

      mutationInfo.push(variantInfo);
    }
    // TODO - constants
    mutationInfo['types'] = [...vcfTypes];  // Return list of all unique types

    return mutationInfo;
  }

  /**
   * Parses VCF metadata lines into an object
   *
   * @param vcfFile, string
   */
  public extractMetadata(vcfFile: string): Object {
    const cleanVcf = this.cleanVcf(vcfFile);
    const data = this.getMetadatLines(cleanVcf);

    const metaData: Object = {};
    // Parse through lines of data and create object of data
    let key, value;
    for ( const line of data ) {
      if(line){
        const strippedLine = line.replace(HEADER_START, '');

        const inlineSplit = strippedLine.split(';');
        for(const inlineVal of inlineSplit){
          const kv = inlineVal.split(EQUALS);
          if(kv.length === 2){
            key = kv[0];
            value = kv[1];
            metaData[key] = value;
          }
        }
      }
    }

    return metaData;
  }

  /**
   * Returns set of all chromosomes in the vcf file
   *
   * @param vcfFile - Input string taken from vcf file
   */
  extractChromosomes(vcfFile: string): Set<string> {
    const chromosomes = new Set();
    const data = this.getVariantLines(vcfFile);

    // Parse through lines of data and return
    for ( const line of data ) {
      const columns = line.split(/\s+/);
      if ( columns.length > 1 ) {
        const chr = columns[0];
        chromosomes.add(chr);
      }
    }

    return chromosomes;
  }
}
