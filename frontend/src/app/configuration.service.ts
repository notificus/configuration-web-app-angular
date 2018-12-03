import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ConfigurationService {
  uri = 'http://configuration-web-app-bff:4000';

  constructor(private http: HttpClient) { }

  login() {
    window.location.href = 'http://localhost:4000/login';
  }

  logout() {
    window.location.href = 'http://localhost:4000/logout';
  }

  getUser() {
    return this.http.get(this.uri + '/users/me', { withCredentials: true });
  }

  listUserConfigurations() {
    return this.http.get(this.uri + '/users/me/configurations', { withCredentials: true });
  }

  updateUserConfigurations(userConfiguration) {
    console.log(userConfiguration);
    return this.http.put(this.uri + '/users/me/configurations', userConfiguration, { withCredentials: true });
  }
}
