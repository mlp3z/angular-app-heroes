import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, delay } from 'rxjs/operators'
import Swal from 'sweetalert2';

import { HeroeModel } from '../models/heroe.model';


@Injectable({
  providedIn: 'root'
})
export class HeroesService {

    private urlFirebase = 'https://angular-heroes-crud.firebaseio.com';

    constructor(
        private httpClient:HttpClient
    ) { 

    }


    createHeroe( heroe: HeroeModel){

        return this.httpClient.post(`${this.urlFirebase}/heroes.json`, heroe )
            //con el pipe manupulo la respuesta que vera quien se subscriba a este metodo
            .pipe(
                map( (resp:any) => {
                    //aqui ya puedo tener el id que me retorna firebase
                    //le cargo el id al objeto heroe y retorno ese objeto como respuesta
                    //si no se realizara esta manipulacion la respuesta seria solo el id de firebase
                    //pero de esta forma le llega el objeto completo al component que use este service
                    heroe.id = resp.name 
                    return heroe;
                })
            );

    }


    updateHeroe( heroe: HeroeModel ){

        //aqui no hay que enviar el id a firebase xq sino creara un campo con ese dato
        //esto es para no usar el objeto que viene por referencia, asi podemos quitarle el id y enviarlo a firebase
        const heroeTmp = {
            ...heroe
        }
        delete heroeTmp.id; //aqui no puedo hacer: delete heroe.id, porque el heroe viene como referencia
        //y si eliminamos su property id aqui tambien se va a eliminar en el componente que lo usa

        return this.httpClient.put(`${this.urlFirebase}/heroes/${heroe.id}.json`, heroeTmp );

    }


    createUpdateHeroe( heroe: HeroeModel ){
        if(heroe.id){
            return this.updateHeroe( heroe );
        }else{
            return this.createHeroe( heroe );
        }
    }


    getHeroes(){

        return this.httpClient.get(`${this.urlFirebase}/heroes.json`)
            .pipe( 

                // map( resp => {
                //     return this.parseObjectToArray(resp)
                // })

                // map( resp => this.parseObjectToArray(resp))

                map( this.parseHeroesObjectToArray ) //aqui con sintaxis resumida, 
                //el primer arg para la funcion va a ser el primer arg que retorna la funcion map

                // ,delay(1000) //demora la respuesta
            );
    }

    private parseHeroesObjectToArray(heroesObj:object){

        // console.log(heroesObj);
        if (heroesObj === null) { return []; }

        let heroesArray : HeroeModel[] = [];
        let heroe:HeroeModel;
        Object.keys(heroesObj).forEach( key => {

            // console.log(key, heroesObj[key]);
            heroe = new HeroeModel()
            heroe = {
                id: key,
                ...heroesObj[key]
            }
            // console.log(heroe);

            heroesArray.push(heroe)
        })


        return heroesArray;
    }


    getHeroeByID(idHeroe:string){
        return this.httpClient.get(`${this.urlFirebase}/heroes/${idHeroe}.json`)
            .pipe(
                map( (resp:any) => {
                    // console.log(resp)

                    let heroe = new HeroeModel();

                    if( resp ){
                        
                        heroe = {
                            id: idHeroe,
                            ...resp
                        }
                        
                    }
                    // console.log(heroe);
                    return heroe;
                })
            )
    }


    deleteHeroe(idHeroe:string){

        return this.httpClient.delete(`${this.urlFirebase}/heroes/${idHeroe}.json`)

    }

    deleteConfirm( heroe:HeroeModel){
        return Swal.fire({
            title: heroe.name,
            text: `Are you sure to delete this heroe ?`,
            icon: 'question',
            showConfirmButton: true,
            showCancelButton: true
        })
    }

}
