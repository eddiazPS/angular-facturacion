import { Injectable } from '@angular/core';
import { formatDate, DatePipe } from '@angular/common';
import { CLIENTES } from './clientes.json';
import { Cliente } from './cliente';
import {Region} from './region';
import { of, Observable, throwError } from 'rxjs';
import { HttpClient, HttpHeaders, HttpRequest, HttpEvent } from '@angular/common/http'
import { map, catchError, tap } from 'rxjs/operators'
import Swal from 'sweetalert2'
import {  Router } from '@angular/router'


@Injectable({
  providedIn: 'root'
})
export class ClienteService {
private urlEndPoint:string =  'http://localhost:8080/api/clientes'
private  httpHeaders = new HttpHeaders ({'Content-type': 'application/json'})
private  httpHeadersFoto = new HttpHeaders ({'enctype': 'multipart/from-data'}) /** delaradas Yo */
constructor(private http: HttpClient, private router : Router) { }
getRegiones(): Observable<Region[]>{
return this.http.get<Region[]>(this.urlEndPoint + '/regiones')
}

getClientes(): Observable<Cliente[]> {

  return this.http.get(this.urlEndPoint).pipe(
    tap(response => {
      let clientes = response as Cliente[];
      console.log('ClienteService: Tap 1 C')
      clientes.forEach( cliente => {
        console.log(cliente.nombre);
      }

      )
    }),
   map( response => {
    let clientes = response as Cliente[];
    
    return clientes.map(cliente => {
      cliente.nombre = cliente.nombre[0].toUpperCase() + cliente.nombre.substr(1).toLowerCase();
      cliente.apellido = cliente.apellido[0].toUpperCase() + cliente.apellido.substr(1).toLowerCase();
      
      let datePipe = new DatePipe('es');
      //cliente.createAt = datePipe.transform(cliente.createAt, 'EEE d, MMM yyyy' );//ºº 'fullDate' ºº 'EEEE dd, MMMM yyyy'   ºº 
      //cliente.createAt =formatDate(cliente.createAt, 'dd-MM-yyyy','en-US')
      return cliente;
    });
  }
  ),
  tap(response => {
    console.log('ClienteService: Tap 2 C')
    response.forEach( cliente => {
      console.log(cliente.nombre);
    }

    )
  })
   );

}

getClientesP(page: number): Observable<any> {
  return this.http.get(this.urlEndPoint+ '/page/' + page).pipe(
    tap((response: any) => { 
      console.log('ClienteService: Tap 1 page');
      (response.content as Cliente[]).forEach( cliente => {
        console.log(cliente.nombre);
      })
    }),
   map( (response : any) => {
     (response.content as Cliente[]).map(cliente => {
      cliente.nombre = cliente.nombre[0].toUpperCase() + cliente.nombre.substr(1).toLowerCase();
      cliente.apellido = cliente.apellido[0].toUpperCase() + cliente.apellido.substr(1).toLowerCase();
      
      let datePipe = new DatePipe('es');
      //cliente.createAt = datePipe.transform(cliente.createAt, 'EEE d, MMM yyyy' );//ºº 'fullDate' ºº 'EEEE dd, MMMM yyyy'   ºº 
      //cliente.createAt =formatDate(cliente.createAt, 'dd-MM-yyyy','en-US')
      return cliente;
    });
    return response;
  }),
  tap(response => {
    console.log('ClienteService: Tap 2 Page');
    (response.content as Cliente[]).forEach( cliente => {
      console.log(cliente.nombre);
    }

    )
  })
   );

}


create(cliente: Cliente) : Observable<Cliente>{
  return   this.http.post(this.urlEndPoint, cliente, /*{headers: this.httpHeaders}*/).pipe(
    map((response: any) => response.cliente as Cliente),
    catchError(e => {
if(e.status==400){
  return throwError(()=>e);
}

      console.error(e.error.mensaje)
      Swal.fire( e.error.mensaje,e.error.error,'error')
      return throwError(()=>e);
    })
  );
}


getCliente(id:number): Observable<Cliente>{
  return this.http.get<Cliente>(`${this.urlEndPoint}/${id}`).pipe(
    catchError(e => {
      console.log('DENTRO DE: getCliente ');
      this.router.navigate(['/clientes'])
      console.error(e.error.mensaje);
      Swal.fire('Error al editar', e.error.mensaje, 'error');
      return throwError(()=> e);
    })
  );
}

update(cliente: Cliente): Observable<any>{
  return this.http.put<any>(`${this.urlEndPoint}/${cliente.id}`,cliente, {headers: this.httpHeaders}).pipe(
    catchError(e => {
      if(e.status==400){
        return throwError(()=>e);
      }
      console.error(e.error.mensaje)
      Swal.fire( e.error.mensaje,e.error.error,'error')
      return throwError(()=>e);
    })
  );
  }

delete(id: number): Observable<Cliente>{
 return this.http.delete<Cliente>(`${this.urlEndPoint}/${id}`/*,{headers: this.httpHeaders}*/).pipe(
  catchError(e => {
    console.error(e.error.mensaje)
    Swal.fire( e.error.mensaje,e.error.error,'error')
    return throwError(()=>e);
  })
 );
}



subirFoto(archivo: File,id): Observable<HttpEvent<{}>>{
  let formData = new FormData();
  formData.append("archivo",archivo);
  formData.append("id",id);
  const req = new HttpRequest('POST', `${this.urlEndPoint}/upload`,formData, {
    reportProgress: true
  });
  return this.http.request(req); 
  }



}
