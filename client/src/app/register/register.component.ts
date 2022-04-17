import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { AccountService } from '../_services/account.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  @Output() cancelRegister = new EventEmitter<boolean>();
  model: any = {};

  constructor(
    private readonly accountService: AccountService,
    private readonly toastr: ToastrService) {}

  register() {
    this.accountService.register(this.model).subscribe({
      next: () => this.cancel(),
      error: err => {
        console.log(err);
        this.toastr.error(err.error);
      }
    });
  }

  cancel() {
    this.cancelRegister.emit(false);
  }
}
