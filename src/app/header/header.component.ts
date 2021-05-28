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
    this.authListnerSubs = this.authService.getAuthStatusLisntner().subscribe(isAuthenticated => {
      this.userisAuthenticated = true;
    });
  }

  ngOnDestroy() {
    this.authListnerSubs.unsubscribe();
  }

}
