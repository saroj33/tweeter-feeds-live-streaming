import { Injectable } from '@angular/core';
import { Tweettweet } from '../models/tweettweet.model';
import { Subject } from 'rxjs/Subject'; 
import { Observable } from 'rxjs/Observable'; 
import * as io from 'socket.io-client'; 

@Injectable({
  providedIn: 'root'
})
export class FeedService {
   private url = 'http://localhost:3000'; 
   private socket;

  constructor() { }

  sendMessage(message){ 
  	this.socket.emit('addMessage', message); 
  }

  getMessages() { 
  	let observable = new Observable(observer => { 
  		this.socket = io(this.url); 
  		this.socket.on('stream', (data) => {
   		observer.next(data);
    }); 
    return () => { 
    	this.socket.disconnect();
     }; 
    }) 
    return observable; } 
}
