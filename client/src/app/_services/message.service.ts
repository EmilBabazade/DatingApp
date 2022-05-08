import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Message } from '../_models/message';
import { BaseService } from './base.service';

@Injectable({
  providedIn: 'root'
})
export class MessageService extends BaseService {
  constructor(http: HttpClient) {
    super(http);
  }

  getMessages(pageNumer: number, pageSize: number, container: string) {
    let params = this.getPaginationHttpParams(pageNumer, pageSize);
    params = params.append('Container', container);
    return this.getPaginatedResult<Message[]>(this.baseUrl + 'messages', params);
  }

  getMessageThread(username: string) {
    return this.http.get<Message[]>(`${this.baseUrl}messages/thread/${username}`);
  }
}
