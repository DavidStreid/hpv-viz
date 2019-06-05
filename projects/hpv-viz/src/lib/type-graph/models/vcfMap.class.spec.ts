import { VcfMap } from './vcfMap.class';

describe('VcfMap', () => {
  const sample = 'MOCK_SAMPLE';
  const chrom = 'TEST_CHROM';
  const date: Date = new Date();
  const data: Object = { 'CHROM': chrom };
  // TODO - make this a class?
  const entry = {
    name: date, // name of the entry is typically the date
    data: data
  };

  it('Adding to map creates an entry', () => {
    const vcfMap = new VcfMap();
    vcfMap.add(sample, entry);
    expect(vcfMap.numEntries(chrom)).toBe(1);
  });

  it('Multipe entries - numEntries, keys, & clear', () => {
    const chromosomes: string[] = [ 'C1', 'C2', 'C3' ];
    const vcfMap = new VcfMap();

    /**
     * Convoluted way of adding 5 entries for c1, 10 entries for c2, & 15 entries fo r c3
     */
    for ( let i = 0; i < chromosomes.length; i++) {
      for ( let j = 0; j < (i + 1) * 5; j++) {
        const e = JSON.parse(JSON.stringify(entry)); // Need a deep copy since entry is used throughout test file
        e['data']['CHROM'] = chromosomes[i];
        e['name'] = new Date(e['name']);
        vcfMap.add(`s${i}`, e);
      }
    }

    // Testing for correct amounts
    for ( let i = 0; i < chromosomes.length; i++) {
      expect(vcfMap.numEntries(chromosomes[i])).toBe((i + 1) * 5);
    }

    expect(vcfMap.keys()).toEqual(chromosomes);

    vcfMap.clear();

    expect(vcfMap.keys()).toEqual([]);
  });

  it('get retrieves added entry', () => {
    const vcfMap = new VcfMap();
    vcfMap.add(sample, entry);
    expect(vcfMap.get(sample, date, chrom)).toEqual([data]);
  });
});
