import { Component, Input, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { HeroeModel } from 'src/app/models/heroe.model';
import { HeroesService } from 'src/app/services/heroes.service';

import Swal from 'sweetalert2';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-heroe',
  templateUrl: './heroe.component.html',
//   styleUrls: ['./heroe.component.css']
styles:[]
})
export class HeroeComponent implements OnInit {

    heroe = new HeroeModel();
    last = new HeroeModel();
    loading = false;
    starting = false;

    constructor(
        private heroesService:HeroesService,
        private activatedRoute:ActivatedRoute,
        private router:Router,
        private toastr: ToastrService
    ) { 

        this.initPage();

    }

    ngOnInit(): void {
    }

    clean(){
        this.heroe = new HeroeModel();
        this.last = new HeroeModel();
        this.router.navigateByUrl('/heroe/new');
    }

    initPage() {

        this.starting = true;
        
        const idParam = this.activatedRoute.snapshot.paramMap.get('id');

        if( idParam !== 'new'){
            
            this.heroesService.getHeroeByID( idParam )
                .subscribe( resp => {
                    // console.log(resp)
                    this.starting = false;

                    if( resp.id ){
                        
                        this.heroe = resp;
                        this.last = {
                            ...this.heroe
                        }

                    }else{

                        this.toastr.warning(
                            `heroe with id ${ idParam } cannot be found`, 
                            "Notification",
                            {
                                // progressBar: true,
                                timeOut: 0,
                                closeButton: true,
                                extendedTimeOut: 300,
                                // positionClass: 'toast-bottom-left'
                                positionClass: 'toast-bottom-full-width'
                            }
                        );

                        // Swal.fire({
                        //     title: 'alert',
                        //     text: `heroe with id ${ idParam } cannot be found`,
                        //     icon:'warning',
                        //     allowOutsideClick: false
                        // });

                        this.router.navigateByUrl('/');
                    }

                } )

        }else{
            this.starting = false;
        }

    }

    hasModifications(){
        return this.last.id !== this.heroe.id
            || this.last.name !== this.heroe.name
            || this.last.power !== this.heroe.power
            || this.last.state !== this.heroe.state;
    }

    sendForm(form : NgForm){

        // form.valueChanges.subscribe( value => console.log(value));
        // console.log(form.controls['state']);
        // console.log(`dirty: ${form.dirty} - pristine: ${form.pristine}`);
        // console.log(this.heroe);

        // console.log('this.heroe',this.heroe)
        // console.log('this.last',this.last)

        if(form.invalid){

            // console.log('form invalid')
            return;

        }else if( ! this.hasModifications() ){

            // console.log('no modifications')
            return;

        }else{

            // console.log('create or update data')
            this.loading = true;

            let messaje:string;
            if(this.heroe.id){
                messaje = 'updated'
            }else{
                messaje = 'created'
            }

            // Swal.fire({
            //     title: 'wait',
            //     text: 'sending data...',
            //     icon:'info',
            //     allowOutsideClick: false
            // });
            // Swal.showLoading();

            this.heroesService.createUpdateHeroe(this.heroe)
            .subscribe( resp => {

                // console.log(resp);

                //esto no es necesario xq como el objeto heroe es pasado por referencia
                //cuando pase por el pipe se le cargara el id al mismo objeto que tenemos en este component
                // this.heroe = resp; 
                this.loading = false;

                this.last = {
                    ...this.heroe
                }
                
                // Swal.fire({
                //     title: this.heroe.name,
                //     text: `${messaje} successfully`,
                //     icon:'success'
                // });

                // this.toastr.success(
                //     `heroe ${ this.heroe.name } has been ${ messaje }`, 
                //     "Notification",
                //     {
                //         // progressBar: true,
                //         // timeOut: 0,
                //         closeButton: true,
                //         extendedTimeOut: 300,
                //         // positionClass: 'toast-bottom-left'
                //         // positionClass: 'toast-bottom-full-width'
                //         positionClass: 'toast-bottom-right'
                //     }
                // );

                if(messaje==='created'){
                    this.toastr.success(
                        `heroe ${ this.heroe.name } has been created`, 
                        "Notification",
                        {
                            // progressBar: true,
                            // timeOut: 0,
                            closeButton: true,
                            extendedTimeOut: 300,
                            // positionClass: 'toast-bottom-left'
                            // positionClass: 'toast-bottom-full-width'
                            positionClass: 'toast-bottom-right'
                        }
                    );
                }
                else if(messaje==='updated'){
                    this.toastr.warning(
                        `heroe ${ this.heroe.name } has been updated`, 
                        "Notification",
                        {
                            // progressBar: true,
                            // timeOut: 0,
                            closeButton: true,
                            extendedTimeOut: 300,
                            // positionClass: 'toast-bottom-left'
                            // positionClass: 'toast-bottom-full-width'
                            positionClass: 'toast-bottom-right'
                        }
                    );
                }

            });

            /*
            //otra forma piola:
            let request : Observable<any>
            if(this.heroe.id){
                request = this.heroesService.updateHeroe(this.heroe);
            }else{
                request = this.heroesService.createHeroe(this.heroe);
            }
            request.subscribe( resp => {
                console.log(resp)
                this.loading = false;
            })
            */

        }

    }

    deleting:boolean;
    deleteHeroe( heroe:HeroeModel ){

        this.heroesService.deleteConfirm(heroe)
            .then( resp => {

                if(resp.value){
                    this.deleting = true;

                    this.heroesService.deleteHeroe(heroe.id)
                        .subscribe( resp => {
                            // console.log(resp)

                            // this.router.navigateByUrl('/heroes')
                            this.clean();
                            this.deleting = false;

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

                }
            });
    }


}
