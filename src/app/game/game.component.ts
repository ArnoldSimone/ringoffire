import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
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
  deleteDoc,
  doc,
  updateDoc,
  docData,
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

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
  gameId: string | undefined;

  firestore: Firestore = inject(Firestore);

  constructor(private route: ActivatedRoute, public dialog: MatDialog) {}

  // ngOnInit(): void {
  //   this.newGame();
  //   this.route.params.subscribe((params) => {
  //     console.log(params['id']);
  //   });
  //   this.games$ = collectionData(this.getGamesRef());
  //   this.games$.subscribe((game) => {
  //     console.log('Game update', game);
  //   });
  // }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.gameId = params['gameId']; // Hole die gameId aus den Routenparametern
      if (this.gameId) {
        this.loadGame();
      }
    });
  }

  loadGame() {
    if (this.gameId) {
      const gameDocRef = doc(this.firestore, 'games', this.gameId);
      const gameData$ = docData(gameDocRef, { idField: 'id' }) as Observable<
        Game & { id: string }
      >;

      gameData$.subscribe((game: Game & { id: string }) => {
        if (game) {
          this.game = game;
          this.game.players = game.players;
          this.game.stack = game.stack;
          this.game.playedCards = game.playedCards;
          console.log('Game loaded:', this.game);
        } else {
          console.error('Game not found!');
        }
      });
    } else {
      console.error('Game ID is undefined.');
    }
  }

  getGamesRef() {
    return collection(this.firestore, 'games');
  }

  async newGame() {
    this.game = new Game();
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
