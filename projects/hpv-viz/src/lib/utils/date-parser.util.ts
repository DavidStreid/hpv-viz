import * as moment_ from 'moment';
const moment = moment_;

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
    const dateString: string = this.getSplit( splitName, SUFFIX_DELIMITER, 0);
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
    if ( toSplit === null ) {
      return null;
    }

    const split = toSplit.split(delimiter);
    // Check if the string contained the delimiter to produce split elements
    if ( split.length === 1 ) {
      return null;
    }
    // Check if index is out of range of split
    if ( split.length - 1 < index ) {
      return null;
    }
    return split[index];
  }

  /**
   * Returns the Date value parsed from the string
   *
   * @param dateString, string - Returns the Date value of a valid date string. null return on null input
   */
  private parseDateValue(dateString: string): Date {
    if ( dateString === null ) {
      return null;
    }

    // Try to parse date from the string
    let date = new Date(dateString);
    if (isNaN(date.getTime())) {  // invalid date
      const dateFormat = 'MMDDYYYY';
      const tempDate = this.getDateMoment(dateString, dateFormat);
      if (!isNaN(tempDate.getTime())) {
        date = tempDate;
      } else {
        date = this.getDateMoment('0' + dateString, dateFormat);
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
