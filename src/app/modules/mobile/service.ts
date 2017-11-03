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
import { HomeMComponent } from './components/home-m/home-m.component';
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
                this.rootViewContainer.clear();

                const factory = this.factoryResolver.resolveComponentFactory(ProductMComponent)
                const component = factory.create(this.rootViewContainer.parentInjector)

                this.rootViewContainer.insert(component.hostView)
                break;
            }
            case 'partner': {
                this.rootViewContainer.clear();

                const factory = this.factoryResolver.resolveComponentFactory(PartnerMComponent)
                const component = factory.create(this.rootViewContainer.parentInjector)


                this.rootViewContainer.insert(component.hostView)
                break;
            }
            case 'about': {
                this.rootViewContainer.clear();

                const factory = this.factoryResolver.resolveComponentFactory(AboutMComponent)
                const component = factory.create(this.rootViewContainer.parentInjector)


                this.rootViewContainer.insert(component.hostView)
                break;
            }
            case 'career': {
                this.rootViewContainer.clear();

                const factory = this.factoryResolver.resolveComponentFactory(CareerMComponent)
                const component = factory.create(this.rootViewContainer.parentInjector)


                this.rootViewContainer.insert(component.hostView)
                break;
            }
            case 'contact': {
                this.rootViewContainer.clear();

                const factory = this.factoryResolver.resolveComponentFactory(ContactMComponent)
                const component = factory.create(this.rootViewContainer.parentInjector)

                this.rootViewContainer.insert(component.hostView)
                break;
            }
            case 'tech': {
            }
            default: {
                this.rootViewContainer.clear();

                const factory1 = this.factoryResolver.resolveComponentFactory(HomeMComponent)
                const component1 = factory1.create(this.rootViewContainer.parentInjector)
                this.rootViewContainer.insert(component1.hostView)
                const factory2 = this.factoryResolver.resolveComponentFactory(TechMComponent)
                const component2 = factory2.create(this.rootViewContainer.parentInjector)
                this.rootViewContainer.insert(component2.hostView)
                break;
            }
        }
    }
}
