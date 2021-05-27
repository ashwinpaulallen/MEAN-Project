import { Component } from "@angular/core";
import { NgForm } from "@angular/forms";

@Component({
  styleUrls: ['./signup.component.css'],
  templateUrl: './signup.component.html'
})

export class SignupComponent {

  isLoading = false;

  onSubmit(form: NgForm) {
    console.log(form.value);
  }

}
