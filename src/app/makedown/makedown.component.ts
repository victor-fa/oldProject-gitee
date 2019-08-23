import { Component, ViewChild, Input, AfterViewInit, ElementRef, NgZone, Output, EventEmitter, OnDestroy, forwardRef } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { EditorConfig } from './EditorConfig';

declare var editormd: any;

const UEDITOR_VALUE_ACCESSOR = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => MakedownComponent),
  multi: true
};

@Component({
  selector: 'qy-editor-md',
  templateUrl: './makedown.component.html',
  // templateUrl: `<div id="md" #host></div>`,
  styleUrls: ['./makedown.component.scss'],
  providers: [UEDITOR_VALUE_ACCESSOR]
})
export class MakedownComponent implements AfterViewInit, OnDestroy, ControlValueAccessor {

  @Input() editormdConfig: EditorConfig; // 配置选项
  @Output() onReady = new EventEmitter();
  @Output() onValueChange = new EventEmitter();
  @Output() onFocus = new EventEmitter();
  @Output() getHtmlValue = new EventEmitter();
  @ViewChild('host') host;
  private mdeditor: any;
  private value: string;
  onChange: Function = () => { };
  onTouched: Function = () => { };
  constructor(
    private el: ElementRef,
    private ngZone: NgZone
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

  // getMarkContent(): string {
  //   return this.mdeditor.getMarkdown();
  // }

  getHtmlContent(): string {
    console.log('this.mdeditor.getHTML() 1', this.mdeditor.getHTML());
    return this.mdeditor.getHTML();
  }
}
