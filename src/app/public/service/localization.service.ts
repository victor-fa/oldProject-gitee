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

  set setPreview(langText) {
    localStorage.setItem('preview', langText);
  }

  get getPreview(): string {
    return localStorage.getItem('preview');
  }

}
