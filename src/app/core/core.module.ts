import { HttpClientModule } from '@angular/common/http';
import { NgModule, Optional, SkipSelf } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import 'rxjs/add/observable/combineLatest';
import 'rxjs/add/observable/concat';
import 'rxjs/add/observable/empty';
import 'rxjs/add/observable/from';
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/observable/merge';
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/range';
import 'rxjs/add/observable/throw';
import 'rxjs/add/observable/zip';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/count';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/defaultIfEmpty';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mapTo';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/pluck';
import 'rxjs/add/operator/reduce';
import 'rxjs/add/operator/scan';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/take';
import 'rxjs/add/operator/takeWhile';
import 'rxjs/add/operator/withLatestFrom';
import { AppRoutingModule } from '../app.routing';
import { throwIfAlreadyLoaded } from './module-import-guard';


@NgModule({
    imports: [
        BrowserAnimationsModule,
        HttpClientModule,
        AppRoutingModule,
    ],
    declarations: [
    ],
    exports: [
        AppRoutingModule,
    ],
    providers: [
        {
            provide: 'APP_CONFIG',
            useValue: 'APP_CONFIG', // 临时
        },
    ]
})

// CoreModule只使用一次、辅助性等模块
export class CoreModule {
    // 防止CoreModule被多次调用，导致未知问题
    constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
        throwIfAlreadyLoaded(parentModule, 'CoreModule');
    }
}
