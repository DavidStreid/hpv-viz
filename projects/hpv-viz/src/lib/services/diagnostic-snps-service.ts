import {Injectable} from '@angular/core';
import {HPV_16_SNPs} from './hpv16_snps';
import {VCF_ALT, VCF_CHROM, VCF_POS} from '../common/app.const';

/**
 * Service for maintaining list of SNPs used for diagnosis of input files
 */
@Injectable()
export class DiagnosticSnpsService {
  private snpMap: Map<string, string>;  // Map of key: POSITION_VARIANT -> value: LINEAGE

  constructor() {
    this.snpMap = new Map<string, string>();
    this.addSNPsListToMap(HPV_16_SNPs);
  }

  /**
   * Returns the lineage detected if variant is a diagnostic SNP. Returns null if variant is not diagnostic
   *
   * @param variant - ALT column value for the VCF entry
   * @param pos - POS column value for the VCF entry
   */
  public getDetectedLineageFromVariant(variant: string, pos: string): string {
    const key = this.getKey(pos, variant);
    const lineage = this.snpMap.get(key);  // Should return null if lineage isn't detected
    if(lineage){
      return lineage;
    }
    return null;    // Map.get will return undefined
  }

  /**
   * Returns the key for accessing the @snpMap
   * @param variant - ALT column value for the VCF entry
   * @param pos - POS column value for the VCF entry
   */
  private getKey(pos: string, variant: string): string {
    const key = `${pos}_${variant}`;
    return key;
  }

  /**
   * Records a list of diagnostic SNPs into a map
   * @param inputSnps
   */
  private addSNPsListToMap(inputSnps: Object[]): void {
    for(const entry of inputSnps){
      const pos: string = entry[VCF_POS];
      const variant: string = entry[VCF_ALT];
      const chrom: string = entry[VCF_CHROM];

      if(pos && variant && chrom){
        const key = this.getKey(pos, variant);
        if(this.snpMap.has(key)){
          console.error(`Overwriting entry for ${key}: ${this.snpMap.get(key)}`);
        }
        this.snpMap.set(key, chrom);
      } else {
        console.error(`Not adding entry for pos: ${pos}, variant: ${variant}, & chromosome: ${chrom}. Invalid values`);
      }
    }
  }
}
