import { Component, OnDestroy, OnInit } from "@angular/core";
import { Subscription } from "rxjs";
import { AuthService } from "../auth/auth.service";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})

export class HeaderComponent implements OnInit, OnDestroy{
  private authListnerSubs: Subscription;
  userisAuthenticated = false;

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.userisAuthenticated = this.authService.getAuthenticationStaus();
    this.authListnerSubs = this.authService.getAuthStatusLisntner().subscribe(isAuthenticated => {
      console.log("Header: " + isAuthenticated);
      this.userisAuthenticated = isAuthenticated;
    });
  }

  onLogout() {
    console.log("Logout called!!!");
    this.authService.logout();
  }

  ngOnDestroy() {
    this.authListnerSubs.unsubscribe();
  }

}
