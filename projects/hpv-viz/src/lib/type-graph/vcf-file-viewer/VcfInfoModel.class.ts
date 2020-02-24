export class VcfInfoModel {
  private metaData: Object = {};
  private commands: Map<String, String> = new Map<String, String>();
  private fileCreatedDate: Date;   // Date file was created (taken from VCF headers)
  private sampleDate: Date;    // Date sample was taken (optional)
  private selectedCommand: string;

  private isDate(key: string): boolean{
    return key.trim().toLocaleLowerCase().includes('date');
  }

  private isSampleDate(key: string): boolean{
    return key.trim().toLocaleLowerCase().includes('sampledate');
  }

  private isCommand(key: string): boolean{
    return key.trim().toLocaleLowerCase().includes('command');
  }

  public isSelectedCommand(cmd: string): boolean {
    return this.selectedCommand === cmd;
  }

  public setSelectedCommand(cmd: string): void {
    this.selectedCommand = cmd;
  }

  constructor(info: Object) {
    const infoFields = Object.keys(info) || [];

    for(const key of infoFields){
      if(this.isDate(key)){
        // get date field (e.g. "Date")
        if(this.isSampleDate(key)){
          this.sampleDate = info[key];
        } else {
          this.fileCreatedDate = info[key];
        }
      } else if (this.isCommand(key)){
        // Command Fields (e.g. "bcftoolsCommand", "bcftools_callCommand")
        this.commands.set(key, info[key]);

        // Selected command to be shown in the UI (will just be the last command parsed)
        this.selectedCommand = key;
      } else {
        // Other fields considered metadata (e.g. "fileformat", "bcftoolsVersion", "reference", "bcftools_callVersion")
        this.metaData[key] = info[key];
      }
    }
  }

  public getCommands(): Map<String, String> {
    return this.commands;
  }
  public getMetaData(): Object {
    return this.metaData;
  }
  public getSampleDate(): Date {
    return this.sampleDate;
  }
  public getFileCreationDate(): Date {
    return this.fileCreatedDate;
  }
}
