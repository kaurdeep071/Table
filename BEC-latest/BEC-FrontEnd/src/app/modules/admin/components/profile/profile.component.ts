import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, NgModel, NgForm } from "@angular/forms";
import { ValidatorService } from '@app/core/services/validator.service';
import { LocalStorageService } from "@app/core/services/local-storage.service";
import { ActivatedRoute } from "@angular/router";
import { SuccessMessages } from "@app/config/message.config";
import { MessageService } from '@app/core/services/message.service';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { ProfileService } from '../../services/profile.service';
import { DatePipe } from '@angular/common';
import { BaseUrl } from '../../../../config/urls.config';
// import { moment } from 'ngx-bootstrap/chronos/test/chain';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  providers: [DatePipe]
})
export class ProfileComponent implements OnInit {
  datePickerConfig: Partial<BsDatepickerConfig>;
  api = BaseUrl.apiUrl;
  ProfileForm: FormGroup;
  returnUrl: string;
  loading : boolean= false;

  profilePhoto: String;
  uploadedPhoto: any = {
    type: null,
    userProfilePhoto: null
  };

  formErrors = {
    FirstName: "",
    LastName: "",
    Position: "",
    Email: "",
    Dob: ""
  }

  changePasswordForm: any = {
    oldPassword: null,
    newPassword: null,
    confirmPassword: null
  };

  changePasswordValidationMessage = {
    oldPassword: {
      required: "Old Password is required"
    },
    newPassword: {
      required: "New Password is required",
      minlength: "Password must be atleast 8 characters"
    },
    confirmPassword: {
      required: "Confirm password is required",
      notEqual: "Password and Confirm Password are not same"
    }
  }
  letterOnly(event: any): Boolean {
    return this._validatorService.letterOnly(event);
  }
  // data = {
  //   "emailId": String,
  //   "firstName": String,
  //   "lastName": String,
  //   "designation": String,
  //   "userName": String,
  //   "dateOfBirth": String,
  //   "roleId": Number,
  //   "userId": Number
     

  // }
  pwddata = {
    "oldPassword": String,
    "newPassword": String
  }

  //Roles: any;

  validationMessage = {
    FirstName: {
      required: "FirstName is required"
    },
    LastName: {
      required: "LastName is required"
    },
    Email: {
      required: "Email is required",
      email: "Email is not valid"
    },
    Position: {
      required: "Position is required"
    },
    Dob: {
      required: "Date of Birth is required"
    }
  }

  LogValidationError(): void {
    this._validatorService.LogValidationService(
      this.ProfileForm,
      this.formErrors,
      this.validationMessage
    );
  }
 
  constructor(public datepipe: DatePipe, private _fb: FormBuilder, private _validatorService: ValidatorService,
    private _localStorageService: LocalStorageService,
    private _activatedRoute: ActivatedRoute, private _messageService: MessageService, private _profileService: ProfileService) {
    this.datePickerConfig = Object.assign({}, { containerClass: 'theme-dark-blue', dateInputFormat: 'MM/dd/YYYY' });
  }

  ngOnInit() {
    const data = this._localStorageService.getUserDetail();
    this.profilePhoto = this.api + data.UserProfilePhoto;
    let dob = this.datepipe.transform(data.DateOfBirth, 'MM-dd-yyyy')
    this.ProfileForm = this._fb.group({
      FirstName: [data.FirstName, [Validators.required,this._validatorService.noWhitespaceValidator]],
      LastName: [data.LastName, [Validators.required,this._validatorService.noWhitespaceValidator]],
      Position: [data.Position, [Validators.required]],
      Email: [data.EmailId, [Validators.required, Validators.email]],
      Dob: [dob == '01-01-0001' ? '' : dob, [Validators.required]],
      UserId: [data.UserId],
      UserName:[data.UserName]
    });


    this.returnUrl =
      this._activatedRoute.snapshot.queryParams["returnUrl"] || "/admin/managejobtype";
   // this.getRoles();
  }

  checkPasswords(group: FormGroup) {
    let pass = group.controls.NewPassword.value;
    let confirmPass = group.controls.ConfirmPassword.value;

    return pass === confirmPass ? null : { notMatched: true }
  }

  onSubmit() {
    if (this.ProfileForm.valid) {
      this.loading = true;
      this._profileService.updateProfile({firstName:this.ProfileForm.get('FirstName').value.trim(''),
      lastName:this.ProfileForm.get('LastName').value.trim(''),
      dateOfBirth: this.ProfileForm.get('Dob').value,
      emailId:this.ProfileForm.get('Email').value,
      position:this.ProfileForm.get('Position').value,
      userId:this.ProfileForm.get('UserId').value,
      isActive:true,
      username:this.ProfileForm.get('UserName').value}
        ).subscribe(
        response => {
          this.loading = false;
          this._localStorageService.storeUserDetail(response.data.userResponse)
          this._messageService.sendSuccessMessageObject(SuccessMessages.ProfileUpdated);
        },
        error => {
          this.loading = false;
          this._messageService.sendErrorMessageObject(error);
        })
    }
    else {
      this._validatorService.markAsTouched(this.ProfileForm);
      this._validatorService.LogValidationService(this.ProfileForm, this.formErrors, this.validationMessage);
    }
  }

  imgUpload($event) {

    var reader = new FileReader();
    const file = $event.target.files[0];
    reader.readAsDataURL(file);
    this.uploadedPhoto.type = file.type.split('/')[1];
    // if(typeof(this.uploadedPhoto.type))
    // {
    //   var data = file.name.split('.');
    //   this.uploadedPhoto.type = data[data.length - 1]
    // }
    var _self = this;
    reader.onload = function () {

      _self.uploadedPhoto.userProfilePhoto = String(reader.result).split(',')[1];
    };
  }

  uploadProfilePhoto() {
    // // ;
    this.loading = true;
    this._profileService.uploadProfilePhoto(this.uploadedPhoto).subscribe(
      response => {
        this.loading = false;
        this._messageService.sendSuccessMessageObject(response.Message);
        this._localStorageService.storeUserDetail(response.data.userResponse);
        this.profilePhoto = this.api + response.data.userResponse.UserProfilePhoto;
     
      },
      error => {
        this.loading = false;
        this._messageService.sendErrorMessageObject(error);
      }
    )
  }

  changePassword(form: NgForm) {
    this.loading = true;
    this._profileService.changePassword(this.changePasswordForm).subscribe(
      response => {
        this.loading = false;
        this._localStorageService.storeAuthToken(response.data.userResponse.token);
        this._messageService.sendSuccessMessageObject(SuccessMessages.ResetPassword);

        form.resetForm();

      },
      error => {
        this.loading = false;
        this._messageService.sendErrorMessageObject(error);
      }
    )
  }
  

  // getRoles() {
  //   let data = {
  //     allRecords: "true",
  //     orderBy: "RoleName",
  //     orderByDescending: "false"
  //   }
  //   this._profileService.getRoles(data).subscribe(
  //     response => {
  //       this.Roles = response.data.rolesMainResponse.rolesResponse
  //     })
  // }
}
