import { Component, OnInit } from '@angular/core';
import { HomeService } from '../../services/home.service';
import { Response } from 'selenium-webdriver/http';
import { ForgotPasswordModel } from '@app/core/models/forgot.email';
import { HttpHeaders } from '@angular/common/http';
import { MessageService } from '@app/core/services';

@Component({
  selector: 'app-forgotpswd',
  templateUrl: './forgotpswd.component.html',
  styleUrls: ['./forgotpswd.component.scss']
})
export class ForgotpswdComponent implements OnInit {
  loading: boolean = false;
  messageObject: any;

  showEmailForm: boolean = true;
  showCodeForm: boolean = false;
  showChangePasswordForm: boolean = false;
  successPage: boolean = false;

  forgotPasswordModel: ForgotPasswordModel = {
    email: null,
    resetToken: null,
    password: null,
    cpassword: null
  };

  constructor(private homeservice: HomeService, private messageService: MessageService) { }

  ngOnInit() {
  }

  sendForgotPasswordEmail() {
    this.loading = true;
    this.homeservice.sendForgotPasswordEmail(this.forgotPasswordModel).subscribe(response => {
      // this.showMessage(response.Message, 'success');
      this.showEmailForm = false;
      this.showCodeForm = true;
      this.loading = false;
    }, error => {
      console.log(error);
      this.showMessage(error, 'error');
      this.loading = false;


    })
  }
  verifyCode() {
    this.loading = true;
    this.homeservice.verifyConfirmationCode(this.forgotPasswordModel).subscribe(response => {
      this.showMessage(response.Message, 'success');
      this.showChangePasswordForm = true;
      this.showCodeForm = false;
      this.showEmailForm = false;
      this.loading = false;

    }, error => {
      console.log(error);
      this.showMessage(error, 'error');
      this.loading = false;


    })
  }
  resetPassword() {
    this.loading = true;
    this.successPage = true;
    this.homeservice.resetPassword(this.forgotPasswordModel).subscribe(response => {
      this.showMessage(response.Message, 'success');
      this.showChangePasswordForm = false;
      this.showCodeForm = false;
      this.showEmailForm = false;
      this.loading = false;


    }, error => {
      console.log(error);
      this.showMessage(error, 'error');
      this.loading = false;


    })

  }

  showMessage(message, type) {
    if (type == 'error') {
      this.messageObject = this.messageService.sendLoginErrorMessageObject(message);
    } else {
      this.messageObject = this.messageService.sendLoginSuccessMessageObject(message);
    }

    // setTimeout(() => {
    //   this.messageObject = null;
    // }, 4000)
  }



}
