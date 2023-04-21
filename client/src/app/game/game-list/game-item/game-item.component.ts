import { Component, Input, OnInit } from '@angular/core';
import { Game } from '../../model/Game';

@Component({
  selector: 'app-game-item',
  templateUrl: './game-item.component.html',
  styleUrls: ['./game-item.component.scss']
})
export class GameItemComponent implements OnInit {

  @Input() game: Game;

  constructor() { }

  ngOnInit(): void {
    console.log(this.game);
    console.log(this.game.author.name);
    console.log(this.game.category.name);
  }
}
