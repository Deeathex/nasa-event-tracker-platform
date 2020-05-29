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
  rangeQueryValue = 'all';
  eventStatusQueryValue = 'open';
  categoryQueryValue = 'All';
  categoryIdQueryValue = '';
  numberOfAffectedPlacesQueryValue = 'undefined';
  whereQueryValue = 'eventStatus=' + this.eventStatusQueryValue + ' AND numberOfAffectedPlaces=' + this.numberOfAffectedPlacesQueryValue
    + ' AND category=' + this.categoryQueryValue;
  query = 'SELECT *\n FROM Events\n RANGE ' + this.rangeQueryValue + ' days\n WHERE ' + this.whereQueryValue;

  constructor(private eventService: EventService) {
  }

  getCategories = () => {
    this.eventService.fetchAllCategories().subscribe((categories: Category[]) => this.categories = categories);
  }

  getStreamingEvents = (status, priorDays, affectedPlaceNo) => {
    this.eventService.fetchAllStreamingEvents(status, priorDays, affectedPlaceNo).subscribe((events: Event[]) => this.events = events);
  }

  getStreamingEventsWithinCategory = (categoryId, status, priorDays, affectedPlaceNo) => {
    this.eventService.fetchAllStreamingEventsWithinCategory(categoryId, status, priorDays, affectedPlaceNo)
      .subscribe((event: Event) => this.events.push(event));
  }

  ngOnInit(): void {
    this.getCategories();

    // tslint:disable-next-line:forin
    for (const eventStatus in EventStatus) {
      this.eventTypes.push(eventStatus);
    }
  }

  showDescription = (categoryId) => {
    let category: Category;
    if (categoryId !== -1) {
      category = this.categories.filter((c) => c.id == categoryId)[0];
      this.categoryDescription = category.description;
      this.categoryQueryValue = category.title;
      this.categoryIdQueryValue = categoryId;
    } else {
      this.categoryDescription = '';
      this.categoryQueryValue = 'All';
      this.categoryIdQueryValue = '';
    }
    this.updateQuery();
  }

  setEventType = (eventType) => {
    this.eventStatusQueryValue = eventType;
    this.updateQuery();
  }

  startQuery = () => {
    console.log('start processing');
    if (this.numberOfAffectedPlacesQueryValue === 'undefined') {
      this.numberOfAffectedPlacesQueryValue = '0';
    }
    if (this.rangeQueryValue === 'all') {
      this.rangeQueryValue = '0';
    }
    if (this.categoryQueryValue === 'All') {
      this.getStreamingEvents(this.eventStatusQueryValue, this.rangeQueryValue, this.numberOfAffectedPlacesQueryValue);
    } else {
      this.getStreamingEventsWithinCategory(this.categoryIdQueryValue, this.eventStatusQueryValue,
        this.rangeQueryValue, this.numberOfAffectedPlacesQueryValue);
    }
    // this.eventService.fetchAllEventsOboe().subscribe((event: Event) => {console.log(event); this.events.push(event); });
  }

  stopQuery = () => {
    console.log('stop processing');
    this.events = [];
  }

  updateQuery = () => {
    this.whereQueryValue = 'eventStatus=' + this.eventStatusQueryValue +
      ' AND numberOfAffectedPlaces=' + this.numberOfAffectedPlacesQueryValue +
      ' AND category=' + this.categoryQueryValue;
    this.query = 'SELECT *\n FROM Events\n RANGE ' + this.rangeQueryValue + ' days\n WHERE ' + this.whereQueryValue;
  }
}
