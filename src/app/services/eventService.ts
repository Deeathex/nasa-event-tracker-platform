import {HttpHeaders, HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {EventStatus} from '../models/models';

import Oboe from 'oboe';
import {Observable} from 'rxjs';

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
    return this.http.get(`${eventsUrl}?status=${status}&priorDays=${priorDays}&affectedPlacesNo=${affectedPlacesNo}`,
      {headers: this.httpHeaders});
  }

  fetchAllStreamingEvents(status: EventStatus, priorDays: number, affectedPlacesNo: number) {
    // fetch events from ${baseUrl}/stream/events?status=open&priorDays=5&affectedPlacesNo=0
    return this.http.get(`${baseUrl}/stream/events?status=${status}&priorDays=${priorDays}&affectedPlacesNo=${affectedPlacesNo}`,
      {headers: this.httpHeaders});
  }

  fetchAllStreamingEventsWithinCategory(categoryId: number, status: EventStatus, priorDays: number, affectedPlacesNo: number) {
    // fetch events from ${baseUrl}/stream/categories/{category-id}/events?status=open&priorDays=5&affectedPlacesNo=0
    return this.http.get(`${baseUrl}/stream/categories/${categoryId}/events?status=${status}&priorDays=${priorDays}&affectedPlacesNo=${affectedPlacesNo}`,
      {headers: this.httpHeaders});
  }

  fetchAllEventsOboe() {
    return Observable.create(subscriber => {
      const oboe = Oboe('http://localhost:8080/nasa-natural-event-tracker/stream/events')
        .start((status, headers) => {
          if (status < 200 || status >= 300) {
            oboe.abort();
            subscriber.error(status, headers);
          }
        })
        .fail(error => {
          subscriber.error(error);
        })
        .node(node => {
          subscriber.next(node);
          // Oboe.drop signals that memory for the current node can be reclaimed
          return Oboe.drop;
        })
        .done(emptyJson => {
          subscriber.complete();
          return Oboe.drop;
        });
      // we abort fetching more data when somebody unsubscribes from observable
      return () => oboe.abort();
    });
  }

  getEventsForCategory(categoryId: string) {
    return this.http.get(eventsForCategory(categoryId), {headers: this.httpHeaders});
  }
}
