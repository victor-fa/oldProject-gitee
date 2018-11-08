import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable()
export class LocalizationService {
  static appLanguage: any;
  public languageText;
  public languageStatus;
  constructor(
    private httpClient: HttpClient,
  ) { }

  set setLocalization(langText: string) {
    localStorage.setItem('Localization', langText);
  }

  get getLocalization(): string {
    return localStorage.getItem('Localization');
  }

  set setUserName(langText: string) {
    localStorage.setItem('userName', langText);
  }

  get getUserName(): string {
    return localStorage.getItem('userName');
  }

  set setUid(langText: string) {
    localStorage.setItem('uid', langText);
  }

  get getUid(): string {
    return localStorage.getItem('uid');
  }

  set setCompany(langText: string) {
    localStorage.setItem('company', langText);
  }

  get getCompany(): string {
    return localStorage.getItem('company');
  }

  set setPermission(langText: string) {
    localStorage.setItem('permission', langText);
  }

  get getPermission(): string {
    return localStorage.getItem('permission');
  }

}
