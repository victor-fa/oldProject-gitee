import { AfterViewInit, Component, ElementRef, EventEmitter, forwardRef, Input, NgZone, OnDestroy, Output, ViewChild } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { ClipboardService } from 'ngx-clipboard';
import { EditorConfig } from './EditorConfig';

declare var editormd: any;

const UEDITOR_VALUE_ACCESSOR = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => MarkdownComponent),
  multi: true
};

@Component({
  selector: 'qy-editor-md',
  templateUrl: './markdown.component.html',
  styleUrls: ['./markdown.component.scss'],
  providers: [UEDITOR_VALUE_ACCESSOR]
})
export class MarkdownComponent implements AfterViewInit, OnDestroy, ControlValueAccessor {

  @Input() editormdConfig: EditorConfig; // 配置选项
  @Output() onReady = new EventEmitter();
  @Output() onValueChange = new EventEmitter();
  @Output() onFocus = new EventEmitter();
  @Output() getHtmlValue = new EventEmitter();
  @ViewChild('host') host;
  @ViewChild('copyButton') copyButton: ElementRef;
  private mdeditor: any;
  private value: string;
  onChange: Function = () => { };
  onTouched: Function = () => { };
  finalContent = ``;
  constructor(
    private ngZone: NgZone,
    private _clipboardService: ClipboardService
  ) {}

  ngAfterViewInit(): void {
    this.init();
  }

  ngOnDestroy(): void {
    this.destroy();
  }

  writeValue(value: string): void {
    this.value = value;
    console.log('value', value);
    if (this.mdeditor) {
        this.mdeditor.setMarkdown(this.value);
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    if (isDisabled) {
      this.mdeditor.setDisabled();
    } else {
        this.mdeditor.setEnabled();
    }
  }

  init() {
    console.log(this.copyButton);
    if (typeof editormd === 'undefined') {
      console.error('UEditor is missing');
      return;
    }
    this.editormdConfig = this.editormdConfig != null ? this.editormdConfig : new EditorConfig();
    this.editormdConfig.onload = () => {
      if (this.value) {
        this.mdeditor.setMarkdown(this.value);
      }
    };
    this.editormdConfig.onchange = () => {
      this.updateValue(this.mdeditor.getMarkdown());
    };
    this.mdeditor = editormd(this.host.nativeElement.id, this.editormdConfig); // 创建编辑器

  }

  updateValue(value: string) {
    this.ngZone.run(() => {
        this.value = value;

        this.onChange(this.value);
        this.onTouched();

        this.onValueChange.emit(this.value);
        this.getHtmlValue.emit({ originalEvent: event, value: this.getHtmlContent() });
    });
  }

  destroy() {
    if (this.mdeditor) {
        this.mdeditor.removeListener('ready');
        this.mdeditor.removeListener('contentChange');
        this.mdeditor.editor.remove();
        this.mdeditor.destroy();
        this.mdeditor = null;
    }
  }

  // 获取md内容
  copyText(){
    this._clipboardService.copyFromContent(this.getMarkContent());
  }

  getMarkContent(): string {
    return this.mdeditor.getMarkdown();
  }

  getHtmlContent(): string {
    return this.mdeditor.getHTML();
  }
}
