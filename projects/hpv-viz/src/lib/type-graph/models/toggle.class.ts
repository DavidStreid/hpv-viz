/**
 * Class for Toggle
 * Keeps track of @name to a set of @data (E.g. HPV Type -> Set ot patients with that HPV type)
 */
export class Toggle {
  private selected;
  private name;               // HPV type
  private data: Set<String>;  // Set of patients with that HPV type

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
   * Flips the selected field of the Toggle
   */
  public toggle(selected?: boolean): void {
    if (selected === undefined) {
      this.selected = !this.selected;
    } else {
      this.selected = selected;
    }
  }
}
