import { formatCurrency } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { NgForm } from "@angular/forms";
import { ActivatedRoute, ParamMap } from "@angular/router";
import { Post } from "../post.model";

import { PostService } from "../posts.service";

@Component({
  selector: 'app-post-create',
  styleUrls: ['./post-create.component.css'],
  templateUrl: './post-create.component.html'
})

export class PostCreateComponent implements OnInit {

    private mode = 'create';
    private postId: string;
    isLoading = false;
    post: Post;

    constructor(public postService: PostService, public route:ActivatedRoute) {}

    ngOnInit() {
      this.route.paramMap.subscribe((paramMap: ParamMap) => {
        if (paramMap.has('postId')) {
          this.mode = 'edit';
          this.postId = paramMap.get('postId');
          this.isLoading = true;
          this.postService.getPost(this.postId).subscribe(postDate => {
            this.isLoading = false;
            this.post = {id: postDate._id, title: postDate.title, content: postDate.content}
          });
        } else {
          this.mode = 'create';
          this.postId = null;
        }
      });
    }

    onSavePost(fPost: NgForm) {
      if (fPost.invalid) {
        return;
      }
      this.isLoading = true;
      if (this.mode == 'create') {
        this.postService.addPosts(fPost.value.title, fPost.value.content);
        alert ('Post Aadded!!!!');
        fPost.resetForm();
      } else {
        this.postService.updatePost(this.postId, fPost.value.title, fPost.value.content)
      }
    }
}
