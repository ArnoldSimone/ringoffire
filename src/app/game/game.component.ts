import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, Injectable } from '@angular/core';
import { Game } from '../../models/game';
import { PlayerComponent } from '../player/player.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { DialogAddPlayerComponent } from '../dialog-add-player/dialog-add-player.component';
import { GameInfoComponent } from '../game-info/game-info.component';
import {
  Firestore,
  collection,
  collectionData,
  addDoc,
} from '@angular/fire/firestore';
import { Observable, Subscription } from 'rxjs';
import { log } from 'console';

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [
    CommonModule,
    PlayerComponent,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    GameInfoComponent,
  ],
  templateUrl: './game.component.html',
  styleUrl: './game.component.scss',
})
export class GameComponent implements OnInit {
  pickCardAnimation: Boolean = false;
  currentCard: string = '';
  game?: Game;
  games$!: Observable<any[]>;

  firestore: Firestore = inject(Firestore);

  constructor(public dialog: MatDialog) {}

  ngOnInit(): void {
    this.newGame();
    this.games$ = collectionData(this.getGamesRef());
    this.games$.subscribe((game) => {
      console.log('Game update', game);
    });
  }

  getGamesRef() {
    return collection(this.firestore, 'games');
  }

  async newGame() {
    this.game = new Game();
    await addDoc(this.getGamesRef(), this.game.toJson());
  }

  takeCard() {
    if (this.game && this.game.stack.length > 0 && !this.pickCardAnimation) {
      let card = this.game.stack.pop(); // Pop gibt eine Karte oder undefined zurück
      if (card !== undefined) {
        this.currentCard = card;
        this.pickCardAnimation = true;

        this.game.currentPlayer++;
        this.game.currentPlayer =
          this.game.currentPlayer % this.game.players.length;

        setTimeout(() => {
          this.game?.playedCards.push(this.currentCard);
          this.pickCardAnimation = false;
        }, 1000);
      }
    }
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(DialogAddPlayerComponent);

    dialogRef.afterClosed().subscribe((name: string) => {
      if (name && name.length > 0) {
        this.game?.players.push(name);
      }
    });
  }
}
