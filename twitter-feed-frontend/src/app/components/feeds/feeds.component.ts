import { Component, OnInit } from '@angular/core';
import { FeedService } from 'src/app/services/feed.service';
import { Subscription } from 'rxjs';
import { startWith } from 'rxjs/operators';
import { Socket } from 'ngx-socket-io';
import { Tweettweet } from 'src/app/models/tweettweet.model';


@Component({
  selector: 'app-feeds',
  templateUrl: './feeds.component.html',
  styleUrls: ['./feeds.component.css']
})
export class FeedsComponent implements OnInit {
feeds: string;
connection;
messages=[];
message;
  constructor(private feedService:FeedService) { }

  ngOnInit() {
  this.connection = this.feedService.getMessages().subscribe(message => { 
  this.messages.push(JSON.parse(message.toString())); 
  })
  }
}
