import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';

export interface FinnHubHttpResponseObject {
  adjusted: boolean;
  queryCount: number;
  request_id: string;
  results: FinnHubResultsObject[];
  resultsCount: number;
  status: string;
  ticker: string;
}

export interface FinnHubResultsObject {
  c: number;
  h: number;
  l: number;
  n: number;
  o: number;
  t: number;
  v: number;
  vw: number;
}

const finnHubAPIStart = `https://api.polygon.io/v2/aggs/ticker/`;

//You need to add your FinnHub API Key in the line below. You can get one for free at https://polygon.io/stocks?gclid=Cj0KCQiA3rKQBhCNARIsACUEW_ZaNQ7GhL-sIZurI7fxRihPjlsoUgFnmtuRCbveK9ms5_01GUQSFX8aAu3jEALw_wcB
const finnHubAPIEnd = `/range/1/day/2020-06-01/2020-06-17?apiKey=ADD_FINNHUB_API_KEY_HERE`;

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  constructor(private http: HttpClient) {}

  getStock$(stock: string): Observable<any> {
    return this.http
      .get<FinnHubHttpResponseObject>(
        `${finnHubAPIStart}${stock}${finnHubAPIEnd}`
      )
      .pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse): any {
    if (error.error instanceof ErrorEvent) {
      console.error('There was an error: ', error.error.message);
    } else {
      console.error(
        `Error returned code ${error.status}, ` +
          `Error message: ${error.error.message}`
      );
    }
    return throwError(() => 'There was an error.');
  }
}
