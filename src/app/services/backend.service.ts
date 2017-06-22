import { Injectable } from '@angular/core';
import { Http, RequestOptions, Response } from '@angular/http';
import { Observable, Subject, BehaviorSubject } from 'rxjs/';

export interface ResponseType {
  convertedAmount: number;
  fromCurrency: string;
  toCurrency: string;
  amount: number;
}

@Injectable()
export class BackendService {

  subject: BehaviorSubject<string[]>;

  constructor(private http: Http) {
    console.log('napravio se backend service');
  }

  getBases(): Observable<string[]> {
    if (!this.subject) {
      this.subject = new BehaviorSubject<string[]>([]);
      this.http.get('http://localhost:5000/converter/list').subscribe(res => {
        this.subject.next(res.json());
      });
    }
    return this.subject;
  }

  convert(initialBase: string, finalBase: string, amount: number): Observable<ResponseType> {
    // This parameters are easier to manage
    const params = new RequestOptions({
      search: {
        fromCurrency: initialBase,
        toCurrency: finalBase,
        amount: amount
      }
    });

    // Note the second argument 'params'
    return this.http.get('http://localhost:5000/converter/convert', params)
      .map((response: Response): ResponseType => {
        return response.json();
      });
  }

}
