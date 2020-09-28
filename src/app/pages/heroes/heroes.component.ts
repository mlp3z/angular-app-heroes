import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { HeroeModel } from 'src/app/models/heroe.model';
import { HeroesService } from 'src/app/services/heroes.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-heroes',
  templateUrl: './heroes.component.html',
//   styleUrls: ['./heroes.component.css']
styles:[]
})
export class HeroesComponent implements OnInit {

    listHeroes:HeroeModel[];
    loading:boolean;

    constructor(
        private heroesService: HeroesService,
        private toastr: ToastrService
    ) { 

    }

    ngOnInit(): void {

        this.loadHeroes();
        
        // this.loading = true;
        // setTimeout(() => {
        //     this.loadHeroes();
        // }, 2000);

    }

    loadHeroes(){
        this.loading = true;

        this.heroesService.getHeroes()
            .subscribe( resp => {
                // console.log(resp)
                this.listHeroes = resp;
                this.loading = false;
            });
    }

    /*
    deleteHeroe( heroe:HeroeModel , inndexLocal:number ){

        Swal.fire({
            title: heroe.name,
            text: `Are you sure to delete this heroe ?`,
            icon: 'question',
            showConfirmButton: true,
            showCancelButton: true
        }).then( resp => {

            if(resp.value){

                this.heroesService.deleteHeroe(heroe.id)
                    .subscribe( resp => {
                        // console.log(resp)
                    })
    
                this.listHeroes.splice(inndexLocal,1);
            }

        });
    }
    */
   deleteHeroe( heroe:HeroeModel , inndexLocal:number ){

        this.heroesService.deleteConfirm(heroe)
            .then( resp => {

                if(resp.value){
                    
                    this.heroesService.deleteHeroe(heroe.id)
                        .subscribe( resp => {
                            // console.log(resp)
                            this.toastr.error(
                                `heroe ${ heroe.name } has been deleted`, 
                                "Notification",
                                {
                                    // progressBar: true,
                                    // timeOut: 0,
                                    closeButton: true,
                                    extendedTimeOut: 300,
                                    positionClass: 'toast-bottom-left'
                                    // positionClass: 'toast-bottom-full-width'
                                    // positionClass: 'toast-bottom-right'
                                }
                            );
                        });
                    this.listHeroes.splice(inndexLocal,1);

                }
            });
    }



}
