import {Component, OnInit} from '@angular/core';
import {Category, Event, EventStatus} from './models/models';
import {EventService} from './services/eventService';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {
  title = 'NASA Natural Event Tracker Platform';
  categoryDescription = '';
  categories: Category[] = [];
  eventTypes = [];
  events: Event[] = [];
  showTable = true;
  rangeQueryValue = 'all';
  eventStatusQueryValue = 'open';
  categoryQueryValue = 'All';
  numberOfAffectedPlacesQueryValue = 'undefined';
  whereQueryValue = 'eventStatus=' + this.eventStatusQueryValue + ' AND numberOfAffectedPlaces=' + this.numberOfAffectedPlacesQueryValue
    + ' AND category=' + this.categoryQueryValue;
  query = 'SELECT *\n FROM Events\n RANGE ' + this.rangeQueryValue + ' days\n WHERE ' + this.whereQueryValue;

  constructor(private eventService: EventService) {
  }

  getCategories = () => {
    this.eventService.fetchAllCategories().subscribe((categories: Category[]) => this.categories = categories);
  }

  getEvents = () => {
    this.eventService.fetchAllEvents(EventStatus.closed, 20, 0).subscribe((events: Event[]) => this.events = events);
  }

  ngOnInit(): void {
    this.getCategories();

    // tslint:disable-next-line:forin
    for (const eventStatus in EventStatus) {
      this.eventTypes.push(eventStatus);
    }

    this.getEvents();
  }

  showDescription = (categoryId) => {
    let category: Category;
    if (categoryId !== -1) {
      category = this.categories.filter((c) => c.id == categoryId)[0];
      this.categoryDescription = category.description;
      this.categoryQueryValue = category.title;
    } else {
      this.categoryDescription = '';
      this.categoryQueryValue = 'All';
    }
    this.updateQuery();
  }

  setEventType = (eventType) => {
    this.eventStatusQueryValue = eventType;
    this.updateQuery();
  }

  startQuery = () => {
    console.log('start processing');
  }

  stopQuery = () => {
    console.log('stop processing');
  }

  updateQuery = () => {
    this.whereQueryValue = 'eventStatus=' + this.eventStatusQueryValue +
      ' AND numberOfAffectedPlaces=' + this.numberOfAffectedPlacesQueryValue +
      ' AND category=' + this.categoryQueryValue;
    this.query = 'SELECT *\n FROM Events\n RANGE ' + this.rangeQueryValue + ' days\n WHERE ' + this.whereQueryValue;
  }
}
