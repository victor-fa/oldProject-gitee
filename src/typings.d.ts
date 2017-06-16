/* SystemJS module definition */
declare var module: NodeModule;
interface NodeModule {
  id: string;
}

/// <reference path="../typings/jquery.d.ts" />

interface JQuery {
  chosen(options?: any): JQuery;
}    

declare var jQuery: JQueryStatic;
declare var $: JQueryStatic;
