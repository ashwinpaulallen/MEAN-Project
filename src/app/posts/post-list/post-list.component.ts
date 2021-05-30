import { Component, OnDestroy, OnInit } from "@angular/core";
import { PageEvent } from "@angular/material/paginator";
import { Subscription } from 'rxjs';
import { AuthService } from "src/app/auth/auth.service";
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
  totalPosts = 0;
  postsPerPage = 5;
  pageSizeOption = [5, 10, 50, 100];
  currPage = 1;
  isLoading = false;
  private authListnerSubs: Subscription;
  userisAuthenticated = false;

  constructor(public postService: PostService, private authService: AuthService) {}

  ngOnInit() {
    this.isLoading = true;
    this.postService.getPosts(this.postsPerPage, this.currPage);
    this.postSub = this.postService.getPostUpdated().subscribe((result: {post: Post[], postCount: number}) => {
      this.isLoading = false;
      this.posts= result.post;
      this.totalPosts = result.postCount;
    });
    this.userisAuthenticated = this.authService.getAuthenticationStaus();
    this.authListnerSubs = this.authService.getAuthStatusLisntner().subscribe(isAuthenticated => {
      this.userisAuthenticated = isAuthenticated;
    });
  }

  onChangePage(pageData: PageEvent) {
    this.isLoading = true;
    this.currPage = pageData.pageIndex +1;
    this.postsPerPage = pageData.pageSize;
    this.postService.getPosts(this.postsPerPage, this.currPage);

    this.postSub = this.postService.getPostUpdated().subscribe((result: {post: Post[], postCount: number}) => {
      this.isLoading = false;
      this.posts= result.post;
      this.totalPosts = result.postCount;
    });
  }

  onDelete(id: string) {
    this.isLoading = true;
    this.postService.deletePost(id).subscribe(() => {
      this.postService.getPosts(this.postsPerPage, this.currPage);
    });
  }

  ngOnDestroy() {
    this.postSub.unsubscribe();
    this.authListnerSubs.unsubscribe();
  }
}
