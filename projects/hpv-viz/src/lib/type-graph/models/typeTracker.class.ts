
export const ODDS_RATIO: string = 'oddsRatio';
/**
 * Tracks all the types that have been observed
 */
export class TypeTracker {
  public PLUS_PLUS = '+/+';
  public PLUS_MINUS = '+/-';
  public MINUS_PLUS = '-/+';
  public MINUS_MINUS = '-/-';
  private allTypes: Set<string>;          // All the types that have been recorded for all files added
  private recordedEntries: Set<string>[]; // List of the types recorded in a VCF file, represented by a Set of strings

  constructor() {
    this.allTypes = new Set<string>();
    this.recordedEntries = [];
  }

  /**
   * Adds a list of types that have been recorded in a VCF file
   *
   * @param types, string[]
   */
  public addTypes(types: string[]): void {
    // Tracks all the types from one VCF input file (can be compared to entries from other files)
    const entry = new Set<string>();

    // Update record of all types that have been recorded
    for (const type of types) {
      this.allTypes.add(type);
      entry.add(type);
    }

    // Add entry record for later processing
    this.recordedEntries.push(entry);
  }

  /**
   * Returns the odds ratios calculated from an input VCF file
   *  - For each entry in @recordedEntries, see which types of @allTypes, occurred in that file and record all possible
   *  co-occurrences and whether they occurred in that entry
   *    - E.g.
   *      allTypes: [ A, B, C ]
   *      recordedEntries: [
   *        [ A, B ]            Co-occurrences -  AB: 1, AC: 0, BC: 0
   *        [ B, C]             Co-occurrences -  AB: 0, AC: 0, BC: 1
   *      ]

   *    oddsRatios: {
   *      AB: { ++: 1, +-: 0, -+: 0, --: 1, or: 3}, <- Haldane-Anscombe correction
   *      AC: { ++: 0, +-: 1, -+: 1, --: 0, or: 0},
   *      BC: { ++: 1, +-: 1, -+: 0, --: 0, or: 1},
   *    }
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
      orEntry.set(ODDS_RATIO, oddsRatioCalculation);
    });

    return oddsRatios;
    // TODO - TEST
  }

  /**
   * Returns a default map of all categories set
   */
  private getOddsRatioMap(): Map<string, number> {
    const oddsRatioMap: Map<string, number> = new Map<string, number>();
    oddsRatioMap.set(this.PLUS_PLUS, 0);
    oddsRatioMap.set(this.PLUS_MINUS, 0);
    oddsRatioMap.set(this.MINUS_PLUS, 0);
    oddsRatioMap.set(this.MINUS_MINUS, 0);

    return oddsRatioMap;
  }
}
