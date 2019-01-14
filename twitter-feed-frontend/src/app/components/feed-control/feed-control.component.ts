import { Component, OnInit } from '@angular/core';
import { FeedService } from 'src/app/services/feed.service';
@Component({
  selector: 'app-feed-control',
  templateUrl: './feed-control.component.html',
  styleUrls: ['./feed-control.component.css']
})
export class FeedControlComponent implements OnInit {
tweetFilter:string;
  constructor(private feedService:FeedService) { }

  ngOnInit() {
  }
  applyFilter(){
  	this.feedService.sendMessage(this.tweetFilter);
  }
}
