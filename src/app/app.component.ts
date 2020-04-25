import {Component, OnInit} from '@angular/core';
import {Injectable} from '@angular/core';
import {Category, EventStatus} from './models/models';
import {EventService} from './services/eventService';
import {HttpClient} from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {
  title = 'NASA Natural Event Tracker Platform';
  categories: Category[] = [];
  eventTypes = [];

  // tslint:disable-next-line:only-arrow-functions

  constructor(private eventService: EventService) {
  }

  getData = () => {
    this.eventService.fetchAllCategories().subscribe((categories: Category[]) => this.categories = categories);
  }

  ngOnInit(): void {
    this.getData();

    // tslint:disable-next-line:forin
    for (const eventStatus in EventStatus) {
      if (isNaN(Number(eventStatus))) {
        this.eventTypes.push(eventStatus);
      }
    }
    console.log(this.eventTypes);
  }
}
