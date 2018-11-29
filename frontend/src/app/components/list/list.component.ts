import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl, Validators, FormGroup, FormBuilder, FormArray, FormGroupDirective } from '@angular/forms';

import { User } from '../../user.model';
import { Configuration } from '../../configuration.model';
import { ConfigurationService } from '../../configuration.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {
  private configuration: Configuration = {
    emailEnabled: false,
    emails: ['']
  }

  private user: User = {
    cip: '',
    firstName: '',
    lastName: ''
  }

  private emailConfigurationForm: FormGroup

  private isEditing = false
  
  constructor(private configurationService: ConfigurationService, private router: Router, private formBuilder: FormBuilder) {
    this.createEmailFormGroup();
  }

  ngOnInit() {
    this.isEditing = false;
    this.getUser();
    this.listUserConfiguration();
  }

  getUser() {
    this.configurationService.getUser().subscribe((data: User) => {
      this.user = data;
    })
  }

  listUserConfiguration() {
    this.configurationService.listUserConfigurations().subscribe((data: Configuration) => {
      this.configuration = data;
      this.emailConfigurationForm.get('enabled').setValue(this.configuration.emailEnabled);
      this.emailConfigurationForm.get('enabled').disable();
      this.configuration.emails.forEach(element => {
        this.emails.push(this.formBuilder.control({ value: element, disabled: true }, [Validators.email]))
      });
      console.log('Data requests...');
      console.log(this.configuration);
    })
  }

  createEmailFormGroup() {
    this.emailConfigurationForm = this.formBuilder.group({
      enabled: [{ value: this.configuration.emailEnabled, disabled: true}],
      emails: this.formBuilder.array([], [Validators.required, Validators.email])
    });
  }

  enableEditing() {
    this.emailConfigurationForm.controls.enabled.enable();
    (<FormArray>this.emailConfigurationForm.get('emails')).controls.forEach(control => {
      control.enable();
    })

    this.isEditing = true;
  }

  addNewEmail() {
    this.emails.push(this.formBuilder.control(''));
  }
  
  deleteEmail(index) {
    this.emails.removeAt(index);
  }

  cancelEditing() {
    this.ngOnInit();
  }

  save() {
    this.configuration.emailEnabled = this.emailConfigurationForm.get('enabled').value;
    this.configuration.emails = [];
    (<FormArray>this.emailConfigurationForm.get('emails')).controls.forEach(control => {
      this.configuration.emails.push(control.value);
    })

    this.configurationService.updateUserConfigurations(this.configuration).subscribe(() => {
      (<FormArray>this.emailConfigurationForm.get('emails')).controls = [];
      this.ngOnInit();
    });
  }

  logout() {
    this.configurationService.logout();
  }

  get emails() {
    return this.emailConfigurationForm.get('emails') as FormArray;
  }
}
