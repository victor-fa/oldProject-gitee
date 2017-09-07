import { Component, AfterViewInit } from '@angular/core';

@Component({
    selector: 'app-product',
    templateUrl: './product.component.html',
    styleUrls: ['./product.component.scss']
})
export class ProductComponent implements AfterViewInit {
    nowIndex = 0;
    constructor() { }

    ngAfterViewInit() {

        window.onscroll = function (e) {
            console.log("Rolling.....");

            if ($('#product-s').is(':visible')) {
                var pageTop = $(window).scrollTop();
                var pageBottom = pageTop + $(window).height();
                var prodSingleTop = $('#product-s').offset().top;
                var prodSingleBottom = prodSingleTop + $('#product-s').height();
                console.log(`${pageTop}, ${pageBottom}; ${prodSingleTop}, ${prodSingleBottom};`);
                if ((pageTop > prodSingleBottom) || (pageBottom < prodSingleTop)) {
                    console.log('out view');
                    $('#product-s').hide();
                    $('#product').show();
                } else {
                    console.log('in view');
                }
            }
        }
    }

    clickProdItem(i: number): void {
        $('#product-s').show();
        $('#product').hide();
        if ($('#product-s').is(':visible')) {
            console.log('is visable');
            window.scrollTo(0, $('#product-s').offset().top);
        } else {
            console.log('is not visialbe');
        }
    }
}
