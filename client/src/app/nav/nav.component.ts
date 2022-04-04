import { Component, OnInit } from "@angular/core";
import { User } from "../_models/user";
import { AccountService } from "../_services/account.service";

@Component({
  selector: "app-nav",
  templateUrl: "./nav.component.html",
  styleUrls: ["./nav.component.css"]
})
export class NavComponent {
  model: any = {};

  constructor(public readonly accountService: AccountService){}

  login() {
    this.accountService.login(this.model)
      .subscribe({
        error: err => console.log(err)
      });
  }

  logout() {
    this.accountService.logout();
  }
}
