import { formatCurrency } from "@angular/common";
import { Component } from "@angular/core";
import { NgForm } from "@angular/forms";

import { PostService } from "../posts.service";

@Component({
  selector: 'app-post-create',
  styleUrls: ['./post-create.component.css'],
  templateUrl: './post-create.component.html'
})

export class PostCreateComponent {

    constructor(public postService: PostService) {}

    onAddPost(fPost: NgForm) {
      if (fPost.invalid) {
        return;
      }

      this.postService.addPosts(fPost.value.title, fPost.value.content);
      alert ('Post Aadded!!!!');
      fPost.resetForm();
    }
}
