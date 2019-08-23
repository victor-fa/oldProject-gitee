export class EditorConfig {
  public width = '100%';
  public height = '800';
  public path = 'assets/editor.md/lib/';
  public codeFold: true;
  public theme = "dark";
  public previewTheme = "dark";
  public editorTheme = "pastel-on-dark";
  public searchReplace = true;
  public toolbar = true;
  public emoji = true;
  public taskList = true;
  public tex = true;
  public readOnly = false;
  public tocm = true;
  public watch = true;
  public previewCodeHighlight = true;
  public saveHTMLToTextarea = true;
  public markdown = '';
  public flowChart = true;
  public syncScrolling = true;
  public sequenceDiagram = true;
  public imageUpload = true;
  public imageFormats = ['jpg', 'jpeg', 'gif', 'png', 'bmp', 'webp'];
  public imageUploadURL = '';

  constructor() {
  }

  public onload() {
  }
  public onchange() {
  }
}
