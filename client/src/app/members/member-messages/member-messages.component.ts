import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Message } from 'src/app/_models/message';
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
  @Input() messages: Message[] = [];
  @Input() username: string;
  messageContent: string;

  constructor(private messageService: MessageService) { }

  sendMessage() {
    this.messageService.sendMessage(this.username, this.messageContent).subscribe(message => {
      this.messages.push(message);
      this.messageForm.reset();
    });
  }
}
