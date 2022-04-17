import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { User } from '../_models/user';
import { AccountService } from '../_services/account.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent {
  model: any = {};

  constructor(
    public readonly accountService: AccountService,
    private readonly router: Router,
    private readonly toastr: ToastrService){}

  login() {
    this.accountService.login(this.model)
      .subscribe({
        next: () => {
          this.router.navigateByUrl('/members');
          this.toastr.success('Logged In!');
        }
      });
  }

  logout() {
    this.accountService.logout();
    this.router.navigateByUrl('/');
    this.toastr.success('Logged Out!');
  }
}
