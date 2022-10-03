import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { pais, paisSmall } from '../interfaces/paises.interfaces';

@Injectable({
  providedIn: 'root'
})
export class PaisesService {
  private baseUrl: string = 'https://restcountries.com/v3.1'
  private _regiones: string[] = ['Africa', 'Americas', 'Asia', 'Europe', 'Oceania'];

  get regiones(): string[] {
    return [ ...this._regiones ];
  }

  constructor( private http: HttpClient) { }

  getPaisesPorRegion( region: string ): Observable<paisSmall[]>{
    const url: string = `${ this.baseUrl }/region/${ region }?fields=cca3&fields=name`
    return this.http.get<paisSmall[]>( url );
  }

  getPaisporCodigo( codigo: string ): Observable<pais[] | null> {

    if( !codigo ){
      return of( null )
    }

    const url: string = `${ this.baseUrl }/alpha/${ codigo }`;
    return this.http.get<pais[]>( url );

  }
}
