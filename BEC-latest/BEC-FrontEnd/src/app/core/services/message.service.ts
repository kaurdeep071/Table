import { Injectable } from '@angular/core';
import { ToastrService, ToastrConfig, IndividualConfig } from 'ngx-toastr';  

@Injectable()
export class MessageService {

  constructor(private toastr: ToastrService) { }

  

  sendSuccessMessageObject(message) {

    //return {
      //class: "alert alert-success center",
      //message: message
    //};
    this.toastr.success(message,'Success',{
      positionClass: 'toast-bottom-right',
     // progressBar:true,
      closeButton: true      
    })
  }

  sendErrorMessageObject(message) {
    // return {
    //   class: "alert alert-danger",
    //   message: message
    // };
    this.toastr.error(message,'Error',{
      positionClass: 'toast-bottom-right',
     // progressBar:true,
      closeButton: true
    })

  }
  
  sendLoginSuccessMessageObject(message) {
    return {
      class: "alert alert-success center",
      message: message
    };
     
  }
  sendLoginErrorMessageObject(message) {
    return {
      class: "alert alert-danger",
      message: message
    };
     
  }

}
