
export const ODDS_RATIO: string = 'oddsRatio';
/**
 * Tracks all the types that have been observed
 */
export class TypeTracker {
  public PLUS_PLUS = '+/+';
  public PLUS_MINUS = '+/-';
  public MINUS_PLUS = '-/+';
  public MINUS_MINUS = '-/-';
  private allTypes: Set<string>;
  private recordedEntries: Set<string>[];

  constructor() {
    this.allTypes = new Set<string>();
    this.recordedEntries = [];
  }

  /**
   * Adds a list of types that have been recorded in a VCF file
   *
   * @param types
   */
  public addTypes(types: string[]): void {
    const entry = new Set<string>();

    // Update record of all types that have been recorded
    for (const type of types) {
      this.allTypes.add(type);
      entry.add(type);
    }

    this.recordedEntries.push(entry);
  }

  /**
   * Returns the odds ratios calculated from an input VCF file
   */
  public calculateOddsRatios(): Map<Set<string>, Map<string, number>> {
    const oddsRatios: Map<Set<string>, Map<string, number>> = new Map<Set<string>, Map<string, number>>();

    const types = Array.from(this.allTypes);
    for (let i = 0; i < types.length; i++) {
      for (let j = i + 1; j < types.length; j++) {
        const t1: string = types[i];
        const t2: string = types[j];
        const key = new Set<string>([t1, t2]);    // Unique key for the two types
        const oddsRatioEntry: Map<string, number> = this.getOddsRatioMap();
        for (const entry of this.recordedEntries) {
          let cell = this.MINUS_MINUS;
          if (entry.has(t1) && entry.has(t2)) {
            cell = this.PLUS_PLUS;
          } else if (entry.has(t1)) {
            cell = this.PLUS_MINUS;
          } else if (entry.has(t2)) {
            cell = this.MINUS_PLUS;
          }
          oddsRatioEntry.set(cell, oddsRatioEntry.get(cell) + 1);
        }
        oddsRatios.set(key, oddsRatioEntry);
      }
    }

    oddsRatios.forEach((orEntry: Map<string, number>, key: Set<string>) => {
      let numerator: number = orEntry.get(this.PLUS_PLUS) + orEntry.get(this.MINUS_MINUS);
      let denominator: number = orEntry.get(this.PLUS_MINUS) + orEntry.get(this.MINUS_PLUS);

      if (denominator === 0) {
        // Haldane-Anscombe correction
        numerator += 1;
        denominator += 1;
      }

      const oddsRatioCalculation: number = numerator / denominator;

      console.log(oddsRatioCalculation);

      orEntry.set(ODDS_RATIO, oddsRatioCalculation);
    });

    return oddsRatios;
  }

  private getOddsRatioMap(): Map<string, number> {
    const oddsRatioMap: Map<string, number> = new Map<string, number>();
    oddsRatioMap.set(this.PLUS_PLUS, 0);
    oddsRatioMap.set(this.PLUS_MINUS, 0);
    oddsRatioMap.set(this.MINUS_PLUS, 0);
    oddsRatioMap.set(this.MINUS_MINUS, 0);

    return oddsRatioMap;
  }
}
