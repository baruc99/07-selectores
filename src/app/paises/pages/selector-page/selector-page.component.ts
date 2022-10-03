import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators  } from "@angular/forms";
import { switchMap, tap } from 'rxjs';
import { paisSmall } from '../../interfaces/paises.interfaces';
import { PaisesService } from '../../services/paises.service';

@Component({
  selector: 'app-selector-page',
  templateUrl: './selector-page.component.html',
  styles: [
  ]
})
export class SelectorPageComponent implements OnInit {

  miFormulario: FormGroup = this.fb.group({

    region   : ['', Validators.required ],
    pais     : ['', Validators.required ],
    fronteras: ['', Validators.required ],

  });

  // llenar selectores
  regiones: string[]    = [];
  paises: paisSmall[]   = [];
  fronteras: string[] | undefined = [];

  // UI
  cargando: boolean = false;




  constructor( private fb: FormBuilder,
              private paisesService: PaisesService ) { }

  ngOnInit(): void {

    this.regiones = this.paisesService.regiones;

    // cuando cambia de region
    this.miFormulario.get('region')?.valueChanges
      .pipe(
        tap( ( _ ) => { 
          this.miFormulario.get('pais')?.reset('');
          // this.miFormulario.get('fronteras')?.disable();
          this.cargando =  true;
        } ),
        switchMap( region => this.paisesService.getPaisesPorRegion( region ))
      )
      .subscribe( paises => {
        
        this.paises = paises;

        this.cargando = false;
        
      });

      // cuando cambia el pais
      this.miFormulario.get('pais')?.valueChanges
      .pipe(
        tap( () => { 
          this.fronteras = [];
          this.miFormulario.get('fronteras')?.reset('');
          // this.miFormulario.get('fronteras')?.enable();
          this.cargando =  true;
        } ),
        switchMap( codigo => this.paisesService.getPaisporCodigo( codigo ))
      )
      .subscribe( pais => {
        
         this.fronteras =  pais? pais[0]?.borders:[];
         console.log( pais ); 
         this.cargando =  false;
        
      });  


  }

  guardar(){
    
    console.log( this.miFormulario.value );
    
    
  }
}
