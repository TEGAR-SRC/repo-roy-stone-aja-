import { Component, Input } from '@angular/core';
import { FeaturedBanner, VideoSlider } from '../../../shared/interface/theme.interface';
import { Store } from '@ngxs/store';
import { ThemeOptionService } from '../../../shared/services/theme-option.service';
import { GetProductByIds } from '../../../shared/store/action/product.action';
import { forkJoin, of } from 'rxjs';
import { GetBlogs } from '../../../shared/store/action/blog.action';
import { GetBrands } from '../../../shared/store/action/brand.action';
import { ThemeHomeSliderComponent } from '../widgets/theme-home-slider/theme-home-slider.component';
import { ImageLinkComponent } from '../../../shared/components/widgets/image-link/image-link.component';
import { CommonModule } from '@angular/common';
import { ThemeTitleComponent } from '../widgets/theme-title/theme-title.component';
import { ThemeProductTabSectionComponent } from '../widgets/theme-product-tab-section/theme-product-tab-section.component';
import { ThemeProductComponent } from '../widgets/theme-product/theme-product.component';
import { ThemeServicesComponent } from '../widgets/theme-services/theme-services.component';
import { ThemeBlogComponent } from '../widgets/theme-blog/theme-blog.component';
import { ThemeSocialMediaComponent } from '../widgets/theme-social-media/theme-social-media.component';
import { ThemeBrandComponent } from '../widgets/theme-brand/theme-brand.component';
import { GetCategories } from '../../../shared/store/action/category.action';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-video-slider',
  standalone: true,
  imports: [CommonModule,ThemeHomeSliderComponent, ImageLinkComponent,
            ThemeTitleComponent, ThemeProductTabSectionComponent, ThemeProductComponent,
            ThemeServicesComponent, ThemeBlogComponent, ThemeSocialMediaComponent,
            ThemeBrandComponent
  ],
  templateUrl: './video-slider.component.html',
  styleUrl: './video-slider.component.scss'
})
export class VideoSliderComponent {

  @Input() data?: VideoSlider;
  @Input() slug?: string;

  public banners: FeaturedBanner[];
  public StorageURL = environment.storageURL;

  constructor(
    private store: Store,
    public themeOptionService: ThemeOptionService) {
  }

  ngOnInit() {
    if(this.data?.slug == this.slug) {

      this.banners = [];
      if(this.data?.content?.collection_banner?.banner_1?.status){
        this.banners = [...this.banners, this.data?.content?.collection_banner?.banner_1]
      }
      if(this.data?.content?.collection_banner?.banner_2?.status){
        this.banners = [...this.banners, this.data?.content?.collection_banner?.banner_2]
      }
      if(this.data?.content?.collection_banner?.banner_3?.status){
        this.banners = [...this.banners, this.data?.content?.collection_banner?.banner_3]
      }

      // Get Products
      let getProducts$
      if(this.data?.content?.products_ids.length && (this.data?.content?.products_list?.status)){
        getProducts$ = this.store.dispatch(new GetProductByIds({
           status: 1,
          approve:1,
          ids: this.data?.content?.products_ids?.join(','),
          paginate: this.data?.content?.products_ids?.length
        }));
      } else {
        getProducts$ = of(null);
      }

      // Get Category
      let getCategory$;
      if(this.data?.content.category_product.category_ids?.length && this.data?.content.category_product?.status){
        getCategory$ = this.store.dispatch(new GetCategories({
          status: 1,
          ids: this.data?.content.category_product.category_ids?.join(',')
        }))
      } else { getCategory$ = of(null); }

      // Get Blog
      let getBlog$;
      if(this.data?.content?.featured_blogs?.blog_ids?.length && this.data?.content?.featured_blogs?.status){
        getBlog$ = this.store.dispatch(new GetBlogs({
          status: 1,
          ids: this.data?.content?.featured_blogs?.blog_ids?.join(',')
        }));
      } else {
        getBlog$ = of(null);
      }

      // Get Brand
      let getBrands$
      if(this.data?.content?.brand?.brand_ids.length && this.data?.content?.brand.status){
        getBrands$ = this.store.dispatch(new GetBrands({
          status: 1,
          ids: this.data?.content?.brand?.brand_ids?.join(',')
        }));
      }else {
        getBrands$ = of(null);
      }

      // Skeleton Loader
      document.body.classList.add('skeleton-body');
      forkJoin([getProducts$, getBlog$, getBrands$]).subscribe({
        complete: () => {
          document.body.classList.remove('skeleton-body');
          this.themeOptionService.preloader = false;
        }
      });
    }
  }

}