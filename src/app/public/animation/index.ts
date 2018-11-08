import {trigger, state, animate, style, transition} from '@angular/animations';

export const opacityAni = trigger('opacityAni', [
    state('void', style({opacity: '0'})),
    state('*', style({opacity: '1'})),
    transition(':enter', [
        animate('.45s', style({opacity: '1'})),
    ])
]);
