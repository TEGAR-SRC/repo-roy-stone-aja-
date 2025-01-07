import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Store } from '@ngxs/store';
import { ElectronicTwo, FeaturedBanner } from '../../../../shared/interface/theme.interface';
import { ThemeOptionService } from '../../../../shared/services/theme-option.service';
import { GetProductByIds } from '../../../../shared/store/action/product.action';
import { ThemeBannerComponent } from '../../widgets/theme-banner/theme-banner.component';
import { ThemeBrandComponent } from '../../widgets/theme-brand/theme-brand.component';
import { ThemeProductTabSectionComponent } from '../../widgets/theme-product-tab-section/theme-product-tab-section.component';
import { GetCategories } from '../../../../shared/store/action/category.action';
import { forkJoin, of } from 'rxjs';
import { GetBrands } from '../../../../shared/store/action/brand.action';
import { ImageLinkComponent } from '../../../../shared/components/widgets/image-link/image-link.component';

@Component({
  selector: 'app-electronic-2',
  standalone: true,
  imports: [CommonModule, ThemeBannerComponent, ThemeProductTabSectionComponent, 
            ThemeBrandComponent, ImageLinkComponent],
  templateUrl: './electronic-2.component.html',
  styleUrl: './electronic-2.component.scss'
})
export class Electronic2Component {

  @Input() data?: ElectronicTwo;
  @Input() slug?: string;

  public banners: FeaturedBanner[];

  constructor(
    private store: Store,
    private themeOptionService: ThemeOptionService) {
  }

  ngOnChanges() {
    if(this.data?.slug == this.slug) {
      this.banners = [];
      if(this.data?.content?.offer_banner?.banner_1?.status){
        this.banners = [...this.banners, this.data?.content?.offer_banner?.banner_1]
      }
      if(this.data?.content?.offer_banner?.banner_2?.status){
        this.banners = [...this.banners, this.data?.content?.offer_banner?.banner_2]
      }
      if(this.data?.content?.offer_banner?.banner_3?.status){
        this.banners = [...this.banners, this.data?.content?.offer_banner?.banner_3]
      }
      
      // Get Products
      let getProduct$;
      if(this.data?.content?.products_ids?.length){
        getProduct$ = this.store.dispatch(new GetProductByIds({
          status: 1,
          approve: 1,
          ids: this.data?.content?.products_ids?.join(','),
          paginate: this.data?.content?.products_ids?.length
        }))
      } else { getProduct$ = of(null); };

      // Get Category
      let getCategory$;
      if(this.data?.content.category_product?.status && this.data?.content.category_product.category_ids?.length){
        getCategory$ = this.store.dispatch(new GetCategories({
          status: 1,
          ids: this.data?.content.category_product.category_ids?.join(',')
        }));
      } else { getCategory$ = of(null); };

      // Get Brand
      let getBrands$;
      if(this.data?.content?.brand?.status && this.data?.content?.brand?.brand_ids?.length) {
        getBrands$ = this.store.dispatch(new GetBrands({
          status: 1,
          ids: this.data?.content?.brand?.brand_ids?.join(',')
        }));
      } else { getBrands$ = of(null); };

      // Skeleton Loader
      document.body.classList.add('skeleton-body');
      
      forkJoin([getProduct$, getCategory$, getBrands$]).subscribe({
        complete: () => {
          document.body.classList.remove('skeleton-body');
          this.themeOptionService.preloader = false;
        }
      });

    }
  }
}