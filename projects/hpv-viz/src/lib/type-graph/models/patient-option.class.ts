/**
 * Class for Patient Option
 *
 * TODO - Refactor to more generic name
 */
export class PatientOption {
  private selected;
  private name;
  private data: Set<String>;

  constructor(name: String, selected: boolean) {
    this.selected = selected;
    this.name = name;
    this.data = new Set();
  }

  public getData(): Set<String> {
    return this.data;
  }

  public setData(data: Set<String>): void {
    this.data = data;
  }

  public isSelected(): boolean {
    return this.selected;
  }

  public getName(): String {
    return this.name;
  }

  public setSelected(selected: boolean): void {
    this.selected = selected;
  }

  /**
   * Flips the selected field of the PatientOption
   */
  public toggle(selected?: boolean): void {
    if (selected === undefined) {
      this.selected = !this.selected;
    } else {
      this.selected = selected;
    }
  }
}
