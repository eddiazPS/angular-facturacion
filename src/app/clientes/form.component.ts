import { Component, OnInit } from '@angular/core';
import { Cliente } from './cliente'
import {Region} from './region';
import { ClienteService } from './cliente.service';
import { Router, ActivatedRoute } from '@angular/router';
import swal from 'sweetalert2'

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html'
})
export class FormComponent   implements OnInit  {


  cliente: Cliente = new Cliente(null,null,null,null,null) 
  regiones: Region[]; 
  titulo:string = "CREAR CLIENTE"
   errores: string[];

  constructor (private clienteService: ClienteService,
                private router: Router,
                private activatedRoute:ActivatedRoute){}
   
ngOnInit(): void {
  this.cargarCliente()
}


  

  cargarCliente(): void{
this.activatedRoute.params.subscribe(params => {
  console.log('dentro de From.Component CargarCliente');
  let id = params ['id']
  if(id){
    console.log(id)
    this.clienteService.getCliente(id).subscribe((cliente)=>{ this.cliente = cliente
      console.log(cliente)
    }
    )}
  this.clienteService.getRegiones().subscribe(regiones => this.regiones = regiones );
})
  }

   create(): void {
    console.log("CREATE Clicked!")
    console.log(this.cliente)
    this.clienteService.create(this.cliente)
    .subscribe(cliente => {
        this.router.navigate(['/clientes'])
        swal.fire('Nuevo cliente', `El cliente ${cliente.nombre} ha sido creado con exito `,'success')
    },
    err => {
      this.errores = err.error.error as string [];
      console.error('Codigo del error desde el backend: '+ err.status);
      console.error(err.error.error);
      console.error(this.errores);
    } 
    );
  }

  update():void{
    console.log("UPDATE Clicked!")
    console.log(this.cliente)
    this.clienteService.update(this.cliente)
    .subscribe(json => {
      this.router.navigate(['/clientes'])
      swal.fire('Cliente Actualizado',`${json.mensaje}: ${json.cliente.nombre} `,'success')
    },
    err => {
      this.errores = err.error.errors as string [];
      console.error('Codigo del error desde el backend: '+ err.status);
      console.error(err.error.errors);
    } 
    );
  }

  compararRegion(o1:Region, o2:Region):boolean{
    
    if (o1 === undefined && o2 === undefined){
      return true;
    }
    return o1 === null || o2 === null || o1 === undefined || o2 === undefined? false: o1.id === o2.id
    //o2 === undefined
  }


}
