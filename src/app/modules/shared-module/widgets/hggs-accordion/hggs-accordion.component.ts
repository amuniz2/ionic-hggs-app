import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Observable} from 'rxjs';

export interface CollapsedStatusChangedEvent {
  sectionName: string;
  isOpen: boolean;
}

export interface AddButtonClickedEvent {
  placeholderText: string;
}

export interface PageSection {
  label: string;
  isOpen$: Observable<boolean>;
}


@Component({
  selector: 'app-hggs-accordion',
  templateUrl: './hggs-accordion.component.html',
  styleUrls: ['./hggs-accordion.component.scss']
})
export class HggsAccordionComponent implements OnInit {
  @Input()
  isOpenInitially: boolean;

  @Input()
  sectionName: string;

  @Input()
  description: string;

  @Input()
  image: string;

  @Output()
  change: EventEmitter<CollapsedStatusChangedEvent> = new EventEmitter<CollapsedStatusChangedEvent>();

  @Output()
  addToList: EventEmitter<AddButtonClickedEvent> = new EventEmitter<AddButtonClickedEvent>();

  public isSectionOpen = false;

  constructor() {
    this.description = '';
  }

  ngOnInit() {
    this.isSectionOpen = this.isOpenInitially;
  }

  public toggleAccordion(): void {
    this.isSectionOpen = !this.isSectionOpen;
    this.change.emit({ sectionName: this.sectionName, isOpen: this.isSectionOpen});
  }

  // public broadcastName(name: string): void {
  //   this.change.emit(name);
  // }
  onAddClick() {
    this.addToList.emit({ placeholderText: `Please enter ${this.sectionName}`});
  }
}
