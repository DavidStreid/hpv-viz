import { DateOpt } from '../../hpv-viz/src/lib/type-graph/graph-options.enums';

/**
 * NOTE - Run tests before committing changes to this file as many tests use it
 */

// TODO - finish test if needed
export const X_AXIS: Object = {
    [DateOpt.MIN_SEC]: {
      ticks: 6,
      x_min: new Date('Tue Feb 08 2011 18:08:20'),
      x_max: new Date('Fri Mar 18 2011 04:41:40')
    },
    [DateOpt.HOUR]: {
      ticks: null,
      x_min: null,
      x_max: null
    },
    [DateOpt.DAY]: {
      ticks: null,
      x_min: new Date('Wed Jan 26 2011 08:00:00'),
      x_max: new Date('Fri Mar 04 2011 16:00:00')
    },
    [DateOpt.MONTH]: {
      ticks: null,
      x_min: null,
      x_max: null
    },
    [DateOpt.YEAR]: {
      ticks: [new Date('2011-01-01T00:00:00')],
      x_min: null,
      x_max: null
    }
}

export const YEAR_TRANSFORM_DATES: Object = {
  'P1': new Date('2011-01-01T00:00:00'),
  'P2': new Date('2011-01-01T00:00:00'),
  'P3': new Date('2011-01-01T00:00:00'),
  'P4': new Date('2011-01-01T00:00:00'),
  'P5': new Date('2011-01-01T00:00:00'),
  'P6': new Date('2011-01-01T00:00:00')
};

export const INIT_DATA_POINTS_EVENTS: Object[] = [
  {
    name: 'P1',
    date: new Date('2011-02-13T10:38:12'),
    hpvTypes: new Set(['C1', 'C2', 'C3', 'C4', 'C5']),
  },
  {
    name: 'P2',
    date: new Date('2011-03-13T12:30:00'),
    hpvTypes: new Set(['C1', 'C2', 'C3', 'C4', 'C5']),
  },
  {
    name: 'P3',
    date: new Date('2011-02-14T10:38:12'),
    hpvTypes: new Set(['C1', 'C2', 'C3', 'C4', 'C5']),
  },
  {
    name: 'P4',
    date: new Date('2011-02-13T10:38:11'),
    hpvTypes: new Set(['C1', 'C2', 'C3', 'C4', 'C5']),
  },
  {
    name: 'P5',
    date: new Date('2011-02-13T11:38:12'),
    hpvTypes: new Set(['C1', 'C2', 'C3', 'C4', 'C5']),
  },
  {
    name: 'P6',
    date: new Date('2011-02-13T10:20:00'),
    hpvTypes: new Set(['C1', 'C2', 'C3', 'C4', 'C5']),
  }
]

export const INIT_DATA_POINTS: Object[] =
  [
    {
      'name': 'P1',
      date: new Date('2011-02-13T10:38:12'),
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
    },
    {
      'name': 'P2',
      date: new Date('2011-03-13T12:30:00'),
      series: [
        {
          name: new Date('2011-03-13T12:30:00'),
          y: 'C1',
          x: new Date('2011-03-13T12:30:00'),
          r: 1
        },
        {
          name: new Date('2011-03-13T12:30:00'),
          y: 'C2',
          x: new Date('2011-03-13T12:30:00'),
          r: 1
        },
        {
          name: new Date('2011-03-13T12:30:00'),
          y: 'C3',
          x: new Date('2011-03-13T12:30:00'),
          r: 1
        },
        {
          name: new Date('2011-03-13T12:30:00'),
          y: 'C4',
          x: new Date('2011-03-13T12:30:00'),
          r: 1
        },
        {
          name: new Date('2011-03-13T12:30:00'),
          y: 'C5',
          x: new Date('2011-03-13T12:30:00'),
          r: 1
        }
      ]
    },
    {
      'name': 'P3',
      date: new Date('2011-02-14T10:38:12'),
      series: [
        {
          name: new Date('2011-02-14T10:38:12'),
          y: 'C1',
          x: new Date('2011-02-14T10:38:12'),
          r: 1
        },
        {
          name: new Date('2011-02-14T10:38:12'),
          y: 'C2',
          x: new Date('2011-02-14T10:38:12'),
          r: 1
        },
        {
          name: new Date('2011-02-14T10:38:12'),
          y: 'C3',
          x: new Date('2011-02-14T10:38:12'),
          r: 1
        },
        {
          name: new Date('2011-02-14T10:38:12'),
          y: 'C4',
          x: new Date('2011-02-14T10:38:12'),
          r: 1
        },
        {
          name: new Date('2011-02-14T10:38:12'),
          y: 'C5',
          x: new Date('2011-02-14T10:38:12'),
          r: 1
        }
      ]
    },
    {
      'name': 'P4',
      date: new Date('2011-02-13T10:38:11'),
      series: [
        {
          name: new Date('2011-02-13T10:38:11'),
          y: 'C1',
          x: new Date('2011-02-13T10:38:11'),
          r: 1
        },
        {
          name: new Date('2011-02-13T10:38:11'),
          y: 'C2',
          x: new Date('2011-02-13T10:38:11'),
          r: 1
        },
        {
          name: new Date('2011-02-13T10:38:11'),
          y: 'C3',
          x: new Date('2011-02-13T10:38:11'),
          r: 1
        },
        {
          name: new Date('2011-02-13T10:38:11'),
          y: 'C4',
          x: new Date('2011-02-13T10:38:11'),
          r: 1
        },
        {
          name: new Date('2011-02-13T10:38:11'),
          y: 'C5',
          x: new Date('2011-02-13T10:38:11'),
          r: 1
        }
      ]
    },
    {
      'name': 'P5',
      date: new Date('2011-02-13T11:38:12'),
      series: [
        {
          name: new Date('2011-02-13T11:38:12'),
          y: 'C1',
          x: new Date('2011-02-13T11:38:12'),
          r: 1
        },
        {
          name: new Date('2011-02-13T11:38:12'),
          y: 'C2',
          x: new Date('2011-02-13T11:38:12'),
          r: 1
        },
        {
          name: new Date('2011-02-13T11:38:12'),
          y: 'C3',
          x: new Date('2011-02-13T11:38:12'),
          r: 1
        },
        {
          name: new Date('2011-02-13T11:38:12'),
          y: 'C4',
          x: new Date('2011-02-13T11:38:12'),
          r: 1
        },
        {
          name: new Date('2011-02-13T11:38:12'),
          y: 'C5',
          x: new Date('2011-02-13T11:38:12'),
          r: 1
        }
      ]
    },
    {
      'name': 'P6',
      date: new Date('2011-02-13T10:20:00'),
      series: [
        {
          name: new Date('2011-02-13T10:20:00'),
          y: 'C1',
          x: new Date('2011-02-13T10:20:00'),
          r: 1
        },
        {
          name: new Date('2011-02-13T10:20:00'),
          y: 'C2',
          x: new Date('2011-02-13T10:20:00'),
          r: 1
        },
        {
          name: new Date('2011-02-13T10:20:00'),
          y: 'C3',
          x: new Date('2011-02-13T10:20:00'),
          r: 1
        },
        {
          name: new Date('2011-02-13T10:20:00'),
          y: 'C4',
          x: new Date('2011-02-13T10:20:00'),
          r: 1
        },
        {
          name: new Date('2011-02-13T10:20:00'),
          y: 'C5',
          x: new Date('2011-02-13T10:20:00'),
          r: 1
        }
      ]
    }
  ]
