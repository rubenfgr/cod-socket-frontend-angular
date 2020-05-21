import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { Observable } from 'rxjs';
import { Usuario } from 'models/usuario';

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {

  public socketStatus = false;
  public usuario: Usuario = null;

  constructor(private socket: Socket) {
    this.cargarStorage();
    this.checkStatus();
  }

  checkStatus() {

    this.socket.on('connect', () => {
      console.log('Conectado al Servidor');
      this.socketStatus = true;
    });

    this.socket.on('disconnect', () => {
      console.log('Desconectado al Servidor');
      this.socketStatus = false;
    });
  }

  emit(event: string, payload?: any, callback?: Function) {

    console.log('Emitiendo', event);
    // emit('EVENTO', payload?, callback?)
    this.socket.emit(event, payload, callback);

  }

  listen(event: string): Observable<any> {
    return this.socket.fromEvent(event);
  }

  loginWS(nombre: string) {

    return new Promise((resolve, reject) => {
      this.emit('configurar-usuario', { nombre }, resp => {

        this.usuario = new Usuario(nombre);
        this.guardarStorage();
        resolve();

      });
    });
  }

  getUsuario() {
    return this.usuario;
  }

  guardarStorage() {
    localStorage.setItem('usuario', JSON.stringify(this.usuario));
  }

  cargarStorage() {
    if (localStorage.getItem('usuario')) {
      this.usuario = JSON.parse(localStorage.getItem('usuario'));
      this.loginWS(this.usuario.nombre);
    }
  }

}