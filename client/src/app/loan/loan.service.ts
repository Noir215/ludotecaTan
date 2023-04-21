import { Injectable } from '@angular/core';
import { Pageable } from '../core/model/page/Pageable';
import { Observable, of } from 'rxjs';
import { LoanPage } from './model/LoanPage';
import { LOAN_DATA } from './model/mock-loans';
import { Loan } from './model/Loan';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class LoanService {

  constructor(
    private http: HttpClient
  ) { }

  /*getLoans(pageable: Pageable): Observable<LoanPage> {
    return this.http.post<LoanPage>('http://localhost:8080/loan/', {pageable:pageable});
  }*/

  saveLoan(loan: Loan): Observable<void> {
    let url = 'http://localhost:8080/loan';
    if (loan.id != null) {
      url += '/' + loan.id;
    }

    return this.http.put<void>(url, loan);
  }

  deleteLoan(idLoan : number): Observable<void> {
    return this.http.delete<void>('http://localhost:8080/loan/' + idLoan);
  }

  getAllLoans(): Observable<Loan[]> {
    return this.http.get<Loan[]>('http://localhost:8080/loan');
  }

  getLoans (title?: number, clientId?: number, loanDate?: Date, pageable?: Pageable): Observable<LoanPage> {
    let params = '';

    console.log(loanDate);

    if (title != null) {
      params += 'title=' + title;
    }

    if (clientId != null) {
      if (params != '') params += "&";
      params += "client=" + clientId;
    }

    if (loanDate != null) {
      if (params != '') params += "&";
      params += "loandate=" + loanDate;
    }

    console.log(params);

    if (params == '') {
      return this.http.post<LoanPage>('http://localhost:8080/loan/', {pageable:pageable});
    }
    else {
      return this.http.post<LoanPage>('http://localhost:8080/loan/' + '?' + params, {pageable:pageable});
    }
  }
}
