import {P1_MOCK} from './vcf-files/mock-vcfs';

/**
 * IF MODIFIED, YOU NEED TO RE-RUN THE TESTS TO MAKE SURE THEY PASS
 * THIS FILE IS USED BY MANY OF THE TEST FILES
 */
export const TEST_FILES: object = {
  'P1_MOCK': {
    contents: P1_MOCK,
    event: {
      name: 'P1',
      date: new Date('Sun Feb 13 2011 00:00:00'),
      variantInfo: {
        'variantInfo': [
          {'CHROM': 'TEST_CHROM'}
        ],
        'types': ['TEST_CHROM']
      }
    },
    datapoint: {
      name: 'P1',
      date: new Date('Sun Feb 13 2011 00:00:00'),
      series: [
        {
          name: new Date('2011-02-13T00:00:00'),
          y: 'C1',
          x: new Date('2011-02-13T00:00:00'),
          r: 1
        },
        {
          name: new Date('2011-02-13T00:00:00'),
          y: 'C2',
          x: new Date('2011-02-13T00:00:00'),
          r: 1
        },
        {
          name: new Date('2011-02-13T00:00:00'),
          y: 'C3',
          x: new Date('2011-02-13T00:00:00'),
          r: 1
        },
        {
          name: new Date('2011-02-13T00:00:00'),
          y: 'C4',
          x: new Date('2011-02-13T00:00:00'),
          r: 1
        },
        {
          name: new Date('2011-02-13T00:00:00'),
          y: 'C5',
          x: new Date('2011-02-13T00:00:00'),
          r: 1
        }
      ]
    }
  }
};
