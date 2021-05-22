import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';

import { Post } from "./post.model";

@Injectable({providedIn: 'root'})
export class PostService {
  private posts: Post[] = [];
  private postUpdated = new Subject<Post[]>();

  constructor(private http: HttpClient) {}

  getPosts() {
    this.http.get<{message: string, posts: any}>('http://localhost:3000/api/posts')
      .pipe(map((postData) => {
        console.log(postData);
        return postData.posts.map(post => {
          return {
          title: post.title,
          content: post.content,
          id: post._id
          };
        });
      }))
      .subscribe((newPosts) => {
        this.posts = newPosts;
        console.log(this.posts);
        this.postUpdated.next([...this.posts]);
      });
  }

  getPostUpdated() {
    return this.postUpdated.asObservable();
  }

  addPosts(title: string, content: string) {
    const  post:  Post = {id: null, title: title, content: content};
    this.http.post<{message: string, postID: string}>('http://localhost:3000/api/posts', post)
      .subscribe((responsData) => {
        post.id = responsData.postID;
        this.posts.push(post);
        this.postUpdated.next([...this.posts]);
      });
  }

  deletePost(id: string) {
    this.http.delete("http://localhost:3000/api/posts/" + id)
    .subscribe(() => {
      const updatedPosts = this.posts.filter(post => post.id != id);
      this.posts = updatedPosts;
      this.postUpdated.next([...this.posts]);
    });
  }
}
