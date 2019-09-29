import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

export interface CollapsedStatusChangedEvent {
  sectionName: string,
  isOpen: boolean
};

@Component({
  selector: 'app-hggs-accordion',
  templateUrl: './hggs-accordion.component.html',
  styleUrls: ['./hggs-accordion.component.scss']
})
export class HggsAccordionComponent implements OnInit {
  @Input()
  sectionName: string;

  @Input()
  description: string;

  @Input()
  image: string;

  @Output()
  change: EventEmitter<CollapsedStatusChangedEvent> = new EventEmitter<CollapsedStatusChangedEvent>();

  public isSectionOpen = false;

  constructor() {
    this.description = '';
  }

  ngOnInit() {
  }

  public toggleAccordion(): void {
    this.isSectionOpen = !this.isSectionOpen;
    this.change.emit({ sectionName: this.sectionName, isOpen: this.isSectionOpen});
  }

  // public broadcastName(name: string): void {
  //   this.change.emit(name);
  // }
}
