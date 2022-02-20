//Basic Angular app that lets you search for a stock and will display results from FinnHub API

import { Component, NgZone, ViewChild } from '@angular/core';
import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { ApiService } from './api.service';
import { take, tap } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  public wordsAndPhrasesToRedactText!: string;
  public censoredText!: string;
  public documentText!: string;

  constructor(
    private readonly apiService: ApiService,
    private _ngZone: NgZone
  ) {}
  @ViewChild('autosize') autosize!: CdkTextareaAutosize;
  title = 'censor';

  censorText(): void {
    this.parseWordsAndPhrasesToRedact();
  }

  triggerResize() {
    this._ngZone.onStable
      .pipe(
        take(1),
        tap(() => {
          this.autosize.resizeToFitContent(true);
        })
      )
      .subscribe();
  }

  parseWordsAndPhrasesToRedact(): void {
    const redactedWordsAndPhrases: { [key: string]: string } = {};
    let redactSplit = this.wordsAndPhrasesToRedactText.split('');
    const splitLength = redactSplit.length;
    let startIndex: number = 0;
    let endIndex: number = 0;
    let firstDoubleQuote = false;
    let firstSingleQuote = false;
    let firstCommaOrSpace = false;
    for (let i = 0; i < splitLength; i++) {
      switch (redactSplit[i]) {
        case '"':
          console.log('made it into double case');
          if (
            (firstSingleQuote === false && firstCommaOrSpace === false) ||
            (firstSingleQuote === false && firstCommaOrSpace)
          ) {
            firstCommaOrSpace = false;
            if (firstDoubleQuote === false) {
              startIndex = i + 1;
              firstDoubleQuote = true;
            } else {
              console.log('indices: ', startIndex, i);
              let phrase = redactSplit.slice(startIndex, i).join('');
              redactedWordsAndPhrases[phrase] = phrase;
              firstDoubleQuote = false;
              endIndex = i;
            }
          }
          break;
        case "'":
          console.log('made it into single case');
          if (
            (firstDoubleQuote === false && firstCommaOrSpace === false) ||
            (firstDoubleQuote === false && firstCommaOrSpace)
          ) {
            firstCommaOrSpace = false;
            if (firstSingleQuote === false) {
              startIndex = i + 1;
              firstSingleQuote = true;
            } else {
              let phrase = redactSplit.slice(startIndex, i).join('');
              redactedWordsAndPhrases[phrase] = phrase;
              firstSingleQuote = false;
              endIndex = i;
            }
          }
          break;
        case ' ':
          console.log('made it into space case');
          if (firstDoubleQuote === false && firstSingleQuote === false) {
            if (firstCommaOrSpace === false) {
              if (startIndex === 0 && i !== 0) {
                let word = redactSplit.slice(startIndex, i).join('');
                redactedWordsAndPhrases[word] = word;
                firstCommaOrSpace = true;
                endIndex = i;
                startIndex = i + 1;
              } else {
                startIndex = i + 1;
                firstCommaOrSpace = true;
              }
            } else {
              let word = redactSplit.slice(startIndex, i).join('');
              redactedWordsAndPhrases[word] = word;
              endIndex = i;
            }
          }
          break;
        case ',':
          console.log('made it into comma case');
          if (firstDoubleQuote === false && firstSingleQuote === false) {
            if (firstCommaOrSpace === false) {
              if (startIndex === 0 && i !== 0) {
                let word = redactSplit.slice(startIndex, i).join('');
                redactedWordsAndPhrases[word] = word;
                firstCommaOrSpace = true;
                endIndex = i;
                startIndex = i + 1;
              } else {
                startIndex = i + 1;
                firstCommaOrSpace = true;
              }
            } else {
              let word = redactSplit.slice(startIndex, i).join('');
              redactedWordsAndPhrases[word] = word;
              endIndex = i;
            }
          }
          break;
      }
      if (i === splitLength - 1) {
        console.log('at the end: ', i, splitLength - 1, endIndex);
        if (
          firstDoubleQuote === false &&
          firstSingleQuote === false &&
          endIndex !== splitLength - 1
        ) {
          console.log('made it to beer');
          let word = redactSplit.slice(startIndex).join('');
          redactedWordsAndPhrases[word] = word;
        }
      }
    }
    console.log('redacted: ', redactedWordsAndPhrases);
  }
  //Hello world "Boston Red Sox",'Pepperoni Pizza','Cheese Pizza',beer
}
