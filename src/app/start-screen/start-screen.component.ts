import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Firestore, collection, addDoc } from '@angular/fire/firestore';
import { Game } from '../../models/game';

@Component({
  selector: 'app-start-screen',
  standalone: true,
  imports: [],
  templateUrl: './start-screen.component.html',
  styleUrl: './start-screen.component.scss',
})
export class StartScreenComponent {
  firestore: Firestore = inject(Firestore);

  constructor(private router: Router) {}

  async newGameStart() {
    let game = new Game();
    await addDoc(collection(this.firestore, 'games'), game.toJson()).then(
      (gameInfo: any) => {
        this.router.navigateByUrl('/game/' + gameInfo.id); // Navigieren zu umserem Spiel mit der Id
      }
    );
  }
}

// .then        wird nur einmal aufgerufen
// .subscribe   wird mehrmals aufgerufen
