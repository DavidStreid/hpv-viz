/**
 * Question: Why not import "* as moment from moment""?
 *
 * Answer: This is a finicky import. After a moment update, this should work and not throw this
 *  "hpv/projects/hpv-viz/node_modules/moment/moment"' has no default export." has no default export.
 *  Apparently moment usually explodes a function, which would probably be done at runtime and not compile-time.
 *  So just play around with this?
 * Ref - https://stackoverflow.com/questions/35272832/systemjs-moment-is-not-a-function
 */
// @ts-ignore
import moment from 'moment';

export default class DateParserUtil {
  /**
   * Returns the date if in the string.
   *    e.g. 'P1_3161994.ann.vcf' -> Date('Wed Mar 16 1994 00:00:00 GMT-0500')
   *
   * @param name: string - fileName
   */
  public getDateFromFileName(name: string): Date {
    const NAME_DELIMITER = '_';
    const SUFFIX_DELIMITER = '.';

    // 'P1_20190511.ann.vcf' -> '20190511.ann.vcf'
    const splitName: string = this.getSplit(name, NAME_DELIMITER, 1);
    // '20190511.ann.vcf' -> '20190511'
    const dateString: string = this.getSplit(splitName, SUFFIX_DELIMITER, 0);
    const date = this.parseDateValue(dateString);

    return date;
  }

  /**
   * Returns the element at the position of the split string if it exists. Returns null if it doesn't exist
   *    e.g. 'P1_20190511.ann.vcf' -> '20190511.ann.vcf'
   *
   * @param toSplit, string - string that will be split on the delimiter
   * @param delimiter, string - delimiting string
   * @param index, number - index of the split string to return
   */
  private getSplit(toSplit: string, delimiter: string, index: number): string {
    if (toSplit === null) {
      return null;
    }

    const split = toSplit.split(delimiter);
    // Check if the string contained the delimiter to produce split elements
    if (split.length === 1) {
      return null;
    }
    // Check if index is out of range of split
    if (split.length - 1 < index) {
      return null;
    }
    return split[index];
  }

  /**
   * Returns the Date value parsed from the string. If no date can be parsed, return a null
   *
   * @param dateString, string - Returns the Date value of a valid date string. null return on null input
   */
  private parseDateValue(dateString: string): Date {
    if (dateString === null) {
      return null;
    }

    // Try to parse date from the string
    let date = new Date(dateString);
    if (this.isValidDate(date)) {
      // Valid date - return
      return date;
    }

    // Try to parse out date w/ different formats
    date = this.tryDateFormats(dateString);
    if (this.isValidDate(date)) {
      return date;
    }

    // Handle special cases
    // TODO - Write tests
    if (dateString && dateString.length === 7) {
      // TRY: 1) 3111999 -> 03111999, 2) 1999311 -> 19990311, 3) 1999113 -> 19991103
      const appendedStrings = [`0${dateString}`,
        `${dateString.slice(0, 4)}0${dateString.slice(4, 7)}`,
        `${dateString.slice(0, 6)}0${dateString.slice(6, 7)}`
      ];

      for (const formatted of appendedStrings) {
        date = this.tryDateFormats(formatted);
        if (this.isValidDate(date)) {
          // console.log(`SUCCESS - special-case date extraction for ${dateString}: ${date}`);
          return date;
        }
      }
    }
    console.log(`FAILED - special-case date extraction for ${dateString}`);
    return null;
  }

  /**
   * Returns whether input is a valid date
   * @param date
   */
  private isValidDate(date: any): boolean {
    return !isNaN(date.getTime());
  }

  /**
   * Attempts to format input string into date using accepted formats
   * @param dateString
   */
  private tryDateFormats(dateString: string): Date {
    let date;
    // Try the following formats to extract a date value
    const dateFormats = ['MMDDYYYY', 'YYYYMMDD'];
    for (const dateFormat of dateFormats) {
      date = this.getDateMoment(dateString, dateFormat);
      if (!isNaN(date.getTime())) {
        // Valid date - return
        return date;
      }
    }

    return date;
  }

  /**
   * Returns the date object using an input format
   *
   * @param dateString, string - string containing the date
   * @param dateFormat, string - Format of the dateString, e.g. 'MMDDYYYY'
   */
  private getDateMoment(dateString: string, dateFormat: string): Date {
    const mDate = moment(dateString, dateFormat).format();
    const tempDate = new Date(mDate);

    return tempDate;
  }
}
