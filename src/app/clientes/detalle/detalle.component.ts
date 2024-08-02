import { Component, OnInit, Input } from '@angular/core';
import { Cliente} from '../cliente';
import { ClienteService } from '../cliente.service';
import { ModalService } from './modal.service';
import Swal from 'sweetalert2'
import { HttpEventType } from '@angular/common/http';
import { FacturaService } from '../../facturas/services/factura.service';
import { Factura } from '../../facturas//models/factura';

@Component({
  selector: 'detalle-cliente',
  templateUrl: './detalle.component.html',
  styleUrls: ['./detalle.component.css']
})

export class DetalleComponent implements OnInit {
@Input() cliente: Cliente;
titulo : string = "Detalle del Cliente";
fotoSeleccionada: File;
progreso: number = 0;

constructor (private clienteService: ClienteService, 
  private facturaService: FacturaService,
    public modalService: ModalService){}
   
ngOnInit(){
/* CUANDO PASA POR PARAMETRO EL {id} SE CARGA EN EL OnInit
this.activatedRoute.paramMap.subscribe(params => {
  let id:number = +params.get('id');
  if (id){
    this.clienteService.getCliente(id).subscribe( cliente =>{
      this.cliente = cliente;
    });
  }
});*/
}

seleccionarFoto(event){
  
  this.fotoSeleccionada = event.target.files[0];
  this.progreso = 0;
  console.log ("TAMAÑO: "+this.fotoSeleccionada.size+"  TIPO: "+this.fotoSeleccionada.type);
  if (this.fotoSeleccionada.size > 10000000){
    Swal.fire('Error seleccionar imagen: ','El archivo debe menor a 10M' ,'error');
    this.fotoSeleccionada = null;
   }
  if(this.fotoSeleccionada.type.indexOf('image')<0){
    Swal.fire('Error seleccionar imagen: ','El archivo debe ser del tipo imagen' ,'error');
    this.fotoSeleccionada = null;
  }
  }

subirFoto():void{

  if(!this.fotoSeleccionada){
 Swal.fire('Error Upload: ','Debe seleccionar una foto' ,'error');
  }else{

  console.log(this.fotoSeleccionada);
  console.log(' Id : '+ this.cliente.id);

  this.clienteService.subirFoto(this.fotoSeleccionada, this.cliente.id)
  .subscribe(event => {
    if (event.type === HttpEventType.UploadProgress){
     this.progreso = Math.round((event.loaded/event.total)*100);

    } else if (event.type === HttpEventType.Response){
      let response: any = event.body;
      this.cliente = response.cliente as Cliente; 

       this.modalService.notificarUpload.emit(this.cliente);
      Swal.fire('La foto se ha subido completamente',response.mensaje,'success');
    }
    
    
  });
}
}


cerrarModal (){
  this.modalService.cerrarModal();
  this.fotoSeleccionada=null;
  this.progreso = 0;
}

delete(factura: Factura):void{
  Swal.fire({
    title: 'estas seguro?',
    text: `¿Seguro que desea eliminar la factura ${factura.descripcion}`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Si, eliminar!'
  }).then((result) => {
    if (result.isConfirmed) {
      
      this.facturaService.delete(factura.id).subscribe(
        response => {
          this.cliente.facturas = this.cliente.facturas.filter(f => f !== factura)
          Swal.fire(
            'Factura Eliminada!',
            `factura ${factura.descripcion} eliminado con exito`,
            'success'
          )
        }
      )

    }
  })
}

}
