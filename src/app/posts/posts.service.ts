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
          id: post._id,
          imagePath: post.imagePath
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
    return this.http.get<{_id: string, title: string, content: string, imagePath: string}>("http://localhost:3000/api/posts/" + id);
  }

  updatePost(id: string, title: string, content: string, image: any) {
    let postData;
    if(typeof(image) === 'object') {
      postData = new FormData();
      postData.append("id", id);
      postData.append("title", title);
      postData.append("content", content);
      postData.append("image", image, title);
    } else {
      postData = {id: id, title: title, content: content, imagePath: image};
    }
    this.http.put("http://localhost:3000/api/posts/" + id, postData)
      .subscribe((response) => {
        const updatedPosts = [...this.posts];
        const oldPost = updatedPosts.findIndex(p => p.id === id);
        const post: Post = {id:id, title: title, content: content, imagePath: image };
        updatedPosts[oldPost] = post;
        this.posts = updatedPosts;
        this.postUpdated.next([...this.posts]);
        this.router.navigate(["/"]);
      });

    }

  getPostUpdated() {
    return this.postUpdated.asObservable();
  }

  addPosts(title: string, content: string, image: File) {
    const  postData = new FormData();
    postData.append("title", title);
    postData.append("content", content);
    postData.append("image", image, title);

    this.http.post<{message: string, post: Post}>('http://localhost:3000/api/posts', postData)
      .subscribe((responsData) => {
        const post: Post = {id: responsData.post.id, title: title, content: content, imagePath: responsData.post.imagePath};
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
