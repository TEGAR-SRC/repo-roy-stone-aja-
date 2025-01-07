import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Store } from '@ngxs/store';
import { forkJoin, of } from 'rxjs';

import { ImageLinkComponent } from '../../../../shared/components/widgets/image-link/image-link.component';
import { ProductBoxComponent } from '../../../../shared/components/widgets/product-box/product-box.component';
import { ThemeBannerComponent } from '../../widgets/theme-banner/theme-banner.component';
import { ThemeBlogComponent } from '../../widgets/theme-blog/theme-blog.component';
import { ThemeBrandComponent } from '../../widgets/theme-brand/theme-brand.component';
import { ThemeHomeSliderComponent } from '../../widgets/theme-home-slider/theme-home-slider.component';
import { ThemeParallaxBannerComponent } from '../../widgets/theme-parallax-banner/theme-parallax-banner.component';
import { ThemeProductTabSectionComponent } from '../../widgets/theme-product-tab-section/theme-product-tab-section.component';
import { ThemeProductComponent } from '../../widgets/theme-product/theme-product.component';
import { ThemeServicesComponent } from '../../widgets/theme-services/theme-services.component';
import { ThemeSocialMediaComponent } from '../../widgets/theme-social-media/theme-social-media.component';
import { ThemeTitleComponent } from '../../widgets/theme-title/theme-title.component';

import { FashionOne } from '../../../../shared/interface/theme.interface';

import { ThemeOptionService } from '../../../../shared/services/theme-option.service';

import { NewsletterModalComponent } from '../../../../shared/components/widgets/modal/newsletter-modal/newsletter-modal.component';
import { GetBlogs } from '../../../../shared/store/action/blog.action';
import { GetBrands } from '../../../../shared/store/action/brand.action';
import { GetCategories } from '../../../../shared/store/action/category.action';
import { GetProductByIds } from '../../../../shared/store/action/product.action';

@Component({
  selector: 'app-fashion-1',
  standalone: true,
  imports: [CommonModule,ThemeHomeSliderComponent, ThemeBannerComponent,
            ThemeTitleComponent, ThemeProductComponent, ThemeParallaxBannerComponent,
            ProductBoxComponent, ThemeProductTabSectionComponent, ThemeServicesComponent,
            ThemeBlogComponent, ThemeBlogComponent, ThemeSocialMediaComponent,
            ThemeBrandComponent, ImageLinkComponent, NewsletterModalComponent],
  templateUrl: './fashion-1.component.html',
  styleUrl: './fashion-1.component.scss'
})
export class Fashion1Component {

  @Input() data?: FashionOne;
  @Input() slug?: string;

  constructor(private store: Store, private themeOptionService: ThemeOptionService) {}

  ngOnInit() {
    if(this.data?.slug == this.slug) {

      // Get Products
      let getProducts$
      if(this.data?.content?.products_ids?.length && this.data?.content?.products_list?.status){
        getProducts$ = this.store.dispatch(new GetProductByIds({
          status: 1,
          approve: 1,
          ids: this.data?.content?.products_ids?.join(','),
          paginate: this.data?.content?.products_ids?.length
        }));
      } else { getProducts$ = of(null); }

      // Get Category
      let getCategory$;
      if(this.data?.content.category_product.category_ids?.length && this.data?.content.category_product?.status){
        getCategory$ = this.store.dispatch(new GetCategories({
          status: 1,
          ids: this.data?.content.category_product.category_ids?.join(',')
        }))
      } else { getCategory$ = of(null); }

      // Get Brand
      let getBrands$;
      if(this.data?.content?.brand?.brand_ids?.length && this.data?.content?.brand?.status) {
        getBrands$ = this.store.dispatch(new GetBrands({
          status: 1,
          ids: this.data?.content?.brand?.brand_ids?.join(',')
        }));
      } else { getBrands$ = of(null); }

      // Get Blog
      let getBlog$;
      if(this.data?.content?.featured_blogs?.blog_ids?.length && this.data?.content?.featured_blogs?.status){
        getBlog$ = this.store.dispatch(new GetBlogs({
          status: 1,
          ids: this.data?.content?.featured_blogs?.blog_ids?.join(',')
        }));
      } else { getBlog$ = of(null); }

      // Skeleton Loader
      document.body.classList.add('skeleton-body');

      forkJoin([getProducts$, getCategory$, getBrands$, getBlog$]).subscribe({
        complete: () => {
          document.body.classList.remove('skeleton-body');
          this.themeOptionService.preloader = false;
        }
      });
    }
  }
}