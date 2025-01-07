import { ProductDigitalOptionsComponent } from './../widgets/product-digital-options/product-digital-options.component';
import { CommonModule } from '@angular/common';
import { Component, Input, ViewChild } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { NgxImageZoomModule } from 'ngx-image-zoom';
import { CarouselComponent, CarouselModule, SlidesOutputData } from 'ngx-owl-carousel-o';
import * as data from '../../../../../shared/data/owl-carousel';
import { Product, Variation } from '../../../../../shared/interface/product.interface';
import { Option } from '../../../../../shared/interface/theme-option.interface';
import { ProductService } from '../../../../../shared/services/product.service';
import { PaymentOptionComponent } from '../widgets/payment-option/payment-option.component';
import { ProductBundleComponent } from '../widgets/product-bundle/product-bundle.component';
import { ProductContentComponent } from '../widgets/product-content/product-content.component';
import { ProductDeliveryInformationComponent } from '../widgets/product-delivery-information/product-delivery-information.component';
import { ProductDetailsSidebarComponent } from '../widgets/product-details-sidebar/product-details-sidebar.component';
import { ProductDetailsTabComponent } from '../widgets/product-details-tab/product-details-tab.component';
import { ProductDetailsComponent } from '../widgets/product-details/product-details.component';
import { ProductInformationComponent } from '../widgets/product-information/product-information.component';
import { ProductSocialShareComponent } from '../widgets/product-social-share/product-social-share.component';
import { TranslateModule } from '@ngx-translate/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-product-thumbnail',
  standalone: true,
  imports: [CommonModule, CarouselModule, NgxImageZoomModule, TranslateModule,
            ProductContentComponent, ProductInformationComponent, ProductDeliveryInformationComponent,
            ProductSocialShareComponent, PaymentOptionComponent, ProductBundleComponent,
            ProductDetailsTabComponent, ProductDetailsSidebarComponent, ProductDetailsComponent, 
            ProductDigitalOptionsComponent],
  templateUrl: './product-thumbnail.component.html',
  styleUrl: './product-thumbnail.component.scss'
})
export class ProductThumbnailComponent {

  @Input() product: Product;
  @Input() option: Option | null;
  @Input() layout: string;

  @ViewChild('thumbnailCarousel') thumbnailCarousel: CarouselComponent;

  public selectedVariation: Variation;
  public activeSlide: string = '0';
  public videType = ['video/mp4', 'video/webm', 'video/ogg'];
  public audioType = ['audio/mpeg', 'audio/wav', 'audio/ogg'];

  public productMainThumbSlider = data.productMainThumbSlider;
  public productThumbSlider = data.productThumbSlider;

  constructor(public productService: ProductService,private router: Router, public route: ActivatedRoute, public modal: NgbModal){
    this.router.events.forEach((event) => {
      if(event instanceof NavigationEnd) {
        this.activeSlide = '0'
      }
    });
  }

  openFilter(){
    this.productService.productFilter = true;
  }

  selectedVariant(variant: Variation){
    this.selectedVariation = variant;
  }

  onCarouselLoad(){
    this.activeSlide = '0';
  }

  onSlideChange(event: SlidesOutputData){
    if(this.selectedVariation && this.selectedVariation.variation_galleries.length){
      this.selectedVariation.variation_galleries.forEach((images) => {
        if(event && event.slides && event.slides[0].id && event.slides.length > 0){
          if(images.id.toString() === event.slides[0].id){
            this.activeSlide = images.id.toString();
            if(this.activeSlide){
              this.thumbnailCarousel.to(this.activeSlide);
            }
          }
        }
      })
    }else{
      if(this.thumbnailCarousel && event && event.slides && event.slides[0].id && event.slides.length > 0){
       this.activeSlide = event.slides[0].id;

       if(this.activeSlide){
         this.thumbnailCarousel.to(this.activeSlide);
       }
     }
    }
  }
}
