import { Component } from "@angular/core";
import { NgForm } from "@angular/forms";
import { AuthService } from "../auth.service";
import { User } from "../user.model";

@Component({
  styleUrls: ['./signup.component.css'],
  templateUrl: './signup.component.html'
})

export class SignupComponent {

  isLoading = false;

  constructor(public authService: AuthService) {}

  onSubmit(form: NgForm) {
    if(form.invalid) {
      return;
    }
    console.log(form);
    const user: User = {
      firstName: form.value.FirstName,
      lastName: form.value.LastName,
      email: form.value.email,
      password: form.value.password
    };
    console.log("_____________________");
    console.log(user);
    this.authService.createUser(user);
  }

}
