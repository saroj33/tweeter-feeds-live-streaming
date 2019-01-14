import { Component, OnInit } from '@angular/core';
import { FeedService } from 'src/app/services/feed.service';
import { FeedsComponent } from 'src/app/components/feeds/feeds.component';
@Component({
  providers:[FeedsComponent],
  selector: 'app-feed-control',
  templateUrl: './feed-control.component.html',
  styleUrls: ['./feed-control.component.css']
})
export class FeedControlComponent implements OnInit {
tweetFilter:string;
  constructor(private feedService:FeedService,private feedsComponent:FeedsComponent) { }

  ngOnInit() {
  }
  applyFilter(){
      
      if(this.tweetFilter.length>0){
      this.feedService.sendMessage(this.tweetFilter);
      }
  }
}
