import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Game } from '../../models/game';
import { PlayerComponent } from '../player/player.component';

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [CommonModule, PlayerComponent],
  templateUrl: './game.component.html',
  styleUrl: './game.component.scss',
})
export class GameComponent implements OnInit {
  pickCardAnimation: Boolean = false;
  currentCard: string = '';
  game?: Game;

  ngOnInit(): void {
    this.newGame();
  }

  newGame() {
    this.game = new Game();
    console.log(this.game);
  }

  takeCard() {
    if (this.game && this.game.stack.length > 0 && !this.pickCardAnimation) {
      let card = this.game.stack.pop(); // Pop gibt eine Karte oder undefined zurück
      if (card !== undefined) {
        this.currentCard = card;
        this.pickCardAnimation = true;
        setTimeout(() => {
          this.game?.playedCards.push(this.currentCard);
          this.pickCardAnimation = false;
        }, 1000);
      }
    }
  }
}
