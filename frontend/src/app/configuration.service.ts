import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ConfigurationService {
  uri = environment.backendUrl;

  constructor(private http: HttpClient) { }

  login() {
    window.location.href = this.uri + '/login';
  }

  logout() {
    window.location.href = this.uri + '/logout';
  }

  getUser() {
    return this.http.get(this.uri + '/users/me', { withCredentials: true });
  }

  listUserConfigurations() {
    return this.http.get(this.uri + '/users/me/configurations', { withCredentials: true });
  }

  updateUserConfigurations(userConfiguration) {
    return this.http.put(this.uri + '/users/me/configurations', userConfiguration, { withCredentials: true });
  }
}
