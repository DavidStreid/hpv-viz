import {async} from '@angular/core/testing';
import DateParserUtil from './date-parser.util';

describe('DateParserUtil', () => {
  let util: DateParserUtil;

  beforeEach(async(() => {
    util = new DateParserUtil();
  }));

  const dateCases = [
    ['P1_19941028.hpv.bam.vcf', 'Wed Oct 28 1994 00:00:00'],   // Not a special case
    ['P2_9091994.ann.vcf', 'Fri Sep 09 1994 00:00:00'],        // Special case - Need to format "9091994" -> "09091994"
    ['P3_11121993.ann.vcf', 'Fri Nov 12 1993 00:00:00'],       // Not a special case
    ['P4.ann.vcf', null]
  ];
  it(`${dateCases[0][0]} -> ${dateCases[0][1]}`, () => {
    const date: Date = util.getDateFromFileName(dateCases[0][0]);
    expect(date).toEqual(new Date(dateCases[0][1]));
  });
  it(`${dateCases[1][0]} -> ${dateCases[1][1]}`, () => {
    const date: Date = util.getDateFromFileName(dateCases[1][0]);
    expect(date).toEqual(new Date(dateCases[1][1]));
  });
  it(`${dateCases[2][0]} -> ${dateCases[2][1]}`, () => {
    const date: Date = util.getDateFromFileName(dateCases[2][0]);
    expect(date).toEqual(new Date(dateCases[2][1]));
  });
  it(`${dateCases[3][0]} -> ${dateCases[3][1]}`, () => {
    const date: Date = util.getDateFromFileName(dateCases[3][0]);
    expect(date).toEqual(null);
  });
});
