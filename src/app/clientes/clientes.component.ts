import { Component, OnInit } from '@angular/core';
import { Cliente } from './cliente';
import { ClienteService } from './cliente.service';
import { ModalService } from './detalle/modal.service';
import Swal from 'sweetalert2';
import { tap } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';



@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html',
  styleUrls: ['./cliente.component.css']
})
export class ClientesComponent implements OnInit {

  clientes: Cliente[] = [];
  clientesP: Cliente[] = [];
  paginador: any;
  clienteSeleccionado: Cliente;

  habilitar: boolean = true;
  habilitarP: boolean = true;

  constructor ( private clienteService: ClienteService,
   private modalService: ModalService,
   private activatedRoute: ActivatedRoute){}

ngOnInit(){
   this.clienteService.getClientes().pipe(
        tap(clientes => {
          console.log('Cliente: tap 3')
          clientes.forEach( cliente => {
            console.log(cliente.nombre);
          });
        })
   ).subscribe(clientes=>this.clientes=clientes);

   //#PAGE
   this.activatedRoute.paramMap.subscribe( params => {
   let page :number = +params.get('page');
   if(!page){
    page = 0;
   }
   this.clienteService.getClientesP(page)
   .pipe(
    tap(response => {
      console.log('Cliente Tap 3 Page');
      (response.content as Cliente[] ).forEach( cliente => console.log(cliente.nombre));
    })
).subscribe(response => {
  this.clientesP = response.content as Cliente[];
   this.paginador = response;

});
});
   this.modalService.notificarUpload.subscribe(cliente => {
     this.clientesP = this.clientesP.map(clienteOriginal => {
      if (cliente.id == clienteOriginal.id){
          clienteOriginal.foto = cliente.foto;
      }
      return clienteOriginal;
    })
   })
}






setHabilitarC(): void{
  console.log('setHabiltar');
  this.habilitar = (this.habilitar==true)?false:true
}
setHabilitarP(): void{
  console.log('setHabiltarP');
  this.habilitarP = (this.habilitarP==true)?false:true
}

delete(cliente: Cliente): void {
  Swal.fire({
    title: 'estas seguro?',
    text: `¿Seguro que desea eliminar al cliente ${cliente.nombre} ${cliente.apellido}`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Si, eliminar!'
  }).then((result) => {
    if (result.isConfirmed) {
      
      this.clienteService.delete(cliente.id).subscribe(
        response => {
          this.clientes = this.clientes.filter(cli => cli !== cliente)
          Swal.fire(
            'cliente Eliminado!',
            `cliente ${cliente.nombre} eliminado con exito`,
            'success'
          )
        }
      )

    }
  })
}

abrirModal(cliente: Cliente){
  this.clienteSeleccionado = cliente;
  this.modalService.abrirModal();
}


}
