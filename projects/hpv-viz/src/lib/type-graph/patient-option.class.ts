/**
* Class for Patient Option
*/
export class PatientOption {
  private selected;
  private name;

  constructor(name: string, selected: boolean) {
    this.selected = selected;
    this.name = name;
  }

  public isSelected(): boolean {
    return this.selected;
  }

  public getName(): string {
    return this.name;
  }

  public toggle(selected?: boolean): void {
    if ( selected === undefined ) {
      this.selected = !this.selected;
    } else {
      this.selected = selected;
    }
  }
}
