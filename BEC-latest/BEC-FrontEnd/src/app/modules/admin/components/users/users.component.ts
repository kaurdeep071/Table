import { Component, OnInit, Renderer2 } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl, FormArray } from "@angular/forms";

import { PaginationSize } from "@app/config/message.config";
import { PagerService } from '../../services/pager.service';
import { ValidatorService } from '@app/core/services/validator.service';
import { ProfileService } from '../../services/profile.service';
import { UserService } from '../../services/user.service';
import { MessageService } from '@app/core/services/message.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
  providers: [DatePipe]
})
export class UsersComponent implements OnInit {

  userForm: FormGroup;
  roleError: boolean = false;
  loading: boolean = false;
  roleFormArray: any;
  roles = [];
  userList: any;
  today = new Date();

  formErrors = {
    UserName: "",
    Password: "",
    FirstName: "",
    Email: "",
    Role: "",
    Position: ""
  }

  pager: any = {};
  public allItems: any;
  pageNumber: Number = 1
  sortingBy: string = 'CreatedOn';
  orderByDescending: boolean = true
  pagedItems: any

  pagerData = {
    Page: Number,
    Limit: Number,
    OrderBy: Boolean,
    OrderByDescending: Number
  }

  public searchText: string;
  emailPattern = "^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$";
  validationMessage = {
    UserName: {
      required: "User Name is required"
    },
    Password: {
      required: "Password is required",
      minlength: "Password must be atleast 8 characters"
    },
    FirstName: {
      required: "First Name is required"
    },
    Email: {
      required: "Email Id is required",
      email: "Email is Invalid",
    },
    Role: {
      required: "Role is required"
    },
    Position: {
      required: "Position is required"
    }
  }
  rolesForm: FormGroup;

  LogValidationError(): void {
    this._validatorService.LogValidationService(
      this.userForm,
      this.formErrors,
      this.validationMessage
    );
  }
  constructor(private _fb: FormBuilder, private _validatorService: ValidatorService, private _profileService: ProfileService,
    private renderer: Renderer2,
    private _userService: UserService, private _messageService: MessageService, private _pagerService: PagerService,
    public datepipe: DatePipe) { }

