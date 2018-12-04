import { Component, OnInit } from '@angular/core';
import { LocalizationService } from '../public/service/localization.service';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-preview',
  templateUrl: './preview.component.html',
  styleUrls: ['./preview.component.scss']
})
export class PreviewComponent implements OnInit {

  content;
  constructor(
    public localizationService: LocalizationService,
    private sanitize: DomSanitizer,
  ) {
  }

  ngOnInit() {
    this.content = this.sanitize.bypassSecurityTrustHtml(this.localizationService.getPreview);
  }

}
