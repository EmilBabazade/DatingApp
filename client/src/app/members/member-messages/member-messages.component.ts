import { Component, Input, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MessageService } from 'src/app/_services/message.service';

@Component({
  selector: 'app-member-messages',
  templateUrl: './member-messages.component.html',
  styles: [`
    .card {
      border: none;
    }
    .chat {
      list-style: none;
      margin: 0;
      padding: 0;
    }
    .chat li {
      margin-bottom: 10px;
      padding-bottom: 10px;
      border-bottom: 1px dotted #b3a9a9;
    }
    .rounded-circle {
      max-height: 50px;
    }
  `]
})
export class MemberMessagesComponent {
  @ViewChild('messageForm') messageForm: NgForm;
  @Input() username: string;
  messageContent: string;

  constructor(public messageService: MessageService) { }

  sendMessage() {
    this.messageService.sendMessage(this.username, this.messageContent).then(() => {
      this.messageForm.reset();
    });
  }
}
