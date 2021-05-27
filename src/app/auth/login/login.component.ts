import { Component } from "@angular/core";
import { NgForm } from "@angular/forms";

@Component({
  styleUrls: ['./login.component.css'],
  templateUrl: './login.component.html'
})

export class LoginComponent {

  isLoading = false;

  onLogin(form: NgForm) {
    console.log(form.value);
  }

}
