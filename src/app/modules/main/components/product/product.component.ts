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
            if ($('#product-s').is(':visible')) {
                const pageTop = $(window).scrollTop();
                const pageBottom = pageTop + $(window).height();
                const prodSingleTop = $('#product-s').offset().top;
                const prodSingleBottom = prodSingleTop + $('#product-s').height();
                // console.log(`${pageTop}, ${pageBottom}; ${prodSingleTop}, ${prodSingleBottom};`);
                if ((pageTop > prodSingleBottom) || (pageBottom < prodSingleTop)) {
                    $('#product-s').hide();
                    $('#product').show();
                }
            }
        }
    }

    clickProdItem(i: number): void {
        $('#product-s').show();
        $('#product').hide();
        if ($('#product-s').is(':visible')) {
            window.scrollTo(0, $('#product-s').offset().top);
        }
    }

    clickProdSingleItem(i: number): void {

    }
}
