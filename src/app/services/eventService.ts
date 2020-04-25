import {HttpHeaders, HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {EventStatus} from '../models/models';

const baseUrl = 'http://localhost:8080/nasa-natural-event-tracker';
const categoriesUrl = baseUrl + '/categories';
const eventsUrl = baseUrl + '/events';

function eventsForCategory(id: string) {
  return `${categoriesUrl}/${id}/events`;
}

@Injectable()
export class EventService {
  httpHeaders: HttpHeaders;

  constructor(private http: HttpClient) {
    this.httpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      // 'Accept': '*/*',
      // 'Access-Control-Allow-Origin': '*'
    });
  }

  fetchAllCategories() {
    return this.http.get(`${categoriesUrl}`, {headers: this.httpHeaders});
  }

  fetchAllEvents(status: EventStatus, priorDays: number, affectedPlacesNo: number) {
    // tslint:disable-next-line:max-line-length
    return this.http.get(`${eventsUrl}?status=${status}?priorDays=${priorDays}?affectedPlacesNo=${affectedPlacesNo}`, {headers: this.httpHeaders});
  }

  getEventsForCategory(categoryId: string) {
    return this.http.get(eventsForCategory(categoryId), {headers: this.httpHeaders});
  }
}
