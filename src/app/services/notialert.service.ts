import { Injectable } from '@angular/core';

import Swal from 'sweetalert2';
import { ToastrService } from 'ngx-toastr';

//Servicio de Notifications y Alerts
@Injectable({
  providedIn: 'root'
})
export class NotialertService {

    constructor(
        private toastr: ToastrService
    ) { 

    }

    swal_fire(){

        Swal.fire({
            title: '',
            text: `Are you sure to delete this heroe ?`,
            icon: 'question',
            showConfirmButton: true,
            showCancelButton: true
        })

    }

    showToaster(){
        this.toastr.success("success !!", "Notification");
        this.toastr.warning("warning !!", "Notification");
        this.toastr.error("error !!", "Notification");
    }

    showToasterCustom(){

        const title = 'NOTIFICATIONSX';
    
          const message = /*html*/`
          <div class="card" style="width: 18rem;">
          <img class="img-thumbnail" src="assets/img/marvels-vs-dc.jpg" alt="Card image cap" width="100px">
          <div class="card-body">
              <p class="card-text text-danger">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
          </div>
      </div>
          `;
    
          //https://www.npmjs.com/package/ngx-toastr
          const config = {
              enableHtml: true,
              progressBar: true,
              closeButton: true
          }
    
          this.toastr.info(message,title,config);
    }

    
}
