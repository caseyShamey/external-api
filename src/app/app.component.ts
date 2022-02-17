//Basic Angular app that lets you search for a stock and will display results from FinnHub API

import { Component } from '@angular/core';
import {
  ApiService,
  FinnHubHttpResponseObject,
  FinnHubResultsObject,
} from './api.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  public ticker!: FinnHubHttpResponseObject;
  public results!: FinnHubResultsObject[];
  public stock!: string;

  constructor(private readonly apiService: ApiService) {}
  title = 'external-api';

  getStock() {
    this.apiService
      .getStock$(this.stock.toUpperCase())
      .subscribe((response) => {
        this.ticker = response;
        this.results = response.results;
      });
  }
}
