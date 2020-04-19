import {Component, Input, OnChanges, SimpleChanges} from '@angular/core';
import {PatientSummary} from '../models/patient-summary.class';
import {DateOpt} from '../models/graph-options.enums';

@Component({
  selector: ' persistence-view', // tslint:disable-line
  templateUrl: './persistence-view.component.html',
  styleUrls: ['./persistence-view.component.scss']
})
export class PersistenceViewComponent implements OnChanges {
  @Input()
  patientSummaryInfo: Map<string, PatientSummary>;

  public headers: string[]; // Headers for the table -  [       'Average',      Patient1, Patient2, ... ]
  public body: string[][];  // Rows of the table -      [ type, averageLength,  p1Length, p2Length, ... ]
  public dateSelectors: any = {
    [DateOpt.DAY]: {label: 'Day', selector: DateOpt.DAY, selected: false},
    [DateOpt.MONTH]: {label: 'Month', selector: DateOpt.MONTH, selected: false},
    [DateOpt.YEAR]: {label: 'Year', selector: DateOpt.YEAR, selected: true}
  };

  // TAB-TOGGLE CODE (copy-pasta: start)
  public show: boolean;
  public title: string = 'Persistence View';
  public toggleShow(): void{
    this.show = !this.show;
  }
  // TAB-TOGGLE CODE (copy-pasta: end)

  constructor() {
    this.headers = [];
    this.body = [];
  }

  /**
   * Handles event emitted by select box
   */
  public handleDateToggle(toggleOpt: DateOpt): void {
    const currOpt = this.getSelectedTimeOption();
    if (toggleOpt === currOpt) {
      return;
    }
    this.changeTimeSelector(toggleOpt, currOpt);

    this.updateTable(this.patientSummaryInfo);
  }

  /**
   * Toggles global time selector map so that previous opt is toggled off and input timeselector is toggled on.
   */
  public changeTimeSelector(toggleOpt: DateOpt, currOpt: DateOpt): void {
    this.dateSelectors[currOpt]['selected'] = false;
    this.dateSelectors[toggleOpt]['selected'] = true;
  }

  /**
   * Returns the selected time option from the global map. Package private for tests
   */
  getSelectedTimeOption(): DateOpt {
    for (const key in this.dateSelectors) {
      if (this.dateSelectors.hasOwnProperty(key)) {
        const opt = this.dateSelectors[key] || {};
        if (opt['selected']) {
          return opt['selector'];
        }
      }
    }
    return null;
  }

  /**
   * Updates table in view based on input @patientSummaryInfo
   * @param patientSummaryInfo
   */
  updateTable(patientSummaryInfo: Map<string, PatientSummary>): void {
    const types: string[] = this.getAllTypes(patientSummaryInfo);
    const patients: string[] = Array.from(patientSummaryInfo.keys());

    const body = [];

    // Generate one row - [type, average, Duration (p1), Duration (p2), ...]
    for (const type of types) {
      // Get the durations across patients, i.e. [ Duration (p1), Duration (p2), ... ]
      let row: any[] = this.getDurationsFromPatients(patientSummaryInfo, patients, type);

      // Get the "average" by removing all null cells and summing
      const validDurations = row.filter(cell => cell !== null);
      const sum = validDurations.reduce(function(c1, c2){
        return c1 + c2;
      }, 0);
      const avg: any = this.formatMilliSeconds(sum / validDurations.length);

      // Format to milliseconds
      row = row.map((entry) => {return this.formatMilliSeconds(entry)});
      row = row.map((entry) => {
        if(entry == 0){
          // Absolute equality won't work if entry is "0.00"
          return "n/a";
        }
        return entry;
      });


      row.unshift(avg);

      // Add the "type"
      row.unshift(type);
      body.push(row);
    }

    // Sort the rows in descending order for the average duration
    this.body = body.sort((row1, row2) => {
      return row2[1] - row1[1];
    });

    const headers = patients;
    headers.unshift('Average');
    this.headers = headers;
  }

  /**
   * Receives a new patientSummaryInfo change that contains the update. Re-processes the entire map again on each change
   *
   * @param changes
   */
  ngOnChanges(changes: SimpleChanges): void {
    const patientSummaryInfo: Map<string, PatientSummary> = changes.patientSummaryInfo.currentValue;
    this.updateTable(patientSummaryInfo);
  }

  /**
   * Returns the formatted milliseconds
   * @param time
   */
  private formatMilliSeconds(time: number): string {
    const years = (1000 * 60 * 60 * 24 * 365);
    const months = (1000 * 60 * 60 * 24 * 12);
    const days = (1000 * 60 * 60 * 24);
    let divisor = years;
    if(this.dateSelectors[DateOpt.MONTH].selected){
      divisor = months;
    } else if(this.dateSelectors[DateOpt.DAY].selected){
      divisor = days;
    }

    return (time/divisor).toFixed(2);
  }

  /**
   * Returns all the types present in the patientSummaryInfo across all patients
   *
   * @param patientSummaryInfo
   */
  private getAllTypes(patientSummaryInfo: Map<string, PatientSummary>): string[] {
    const types: Set<string> = new Set<string>();

    patientSummaryInfo.forEach((summary: PatientSummary, patient: string) => {
      const typeList: string[] = summary.getTypes();
      for(const type of typeList){
        types.add(type);
      }
    });

    return Array.from(types);
  }

  /**
   * Returns a list of the durations for which the input @patients have carried the input @type
   *
   * @param patientSummaryInfo
   * @param patients
   * @param type
   */
  private getDurationsFromPatients(patientSummaryInfo: Map<string, PatientSummary>, patients: string[], type: string): number[] {
    const durations: number[] = [];
    let summary: PatientSummary;
    for (const patient of patients) {
      summary = patientSummaryInfo.get(patient);
      durations.push(summary.getTypeDuration(type));
    }
    return durations;
  }
}
