import {Component, Input, OnChanges, SimpleChanges} from '@angular/core';
import {PatientSummary} from '../models/patient-summary.class';

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

  constructor() {
    this.headers = [];
    this.body = [];
  }

  /**
   * Receives a new patientSummaryInfo change that contains the update. Re-processes the entire map again on each change
   *
   * @param changes
   */
  ngOnChanges(changes: SimpleChanges): void {
    const patientSummaryInfo: Map<string, PatientSummary> = changes.patientSummaryInfo.currentValue;
    const types: string[] = this.getAllTypes(patientSummaryInfo);
    const patients: string[] = Array.from(patientSummaryInfo.keys());

    const body = [];

    // Generate one row - [type, average, Duration (p1), Duration (p2), ...]
    for (const type of types) {
      // Get the durations across patients, i.e. [ Duration (p1), Duration (p2), ... ]
      const row: any[] = this.getDurationsFromPatients(patientSummaryInfo, patients, type);

      // Get the "average" by removing all null cells and summing
      const validDurations = row.filter(cell => cell !== null);
      const sum = validDurations.reduce(function(c1, c2){
        return c1 + c2;
      }, 0);
      const avg: number = sum / validDurations.length;
      row.unshift(avg);

      // Add the "type"
      row.unshift(type);
      body.push(row);
    }
    this.body = body;

    const headers = patients;
    headers.unshift('Average');
    this.headers = headers;
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
