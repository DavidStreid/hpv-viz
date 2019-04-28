/**
* ENUM for date evaluation
*   1. ORDER MATTERS - Keep order in descending order of if value is required, all succeeding values are also required
*       e.g.
*         If showing detail up to DAY,
*           Required:     [ DAY, MONTH, YEAR ]
*           Not Required: [ MIN_SEC, HOUR ]
*   2. ALPHABETIZE VALUES ACCORDING TO 1
*       - Important for GUI. Component maintains time-options in map, which *ngFor lists in alphabetical order
*/
export enum DateOpt {
  MIN_SEC = "0_MS",
  HOUR    = "1_H",
  DAY     = "2_D",
  MONTH   = "3_M",
  YEAR    = "4_Y"
};
