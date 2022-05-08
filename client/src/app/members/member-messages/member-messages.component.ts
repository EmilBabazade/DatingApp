import { Component, Input, OnInit } from '@angular/core';
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
export class MemberMessagesComponent implements OnInit {
  @Input() username: string;
  messages: Message[];

  constructor(private messageService: MessageService) { }

  ngOnInit(): void {
    this.loadMessages();
  }

  private loadMessages() {
    this.messageService.getMessageThread(this.username)
      .subscribe(messages => this.messages = messages);
  }
}
