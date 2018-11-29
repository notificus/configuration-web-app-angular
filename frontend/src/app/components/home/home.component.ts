import { Component, OnInit } from '@angular/core';
import { ConfigurationService } from '../../configuration.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(private configurationService: ConfigurationService) { }

  ngOnInit() {
  }

  login() {
    this.configurationService.login();
  }

}
