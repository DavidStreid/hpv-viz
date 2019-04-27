import { Injectable }     from '@angular/core';
import {  DELIMITER,
          HEADER_START,
          COLUMN_START,
          UTC_TIME,
          EQUALS }          from './vcf-constants';

@Injectable({
  providedIn: 'root'
})
export class VcfParserService {

  constructor() {}

  // TODO - Implement
  isInvalidVCF(vcfFile: string) {
    return false;
  }

  extractDate( vcfFile: string): Date {
    if( this.isInvalidVCF(vcfFile) ){
      console.error('VCF File not detected');
      return;
    }

    const lines = vcfFile.split('\n');
    for( let line of lines ){
      // Searching for '##fileDate=DATE' line
      if( line.includes(UTC_TIME) ){
        const equalsSplit = line.split(EQUALS);
        const dateString = equalsSplit[1];
        const date = new Date(dateString);
        if( date instanceof Date ){
          return date;
        }
      }
    }

    return null;
  }

  extractChromosomes(vcfFile: string): Set<string> {
    if( this.isInvalidVCF(vcfFile) ){
      console.error('VCF File not detected');
      return;
    }

    const chromosomes = new Set();
    const lines = vcfFile.split('\n');

    // Parse through headers
    function isNotHeaderLine(line) {
      const trimmedLine = line.trim();  // Remove any whitespace
      return !trimmedLine.startsWith(HEADER_START) && !trimmedLine.startsWith(COLUMN_START);
    }
    const data = lines.filter(isNotHeaderLine);

    // Parse through lines of data and return
    for( let line of data ){
      let columns = line.split(DELIMITER);
      if( columns.length > 1 ){
        let chr = columns[0]
        chromosomes.add(chr);
      }
    }

    return chromosomes;
  }
}
