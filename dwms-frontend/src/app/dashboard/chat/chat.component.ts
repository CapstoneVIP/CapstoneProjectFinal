import { Component, OnInit, OnDestroy } from '@angular/core';
import { ChatService } from '../../_services/chat.service';
import { UserService } from '../../_services/user.service';
import { Message } from '../../_models/message.model';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css'],
  providers: [ChatService]
})

export class ChatComponent implements OnInit, OnDestroy {
  connection;
  messages = [];
  message: Message;
  
  constructor( private _userService: UserService, private _chatService:ChatService) { }
  
  /**
   * Desc: Works with the _chatService to actually send a message to the
   * chat-server.js file. 
  */
  sendMessage() {
    //Send information to server (via chat.service.ts)
    this.message.text = this.message.text;
    this._chatService.sendMessage(this.message);
    this.message.text = '';
  }

  /**
  * Desc: On component initialization set up message parameters based off of
  * th elogged in user credentials
  */
  ngOnInit() {

    //Create the message struct
    this.message = new Message();
    this.message.firstname = this._userService.get().firstname;
    this.message.lastname = this._userService.get().lastname;
    this.message.email = this._userService.get().email;

  	this.connection = this._chatService.getMessages().subscribe(message => {
  		this.messages.push(message);
  	})
  }

  /**
  * Desc: On component destroy set message to null, and unsubscribe the connection
  * to the chat server
  */
  ngOnDestroy() {
    this.message = null;
  	this.connection.unsubscribe();
  }

}
 