import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms'; // ✅ Import FormsModule
import { CommonModule } from '@angular/common'; // Good practice
import { LivekitService } from '../livekit.service';

@Component({
  selector: 'app-root',
  standalone: true, // ✅ Standalone component
  imports: [CommonModule, FormsModule], // ✅ Add FormsModule here
  template: `
    <h2>🎤 Join LiveKit Room (Local)</h2>
    <input [(ngModel)]="identity" placeholder="Your name" />
    <input [(ngModel)]="room" placeholder="Room name" />
    <button (click)="join()">Join</button>
  `
})
export class AppComponent {
  identity = 'user1';
  room = 'test';

  constructor(private livekit: LivekitService) {}

  async join() {
    try {
      await this.livekit.joinRoom(this.identity, this.room);
    } catch (e) {
      console.error('Failed to connect:', e);
    }
  }
}
