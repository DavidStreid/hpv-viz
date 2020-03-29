/**
 * Class for Map of vcf information
 *
 *    vcfMap: {
 *        chrom: {
 *            date: {
 *                sample: [{}, ...]
 *            }
 *        }
 *
 *    }
 */
export class VcfMap {
  private vcfMap: Map<string, Map<string, any>>;

  constructor() {
    this.vcfMap = new Map<string, Map<string, any>>();
  }

  /**
   * Clears the current state of the map
   */
  public clear() {
    this.vcfMap = new Map<string, Map<string, any>>();
  }

  public keys(): string[] {
    return Array.from(this.vcfMap.keys());
  }

  /* TODO - Depcrecated */
  public numEntries(k: string): number {
    const dMap: Map<string, Map<string, Object[]>> = this.vcfMap.get(k);
    if (dMap === undefined) {
      return 0;
    }

    let numEntries = 0;

    for (const d of Array.from(dMap.keys())) {
      const cMap: Map<string, Object[]> = dMap.get(d);
      for (const c of Array.from(cMap.keys())) {
        const entries: Object[] = cMap.get(c);
        numEntries += entries.length;
      }
    }

    return numEntries;
  }

  /**
   * Returns the number of recorded variants on a certain date
   * 
   * @param k
   * @param date
   */
  public numEntriesOnDate(k: string, date: Date): number {
    const dMap: Map<string, Map<string, Object[]>> = this.vcfMap.get(k);
    const dateKey: string = this.dateKey(date);
    if (dMap === undefined || !dMap.has(dateKey)) {
      return 0;
    }

    let numEntries = 0;
    const cMap: Map<string, Object[]> = dMap.get(dateKey);
    for (const c of Array.from(cMap.keys())) {
      const entries: Object[] = cMap.get(c);
      numEntries += entries.length;
    }

    return numEntries;
  }

  /**
   * Adds an entry to the map
   *
   * @param sample, string - sample the entry belongs to
   * @param entry, Object - enriched object of variant information taken from a line of the vcf
   */
  add(sample: string, entry: Object) {
    const date: Date = entry['name'];
    const data: Object = entry['data'] || {};
    const chrom = data['CHROM'];

    if (sample === undefined || date === undefined || chrom === undefined) {
      // Impropertly-formatted object. Return and log error
      console.error(`Invalid parameters - date: ${date}, sample: ${sample}, data: ${data}, chrom: ${chrom}`);
      return;
    }

    const dateKey = this.dateKey(date);
    const nMap: Map<string, any> = this.computeIfAbsent(this.vcfMap, chrom, new Map<string, any>());
    const cMap: Map<string, Object[]> = this.computeIfAbsent(nMap, dateKey, new Map<string, Object[]>());
    const entries: Object[] = this.computeIfAbsent(cMap, sample, []);
    entries.push(data);
    cMap.set(sample, entries);
  }

  /**
   * Gets map data. To return higher levels of the map, pass implicit parameters as undefined
   *
   * @param sample, string - sample of the vcf
   * @param date, Date - date of the vcf sampling
   * @param chr, string - Chromosome
   */
  get(sample: string, date: Date, chr: string) {
    const sMap = this.vcfMap.get(chr);
    if (this.vcfMap.has(chr) && date !== null) {
      const dateKey = this.dateKey(date);
      const dMap = sMap.get(dateKey);
      if (sMap.has(dateKey) && sample !== null) {
        return dMap.get(sample);
      }
    }
    return sMap;
  }

  private dateKey(date: Date): string {
    return date.toDateString();
  }

  /**
   * Computes a value of the map if it doesn't already exist. If it does exist, returns that value
   *
   * @param map, Map - Input map to check for membership
   * @param key, string - key being queried
   * @param val, any - value to assign to key if key does not already exist in map
   */
  private computeIfAbsent(map: Map<string, any>, key: string, val: any) {
    if (map.has(key)) {
      return map.get(key);
    }
    map.set(key, val);
    return map.get(key);
  }
}
