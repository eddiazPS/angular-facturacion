import { Component, OnInit } from '@angular/core';

@Component({
  
  selector: 'app-directiva',
  templateUrl: './directiva.component.html'
  
})
export class DirectivaComponent {

  listaCurso: string[] = ['TypeScript','JavaScript','Java SE','C#','PHP'];

  habilitar33: boolean = true;

  constructor(){}

  setHabilitar(): void{
    this.habilitar33 = (this.habilitar33==true)?false:true
  }

  

}
