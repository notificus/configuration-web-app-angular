import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ConfigurationService {
  uri = 'http://localhost:4000';

  constructor(private http: HttpClient) { }

  login() {
    window.location.href = this.uri + '/login';
  }

  logout() {
    window.location.href = this.uri + '/logout';
  }

  getUser() {
    return this.http.get(this.uri + '/users/me');
  }

  listUserConfigurations() {
    return this.http.get(this.uri + '/users/me/configurations', { withCredentials: true });
  }

  updateUserConfigurations(userConfiguration) {
    console.log(userConfiguration);
    return this.http.put(this.uri + '/users/me/configurations', userConfiguration, { withCredentials: true });
  }
}
