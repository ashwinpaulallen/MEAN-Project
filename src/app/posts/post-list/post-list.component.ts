import { Component, OnDestroy, OnInit } from "@angular/core";
import { Subscription } from 'rxjs';
import { Post } from "../post.model";
import { PostService } from "../posts.service";

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})

export class PostListComponent implements OnInit, OnDestroy {
  // posts = [
  //   {title: 'First Post', content: 'First Post Content'},
  //   {title: 'Second Post', content: 'Second Post Content'},
  //   {title: 'Third Post', content: 'Third Post Content'},
  //   {title: 'Fourth Post', content: 'Fourth Post Content'},
  //   {title: 'Fifth Post', content: 'Fifth Post Content'}
  // ];
  posts: Post[] = [];
  private postSub: Subscription;

  constructor(public postService: PostService) {}

  ngOnInit() {
    this.postService.getPosts();
    this.postSub = this.postService.getPostUpdated().subscribe((posts: Post[]) => {
      this.posts= posts;
    });
  }

  ngOnDestroy() {
    this.postSub.unsubscribe();
  }
}