  ngOnInit() {
    this.userForm = this._fb.group({
      UserName: ["", Validators.required],
      Password: ["", [Validators.required, Validators.minLength(8)]],
      FirstName: ["", [Validators.required]],
      LastName: [""],
      Email: ["", [Validators.required, Validators.email, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$')]],

      Dob: [""],
      roles: new FormArray([]),
      roleIds: [],
      IsActive: [true],
      UserId: [""],
      EmailId: [""],
      Position: ["", [Validators.required]],
      UserType: ["", [Validators.required]]
    });

    this.getRoles();
    this.bindData(this.pageNumber, PaginationSize.PageSize, this.sortingBy, this.orderByDescending);
  }


  getRoles() {
    let data = {
      allRecords: "true",
      orderBy: "RoleName",
      orderByDescending: "false"
    }
    this.loading = true;
    this._profileService.getRoles(data).subscribe(
      response => {
        this.loading = false;
        this.roles = response.data.rolesMainResponse.rolesResponse
        this.addCheckboxes();
      },
      error => {
        this.loading = false;
        this._messageService.sendErrorMessageObject(error);
      })

  }
  addCheckboxes() {
    this.roles.forEach(element => {
      let control: FormControl = new FormControl(null);
      this.userForm.addControl(`role_${element.RoleId}`, control);
    });
  }

  uncheck() {
    this.roles.forEach(element => {
      const control = <FormControl>this.userForm.controls[`role_${element.RoleId}`];
      if (control != undefined) {
        control.setValue(false);
      }
    });

  }

  bindData(pageNumber, pageSize, sortingBy, orderByDescending) {
    this.pagerData.Page = pageNumber;
    this.pagerData.OrderBy = sortingBy;
    this.pagerData.Limit = pageSize;
    this.pagerData.OrderByDescending = orderByDescending
    this._userService.getUserList(this.pagerData).subscribe(response => {
      // ;
      this.userList = response.data.usersMainResponse.userWithRolesResponse;
      this.allItems = response.data.usersMainResponse.totalRecords;
      this.setPage(pageNumber);
    })
  }

  setPage(page: number) {
    if (page < 1 || page > this.pager.totalPages) {
      return;
    }
    this.pager = this._pagerService.getPager(this.allItems, page);
  }

  Sorting(ColumnName: string) {

    if (this.orderByDescending)
      this.orderByDescending = false
    else
      this.orderByDescending = true
    this.sortingBy = ColumnName;
    this.bindData(this.pageNumber, PaginationSize.PageSize, this.sortingBy, this.orderByDescending)
  }

  getPage(pageNumber: any) {
    this.pageNumber = pageNumber;
    this.bindData(this.pageNumber, PaginationSize.PageSize, this.sortingBy, this.orderByDescending)
  }

  deleteUser(UserId: string) {
    const confirmation = confirm("Do you want to delete user ?");
    if (confirmation) {
      this.loading = true;
      this._userService.deleteUser({ userId: UserId }).subscribe(
        response => {
          this.loading = false;
          this._messageService.sendSuccessMessageObject(response.Message);
          this.bindData(this.pageNumber, PaginationSize.PageSize, this.sortingBy, this.orderByDescending)
          this.onCancel();
        },
        error => {
          this.loading = false;
          this._messageService.sendErrorMessageObject(error);
        }
      )
    }
  }
  onSubmit() {
    
    this.validateRole();
    if (this.userForm.valid && this.roleFormArray.value.length > 0) {
      this.userForm.value.roleIds = "";
      // ;
      this.userForm.value.EmailId = this.userForm.get("Email").value
      ;
      this.loading = true;
      this._userService.registerUser({
        username: this.userForm.get('UserName').value,
        firstName: this.userForm.get('FirstName').value,
        password: this.userForm.get('Password').value,
        lastName: this.userForm.get('LastName').value,
        emailId: this.userForm.get("Email").value,
        dateOfBirth: this.userForm.get('Dob').value == "" ? null : this.userForm.get('Dob').value,
        roleIds: this.roleFormArray.value,
        isActive: this.userForm.get('IsActive').value,
        position: this.userForm.get('Position').value,
        userType: this.userForm.get('UserType').value,
        userId: this.userForm.get('UserId').value
      }).subscribe(
        response => {
          console.log(response);
          this.loading = false;
          this._messageService.sendSuccessMessageObject(response.Message);
          this.bindData(this.pageNumber, PaginationSize.PageSize, this.sortingBy, this.orderByDescending)
          this.onCancel();
        },
        error => {
          this.loading = false;
          this._messageService.sendErrorMessageObject(error);
        }
      )
    }

    else {
      this._validatorService.markAsTouched(this.userForm);
      this._validatorService.LogValidationService(this.userForm, this.formErrors, this.validationMessage);
    }
  }

  validateRole() {

    if (this.roleFormArray === undefined)
      this.roleError = true
  }

  bindUseDetails(user: any) {
    document.getElementById('targetid').scrollIntoView({behavior: 'smooth'});
    this.roleFormArray = null
    let dob = this.datepipe.transform(user.DateOfBirth, 'MM-dd-yyyy');
    this.userForm.patchValue({
      UserName: user.UserName,
      FirstName: user.FirstName,
      Password: "",
      LastName: user.LastName,
      Email: user.EmailId,
      Dob: dob == '01-01-0001' ? '' : dob,
      IsActive: user.IsActive,
      UserType: user.UserTypeId == undefined ? null : user.UserTypeId,
      Position: user.PositionId,
      UserId: user.UserId
      // roles: new FormArray([]),
    });
    this.addCheckboxes();
    // ;
    for (let roleid of user.RolesIds) {
      this.roleFormArray = <FormArray>this.userForm.controls.roles;
      this.roleFormArray.push(new FormControl(roleid));
      const control = <FormControl>this.userForm.controls[`role_${roleid}`]
      if (control != undefined) {
        control.setValue(true);
      }
    }
    this.userForm.controls['Password'].disable();
    // this.userForm = this._fb.group({
    //   UserName: [user.UserName, Validators.required],
    //   FirstName: [user.FirstName, Validators.required],
    //   Password: [""],
    //   LastName: [user.LastName],
    //   Email: [user.EmailId, [Validators.required, Validators.email]],
    //   Dob: [dob == '01-01-0001' ? '' : dob],
    //   IsActive: [user.IsActive],
    //   UserType:[user.UserTypeId],
    //   Position:[user.PositionId, Validators.required],
    //   UserId: [user.UserId],
    //   roles: new FormArray([]),
    // })


  }

  updateUserStatus(UserId: string, Status: boolean) {
    let data = {
      userId: UserId,
      IsActive: Status === false ? true : false
    }
    this.loading = true;
    this._userService.updateUserStatus(data).subscribe(
      response => {
        this.loading = false;
        this._messageService.sendSuccessMessageObject(response.Message);
        this.bindData(this.pageNumber, PaginationSize.PageSize, this.sortingBy, this.orderByDescending);
        this.onCancel();
      },
      error => {
        this.loading = false;
        this._messageService.sendErrorMessageObject(error);
      }
    )
  }

  onCancel() {
    // ;
    this._validatorService.markAsUntouched(this.userForm);
    this._validatorService.LogValidationService(this.userForm, this.formErrors, this.validationMessage);
    this.userForm.controls['Password'].enable();
    this.roleError = false;
    //this.roleFormArray.value = null;
    this.roleFormArray = null;


    this.userForm.patchValue({

      UserType: [""],
      Position: [""]


    })
    this.userForm.reset({
      IsActive: true
    })

    this.uncheck();
  }

  onChange(roleId: string, isChecked: boolean) {
    this.roleFormArray = <FormArray>this.userForm.controls.roles;
    if (isChecked) {
      this.roleError = false;
      this.roleFormArray.push(new FormControl(roleId));
      console.log(this.roleFormArray.value)
    } else {
      let index = this.roleFormArray.controls.findIndex(x => x.value == roleId);
      this.roleFormArray.removeAt(index)
      console.log(this.roleFormArray.value)

    }
  }

}
