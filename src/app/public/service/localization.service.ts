import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable()
export class LocalizationService {
  static appLanguage: any;
  public languageText;
  public languageStatus;
  constructor(
    private httpClient: HttpClient,
  ) { }

  set setPreview(langText) {
    localStorage.setItem('preview', langText);
  }

  get getPreview(): string {
    return localStorage.getItem('preview');
  }

}
