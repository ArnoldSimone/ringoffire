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
  game!: Game;
  gameId: string | undefined;
  // games$!: Observable<Game[]>;

  firestore: Firestore = inject(Firestore);

  constructor(private route: ActivatedRoute, public dialog: MatDialog) {}

  ngOnInit(): void {
    // this.newGame();
    this.route.params.subscribe((params) => {
      this.gameId = params['gameid']; // Hole die gameid aus den Routenparametern
      if (this.gameId) {
        this.loadGame();
      }
    });
  }

  // loadGame() {
  //   if (this.gameId) {
  //     const gameDocRef = doc(collection(this.firestore, 'games'), this.gameId);
  //     const gameData$ = docData(gameDocRef, { idField: 'id' }) as Observable<
  //       Game & { id: string }
  //     >;

  //     gameData$.subscribe((game: Game & { id: string }) => {
  //       if (game) {
  //         this.game = game;
  //         console.log(this.game);

  //         this.game.players = game.players;
  //         this.game.stack = game.stack;
  //         this.game.playedCards = game.playedCards;
  //         this.game.currentPlayer = game.currentPlayer;
  //         this.game.pickCardAnimation = game.pickCardAnimation;
  //         this.game.currentCard = game.currentCard;
  //         console.log('Game loaded:', this.game);
  //       } else {
  //         console.error('Game not found!');
  //       }
  //     });
  //   } else {
  //     console.error('Game ID is undefined.');
  //   }
  // }
  loadGame() {
    if (this.gameId) {
      const gameDocRef = doc(this.firestore, 'games', this.gameId);
      const gameData$ = docData(gameDocRef, { idField: 'id' }) as Observable<
        Game & { id: string }
      >;
      gameData$.subscribe((gameData: Game & { id: string }) => {
        if (gameData) {
          // Stelle sicher, dass gameData in eine Instanz von Game umgewandelt wird
          this.game = new Game();
          this.game.players = gameData.players;
          this.game.stack = gameData.stack;
          this.game.playedCards = gameData.playedCards;
          this.game.currentPlayer = gameData.currentPlayer;
          this.game.pickCardAnimation = gameData.pickCardAnimation;
          this.game.currentCard = gameData.currentCard;
          console.log('Game loaded:', this.game);
        } else {
          console.error('Game not found!');
        }
      });
    } else {
      console.error('Game ID is undefined.');
    }
  }

  async newGame() {
    this.game = new Game();
  }

  takeCard() {
    if (!this.game.pickCardAnimation) {
      let card = this.game.stack.pop() || undefined; // Pop gibt eine Karte oder undefined zurück

      if (card !== undefined) {
        this.game.currentCard = card;
        console.log(this.game.currentCard);

        this.game.pickCardAnimation = true;
        this.game.currentPlayer++;
        this.game.currentPlayer =
          this.game.currentPlayer % this.game.players.length;
        this.updateGame();
        setTimeout(() => {
          this.game.playedCards.push(this.game.currentCard);
          this.game.pickCardAnimation = false;
          this.updateGame();
        }, 1000);
      }
    }
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(DialogAddPlayerComponent);

    dialogRef.afterClosed().subscribe((name: string) => {
      if (name && name.length > 0) {
        this.game.players.push(name);
        this.updateGame();
      }
    });
  }

  async updateGame() {
    console.log('start updateGame');
    console.log(this.game);

    if (this.gameId) {
      try {
        if (this.game instanceof Game) {
          const gameDocRef = doc(this.firestore, 'games', this.gameId);
          await updateDoc(gameDocRef, this.game.toJson());
          console.log('Game saved successfully');
        } else {
          console.error('this.game is not an instance of Game');
        }
      } catch (error) {
        console.error('Error saving game: ', error);
      }
    } else {
      console.error('Game ID is not defined');
    }
  }
}
