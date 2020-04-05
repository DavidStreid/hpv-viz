/**
 * Tracks the dates that a type for a ptient has been recorded
 */
class TypeInfo {
  private dates: Date[];    // Dates that type has been present
  private duration: number; // Duration that type has been present in the patient

  constructor() {
    this.dates = [];
    this.duration = 0;
  }

  /**
   * Returns the duration of the type
   */
  public getDuration(): number {
    return this.duration;
  }

  public addDate(date: Date) {
    this.dates.push(date);
    // Date::getTime - milliseconds since 1 January 1970 00:00:00.
    this.dates.sort((d1, d2) => d1.getTime() - d2.getTime());

    const first: Date = this.dates[0];
    const last: Date = this.dates[this.dates.length - 1];

    this.duration = last.getTime() - first.getTime();

    if (this.duration < 0) {
      console.log(this.duration);
    }
  }
}

/**
 * Class for Toggle
 * Keeps track of @name to a set of @data (E.g. HPV Type -> Set ot patients with that HPV type)
 */
export class PatientSummary {
  private name;                         // Identifier of patient
  private dates: Date[];                // All recorded dates the patient has sequencing data for
  private types: Map<string, TypeInfo>; // types to the information for that Type

  constructor(name: string) {
    this.name = name;
    this.dates = [];
    this.types = new Map<string, TypeInfo>();
  }

  /**
   * Returns all types associated with the patient
   */
  public getTypes(): string[] {
    return Array.from(this.types.keys());
  }

  /**
   * Returns the duration that a type has been present in the patient
   * @param type
   */
  public getTypeDuration(type: string): number {
    if(this.types.has(type)){
      return this.types.get(type).getDuration();
    }
    return null;
  }

  public addTypesOnDate(date: Date, types: string[]): void {
    this.addDate(date);
    for (const type of types) {
      if (!this.types.has(type)) {
        this.types.set(type, new TypeInfo());
      }
      this.types.get(type).addDate(date);
    }
  }

  private addDate(date: Date): void {
    this.dates.push(date);
    this.dates.sort();
  }
}
