import { Inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AppConfig } from '../model/app.config.model';

@Injectable()
export class CookiesService {
  domain: String = 'localhost';
  appPath: '/';
  tokenCookieName = 'TOKEN';
  constructor(
    @Inject('APP_CONFIG') private appconfig: AppConfig,
    private router: Router,
  ) {
  }
  /**
   * Sets a cookie value for given key.
   * This is a simple implementation created to be used by ABP.
   * Please use a complete cookie library if you need.
   * @param {string} key
   * @param {string} value
   * @param {Date} expireDate (optional). If not specified the cookie will expire at the end of session.
   * @param {string} path (optional)
   */
  setCookieValue(key: string, value: string, expireDate?: Date, path?: string): void {
    let cookieValue = encodeURIComponent(key) + '=';
    if (value) {
      console.log('4:' + value);
      cookieValue = cookieValue + encodeURIComponent(value);
    }
    if (expireDate) {
      console.log('5:' + cookieValue);
      cookieValue = cookieValue + '; expires=' + expireDate.toUTCString();
    }
    if (path) {
      console.log('6:' + cookieValue);
      cookieValue = cookieValue + '; path=' + path;
    }
    cookieValue = cookieValue + '; domain=' + this.domain;
    document.cookie = cookieValue;
    console.log('7:' + cookieValue);
  }

  /**
   * Gets a cookie with given key.
   * This is a simple implementation created to be used by ABP.
   * Please use a complete cookie library if you need.
   * @param {string} key
   * @returns {string} Cookie value or null
   */
  getCookieValue(key: string): string {
    console.log('2:' + key);
    const equalities = document.cookie.split('; ');
    for (let i = 0; i < equalities.length; i++) {
      if (!equalities[i]) {
        continue;
      }

      const splitted = equalities[i].split('=');
      if (splitted.length !== 2) {
        continue;
      }

      if (decodeURIComponent(splitted[0]) === key) {
        console.log('3:' + decodeURIComponent(splitted[1] || ''));
        return decodeURIComponent(splitted[1] || '');
      }
    }

    return null;
  }

  /**
  * Deletes cookie for given key.
  * This is a simple implementation created to be used by ABP.
  * Please use a complete cookie library if you need.
  * @param {string} key
  * @param {string} path (optional)
  */
  deleteCookie(key: string, path?: string): void {
    let cookieValue = encodeURIComponent(key) + '=';

    cookieValue = cookieValue + '; expires=' + (new Date(new Date().getTime() - 86400000)).toUTCString();

    if (path) {
      cookieValue = cookieValue + '; path=' + path;
    }

    cookieValue = cookieValue + '; domain=' + this.domain;

    document.cookie = cookieValue;
  }

  // 设置cookie
  setToken(authToken: string) {
    const date = new Date();
    date.setTime(date.getTime() + 24 * 60 * 60 * 1000);
    this.setCookieValue(this.tokenCookieName, authToken, date, '/');
  }

  getToken(): string {
    console.log('1:' + this.getCookieValue(this.tokenCookieName));
    return this.getCookieValue(this.tokenCookieName);
  }

  // 清空cookie
  clearToken(): void {
    this.setToken(undefined);
    setTimeout(() => {
      this.router.navigateByUrl('login') ;
    }, 0);
  }
}
