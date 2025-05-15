import { Injectable } from '@angular/core';
import {
  Room,
  createLocalAudioTrack,
  LocalAudioTrack,
  RoomConnectOptions
} from 'livekit-client';
import { SignJWT } from 'jose';

@Injectable({
  providedIn: 'root'
})
export class LivekitService {
  private apiKey = 'devkey';
  private apiSecret = 'secret';
  private livekitHost = 'ws://localhost:7882';
  room: Room | null = null;
  async joinRoom(identity: string, roomName: string) {
    const token = await this.generateToken(identity, roomName);

    const room = new Room(); // ✅ Manual Room creation
    await room.connect('ws://localhost:7880', token); // ✅ connect via Room instance

    const audioTrack: LocalAudioTrack = await createLocalAudioTrack();
    await room.localParticipant.publishTrack(audioTrack);

    this.room = room;
    console.log(`✅ ${identity} joined room "${roomName}" and is publishing audio`);
  }

  async generateToken(identity: string, room: string): Promise<string> {
    const now = Math.floor(Date.now() / 1000);
    const jwt = await new SignJWT({
      'video': {
        'roomJoin': true,
        'room': room
      }
    })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt(now)
      .setExpirationTime(now + 60 * 60)
      .setIssuer(this.apiKey)
      .setSubject(identity)
      .sign(new TextEncoder().encode(this.apiSecret));

    return jwt;
  }
}
