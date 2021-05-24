import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';

import { Post } from "./post.model";
import { Router } from "@angular/router";

@Injectable({providedIn: 'root'})
export class PostService {
  private posts: Post[] = [];
  private postUpdated = new Subject<Post[]>();

  constructor(private http: HttpClient, private router: Router) {}

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

  getPost(id: string) {
    return this.http.get<{_id: string, title: string, content: string}>("http://localhost:3000/api/posts/" + id);
  }

  updatePost(id: string, title: string, content: string) {
    const post: Post = {id: id, title: title, content: content};
    this.http.put("http://localhost:3000/api/posts/" + id, post)
      .subscribe((response) => {
        const updatedPosts = [...this.posts];
        const oldPost = updatedPosts.findIndex(p => p.id === id);
        updatedPosts[oldPost] = post;
        this.posts = updatedPosts;
        this.postUpdated.next([...this.posts]);
        this.router.navigate(["/"]);
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
        this.router.navigate(["/"]);
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
