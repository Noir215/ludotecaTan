import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Loan } from '../model/Loan';
import { LoanService } from '../loan.service';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { Pageable } from 'src/app/core/model/page/Pageable';
import { LoanEditComponent } from '../loan-edit/loan-edit.component';
import { DialogConfirmationComponent } from 'src/app/core/dialog-confirmation/dialog-confirmation.component';
import { Game } from 'src/app/game/model/Game';
import { Client } from 'src/app/client/model/Client';
import { ClientService } from 'src/app/client/client.service';
import { GameService } from 'src/app/game/game.service';

@Component({
  selector: 'app-loan-list',
  templateUrl: './loan-list.component.html',
  styleUrls: ['./loan-list.component.scss']
})
export class LoanListComponent implements OnInit {

    loans : Loan[];
    games : Game[];
    clients: Client[];
    filterTitle: Game;
    filterClient: Client;
    filterDate: Date;
    
    pageNumber: number = 0;
    pageSize: number = 5;
    totalElements: number = 0;

    dataSource = new MatTableDataSource<Loan>();
    displayedColumns: string[] = ['id', 'game', 'client', 'loanDate', 'returnDate', 'action'];

    constructor(
      private clientService: ClientService,
      private gameService: GameService,
      private loanService: LoanService,
      public dialog: MatDialog,
    ) {}

    ngOnInit(): void {
        this.loadPage();
    }

    // Funciones de paginado
    loadPage (event?: PageEvent) {
      let pageable : Pageable = {
        pageNumber: this.pageNumber,
        pageSize: this.pageSize,
        sort: [{
          property: 'id',
          direction: 'ASC'
        }]
      }

      if (event != null) {
        pageable.pageSize = event.pageSize;
        pageable.pageNumber = event.pageIndex;
      }

      this.loanService.getLoans(null, null, null, pageable).subscribe(data => {
        this.dataSource.data = data.content;
        console.log(data.content);
        this.pageNumber = data.pageable.pageNumber;
        this.pageSize = data.pageable.pageSize;
        this.totalElements = data.totalElements;
      });

      this.clientService.getClients().subscribe(
        clients => this.clients = clients
      )

      this.gameService.getGames().subscribe(
        games => this.games = games
      )
    }

    createLoan() {
      const dialogRef = this.dialog.open(LoanEditComponent, {
        data: {}
      });

      dialogRef.afterClosed().subscribe(result => {
        this.ngOnInit();
      });
    }

    editLoan(loan: Loan) {
      const dialogRef = this.dialog.open(LoanEditComponent, {
        data: { loan: loan }
      });

      dialogRef.afterClosed().subscribe (result => {
        this.ngOnInit();
      });
    }

    deleteLoan(loan: Loan) {
      const dialogRef = this.dialog.open(DialogConfirmationComponent, {
        data: {title: "Eliminar préstamo", description: "Atención si borra el préstamo se perderán sus datos. <br> ¿Desea eliminar el préstamo?" }
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.loanService.deleteLoan(loan.id).subscribe(result => {
            this.ngOnInit();
          });
        }
      });
    }

    // Funciones de filtrado
    onCleanFilter(): void {
      this.filterTitle = null;
      this.filterClient = null;
      this.filterDate = null;

      this.loadPage();
    }

    onSearch(): void {
      let title = this.filterTitle != null ? this.filterTitle.id : null;
      let clientId = this.filterClient != null ? this.filterClient.id : null;
      let loanDate = this.filterDate != null ? this.filterDate : null;

      let pageable : Pageable = {
        pageNumber: this.pageNumber,
        pageSize: this.pageSize,
        sort: [{
          property: 'id',
          direction: 'ASC'
        }]
      }

      this.loanService.getLoans(title, clientId, loanDate, pageable).subscribe(
        data => {
          this.dataSource.data = data.content;
          this.pageNumber = data.pageable.pageNumber;
          this.pageSize = data.pageable.pageSize;
          this.totalElements = data.totalElements;
        }
      );
    }
}
