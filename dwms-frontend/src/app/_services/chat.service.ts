/*
  Basic service for chat application which defines
  the '.on' commands which tie into the server's 
  predefined action attributes.
*/
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import * as io from 'socket.io-client';

@Injectable()
export class ChatService {

  private url = 'http://174.138.38.245:5000';
  private socket;

  constructor() { }

  /**
   * Desc: Sends messages to the chat-server.js via
   * socket.io
  */
  sendMessage(message){
    this.socket.emit('add-message', message);   
  }

  /**
  * Desc: Receives message from te chat-server.js via
  * socket.io event
  */
  getMessages() {
    let observable = new Observable(observer => {
      this.socket = io(this.url);
      this.socket.on('message', (data) => {
        observer.next(data);   
      });
      return () => {
        this.socket.disconnect();
      }; 
    })    
    return observable;
  } 
}