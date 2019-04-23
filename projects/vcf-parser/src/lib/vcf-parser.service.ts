import { Injectable }               from '@angular/core';
import { DELIMITER, HEADER_START, COLUMN_START }  from './vcf-constants';

@Injectable({
  providedIn: 'root'
})
export class VcfParserService {

  constructor() {}

  // TODO - Implement
  isInvalidVCF(vcfFile: string) {
    return false;
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
      return !line.startsWith(HEADER_START) && !line.startsWith(COLUMN_START);
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
