import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { BehaviorSubject } from 'rxjs';
import { take } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Message } from '../_models/message';
import { User } from '../_models/user';
import { BaseService } from './base.service';

@Injectable({
  providedIn: 'root'
})
export class MessageService extends BaseService {
  private readonly hubUrl = environment.hubUrl;
  private hubConnection: HubConnection;
  private readonly messageThreadSource = new BehaviorSubject<Message[]>([]);
  messageThread$ = this.messageThreadSource.asObservable();

  constructor(http: HttpClient) {
    super(http);
  }

  createHubConnection(user: User, otherUsername: string) {
    this.hubConnection = new HubConnectionBuilder()
      .withUrl(`${this.hubUrl}message?user=${otherUsername}`, {
        accessTokenFactory: () => user.token
      })
      .withAutomaticReconnect()
      .build();
    this.hubConnection.start().catch(err => console.log(err));

    this.hubConnection.on('RecieveMessageThread', messages => this.messageThreadSource.next(messages));

    this.hubConnection.on('NewMessage', message => {
      this.messageThread$.pipe(take(1)).subscribe(messages =>
        this.messageThreadSource.next([...messages, message])
      );
    });
  }

  stopHubConnection() {
    if(this.hubConnection)
      this.hubConnection.stop();
  }

  getMessages(pageNumer: number, pageSize: number, container: string) {
    let params = this.getPaginationHttpParams(pageNumer, pageSize);
    params = params.append('Container', container);
    return this.getPaginatedResult<Message[]>(this.baseUrl + 'messages', params);
  }

  getMessageThread(username: string) {
    return this.http.get<Message[]>(`${this.baseUrl}messages/thread/${username}`);
  }

  async sendMessage(username: string, content: string) {
    try {
      return await this.hubConnection.invoke('SendMessage', { recipientUsername: username, content });
    } catch (err) {
      return console.log(err);
    }
  }

  deleteMessage(id: number) {
    return this.http.delete(this.baseUrl + 'messages/' + id);
  }
}
