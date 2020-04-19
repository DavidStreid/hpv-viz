import {Component, EventEmitter, Input, Output} from '@angular/core';

/**
 * COMPONENT FOR SHOWING-HIDING TABS
 *
 * TO ADD,
 * 1) Add to template
         <tab-toggle
          [title]="title"
          [show]="show"
          (toggle)="toggleShow()"></tab-toggle>
 * 2) Wrap div to hide-show in a  *ngIf="show"
 * 3) Add to component
         // TAB-TOGGLE CODE (copy-pasta: start)
         public show: boolean;
         public title: string = {YOUR_TITLE}
         public toggleShow(): void{
            this.show = !this.show;
         }
         // TAB-TOGGLE CODE (copy-pasta: end)
 */
@Component({
  selector: 'tab-toggle', // tslint:disable-line
  templateUrl: './tab-toggle.component.html',
  styleUrls: ['./tab-toggle.component.scss']
})
export class TabToggleComponent {
  @Input()
  public title: string;
  @Input()
  public show: boolean;
  @Output()
  public toggle: EventEmitter<void>;

  constructor() {
    this.title = '';
    this.show = false;
    this.toggle = new EventEmitter<void>();
  }

  /**
   * Emits toggle event
   */
  sendToggle(): void {
    this.toggle.next();
  }
}
