import {async} from '@angular/core/testing';
import DateParserUtil from './date-parser.util';

describe('DateParserUtil', () => {
  let util: DateParserUtil;

  beforeEach(async(() => {
    util = new DateParserUtil();
  }));

  it('\P1_19941028.hpv.bam.vcf\' -> \'Wed Nov 28 1994 00:00:00 GMT-0500\'', () => {
    const date: Date = util.getDateFromFileName('P1_19941028.hpv.bam.vcf');
    expect(date).toEqual(new Date('Wed Nov 28 1994 00:00:00 GMT-0500'));
  });

  it('\P1_3161994.ann.vcf\' -> \'Wed Mar 16 1994 00:00:00 GMT-0500\'', () => {
    const date: Date = util.getDateFromFileName('P1_3161994.ann.vcf');
    expect(date).toEqual(new Date('Wed Mar 16 1994 00:00:00 GMT-0500'));
  });

  it('\P2_9091994.ann.vcf\' -> \'Fri Sep 09 1994 00:00:00 GMT-0400\'', () => {
    const date: Date = util.getDateFromFileName('P2_9091994.ann.vcf');
    expect(date).toEqual(new Date('Fri Sep 09 1994 00:00:00 GMT-0400'));
  });

  it('\P3_11121993.ann.vcf\' -> \'Fri Nov 12 1993 00:00:00 GMT-0500\'', () => {
    const date: Date = util.getDateFromFileName('P3_11121993.ann.vcf');
    expect(date).toEqual(new Date('Fri Nov 12 1993 00:00:00 GMT-0500'));
  });

  it('\'P4.ann.vcf\' -> null', () => {
    const date: Date = util.getDateFromFileName('P4.ann.vcf');
    expect(date).toEqual(null);
  });
});
