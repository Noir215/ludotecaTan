import { Component, OnInit, Inject } from '@angular/core';
import { Loan } from '../model/Loan';
import { Game } from 'src/app/game/model/Game';
import { Client } from 'src/app/client/model/Client';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { LoanService } from '../loan.service';
import { GameService } from 'src/app/game/game.service';
import { ClientService } from 'src/app/client/client.service';
import { MatDatepicker } from '@angular/material/datepicker';

@Component({
  selector: 'app-loan-edit',
  templateUrl: './loan-edit.component.html',
  styleUrls: ['./loan-edit.component.scss']
})
export class LoanEditComponent implements OnInit {

  loan: Loan;
  games: Game[];
  clients: Client[];
  loanDatepicker: MatDatepicker<Date>;
  returnDatePicker: MatDatepicker<Date>;
  maxDate: Date;

  constructor(
    public dialogRef: MatDialogRef<LoanEditComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private loanService: LoanService,
    private gameService: GameService,
    private clientService: ClientService,
  ) { }

  ngOnInit(): void {
    if (this.data.loan != null) {
      this.loan = Object.assign({}, this.data.loan);
    }
    else {
      this.loan = new Loan();
    }

    this.gameService.getGames().subscribe(
      games => {
        this.games = games;

        if (this.loan.game != null) {
          let gameFilter: Game[] = games.filter(game => game.id == this.data.loan.game.id);
          if (gameFilter != null) {
            this.loan.game = gameFilter[0];
          }
        }
      }
    );

    this.clientService.getClients().subscribe(
      clients => {
        this.clients = clients;

        if (this.loan.client != null) {
          let clientFilter: Client[] = clients.filter(client => client.id == this.data.loan.client.id);
          if (clientFilter != null) {
            this.loan.client = clientFilter[0];
          }
        }
      }
    );
  }

  onSave() {
    console.log(this.loan.loanDate);
    this.loanService.saveLoan(this.loan).subscribe(result => {
      this.dialogRef.close();
    });
  }

  onClose() {
    this.dialogRef.close();
  }

  dateFilter: (date: Date | null) => boolean =
  (date: Date | null) => {
    if (!date) {
      return false;
    }
    const loanDate = this.loan.loanDate;
    const dateDiff = (date.getTime() - loanDate.getTime()) / (1000 * 60 * 60 * 24);
    return dateDiff >= 0 && dateDiff <= 14;
  };
}
