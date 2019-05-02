import { P1_MOCK } from './vcf-files/mock-vcfs';

/**
 * IF MODIFIED, YOU NEED TO RE-RUN THE TESTS TO MAKE SURE THEY PASS
 * THIS FILE IS USED BY MANY OF THE TEST FILES
 */
export const TEST_FILES: object = {
  'P1_MOCK': {
    contents: P1_MOCK,
    event: {
      name: 'P1',
      date: new Date( 'Sun Feb 13 2011 10:38:12 GMT-0500 (Eastern Standard Time)' ),
      hpvTypes: new Set(['C1', 'C2', 'C3', 'C4', 'C5']),
    },
    datapoint: {
      name: 'P1',
      date: new Date( 'Sun Feb 13 2011 10:38:12 GMT-0500 (Eastern Standard Time)' ),
      series: [
        {
          name: new Date('2011-02-13T10:38:12'),
          y: 'C1',
          x: new Date('2011-02-13T10:38:12'),
          r: 1
        },
        {
          name: new Date('2011-02-13T10:38:12'),
          y: 'C2',
          x: new Date('2011-02-13T10:38:12'),
          r: 1
        },
        {
          name: new Date('2011-02-13T10:38:12'),
          y: 'C3',
          x: new Date('2011-02-13T10:38:12'),
          r: 1
        },
        {
          name: new Date('2011-02-13T10:38:12'),
          y: 'C4',
          x: new Date('2011-02-13T10:38:12'),
          r: 1
        },
        {
          name: new Date('2011-02-13T10:38:12'),
          y: 'C5',
          x: new Date('2011-02-13T10:38:12'),
          r: 1
        }
      ]
    }
  }
}
