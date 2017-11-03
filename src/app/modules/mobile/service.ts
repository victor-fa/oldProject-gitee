import {
    ComponentFactoryResolver,
    Injectable,
    Inject,
    ReflectiveInjector,
    ViewContainerRef
} from '@angular/core'

import { AboutMComponent } from './components/about-m/about-m.component';
import { PartnerMComponent } from './components/partner-m/partner-m.component';
import { ContactMComponent } from './components/contact-m/contact-m.component';
import { CareerMComponent } from './components/career-m/career-m.component';
import { TechMComponent } from './components/tech-m/tech-m.component';
import { ProductMComponent } from './components/product-m/product-m.component';

@Injectable()
export class Service {
    rootViewContainer: ViewContainerRef;
    constructor(private factoryResolver: ComponentFactoryResolver) { }

    public setRootViewContainerRef(viewContainerRef) {
        this.rootViewContainer = viewContainerRef
    }

    public addDynamicComponent(cp: string) {
        switch (cp) {
            case 'prod': {
                const factory = this.factoryResolver.resolveComponentFactory(ProductMComponent)
                const component = factory.create(this.rootViewContainer.parentInjector)
                console.log(`load component: ${cp}`);
                this.rootViewContainer.insert(component.hostView)
                break;
            }
            case 'partner': {
                const factory = this.factoryResolver.resolveComponentFactory(PartnerMComponent)
                const component = factory.create(this.rootViewContainer.parentInjector)
                console.log(`load component: ${cp}`);
                this.rootViewContainer.insert(component.hostView)
                break;
            }
            case 'about': {
                const factory = this.factoryResolver.resolveComponentFactory(AboutMComponent)
                const component = factory.create(this.rootViewContainer.parentInjector)
                console.log(`load component: ${cp}`);
                this.rootViewContainer.insert(component.hostView)
                break;
            }
            case 'career': {
                const factory = this.factoryResolver.resolveComponentFactory(CareerMComponent)
                const component = factory.create(this.rootViewContainer.parentInjector)
                console.log(`load component: ${cp}`);
                this.rootViewContainer.insert(component.hostView)
                break;
            }
            case 'contact': {
                const factory = this.factoryResolver.resolveComponentFactory(ContactMComponent)
                const component = factory.create(this.rootViewContainer.parentInjector)
                console.log(`load component: ${cp}`);
                this.rootViewContainer.insert(component.hostView)
                break;
            }
            case 'tech': {
            }
            default: {
                const factory = this.factoryResolver.resolveComponentFactory(TechMComponent)
                const component = factory.create(this.rootViewContainer.parentInjector)
                console.log(`load component: ${cp}`);
                this.rootViewContainer.insert(component.hostView)
                break;
            }
        }
    }
}
