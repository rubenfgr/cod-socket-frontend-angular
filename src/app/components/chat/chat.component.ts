import { Component, OnInit, OnDestroy } from '@angular/core';
import { ChatService } from '../../services/chat.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit, OnDestroy {

  texto = '';
  mensajesSubscription: Subscription;
  mensajesPrivadosSubscription: Subscription;
  mensajes: any[] = [];
  element: HTMLElement;

  constructor(
    public chatService: ChatService
  ) { }

  ngOnInit(): void {

    this.element = document.getElementById('chat-messages');

    this.mensajesSubscription = this.chatService.getMessages().subscribe(msg => {

      this.mensajes.push(msg);

      setTimeout(() => {

        this.element.scrollTop = this.element.scrollHeight;

      }, 50);

    });

    this.mensajesPrivadosSubscription = this.chatService.getMessagesPrivate().subscribe(msg => {

      this.mensajes.push(msg);

    });

  }

  ngOnDestroy() {
    this.mensajesSubscription.unsubscribe();
    this.mensajesPrivadosSubscription.unsubscribe();
  }

  enviar() {

    if (this.texto.trim().length !== 0) {

      this.chatService.sendMessage(this.texto);
      this.texto = '';

    }
  }

}
