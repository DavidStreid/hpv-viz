export const ODDS_RATIO = 'oddsRatio';
export const PLUS_PLUS = '+/+';
export const PLUS_MINUS = '+/-';
export const MINUS_PLUS = '-/+';
export const MINUS_MINUS = '-/-';
/**
 * Tracks all the types that have been observed
 */
export class TypeTracker {
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
          let cell = MINUS_MINUS;
          if (entry.has(t1) && entry.has(t2)) {
            cell = PLUS_PLUS;
          } else if (entry.has(t1)) {
            cell = PLUS_MINUS;
          } else if (entry.has(t2)) {
            cell = MINUS_PLUS;
          }
          oddsRatioEntry.set(cell, oddsRatioEntry.get(cell) + 1);
        }
        oddsRatios.set(key, oddsRatioEntry);
      }
    }

    oddsRatios.forEach((orEntry: Map<string, number>, key: Set<string>) => {
      let numerator: number = orEntry.get(PLUS_PLUS) + orEntry.get(MINUS_MINUS);
      let denominator: number = orEntry.get(PLUS_MINUS) + orEntry.get(MINUS_PLUS);

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
    oddsRatioMap.set(PLUS_PLUS, 0);
    oddsRatioMap.set(PLUS_MINUS, 0);
    oddsRatioMap.set(MINUS_PLUS, 0);
    oddsRatioMap.set(MINUS_MINUS, 0);

    return oddsRatioMap;
  }
}

