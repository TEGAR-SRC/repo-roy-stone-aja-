import { CommonModule } from '@angular/common';
import { Component, Input, SimpleChanges } from '@angular/core';
import { Store } from '@ngxs/store';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { forkJoin, of } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { CategoriesComponent } from '../../../../shared/components/widgets/categories/categories.component';
import { ImageLinkComponent } from '../../../../shared/components/widgets/image-link/image-link.component';
import { JewelleryCategorySlider, categorySlider } from '../../../../shared/data/owl-carousel';
import { Category } from '../../../../shared/interface/category.interface';
import { Banners, JewelryTwo } from '../../../../shared/interface/theme.interface';
import { ThemeOptionService } from '../../../../shared/services/theme-option.service';
import { GetBrands } from '../../../../shared/store/action/brand.action';
import { GetCategories } from '../../../../shared/store/action/category.action';
import { GetProductByIds } from '../../../../shared/store/action/product.action';
import { ThemeBannerComponent } from '../../widgets/theme-banner/theme-banner.component';
import { ThemeBrandComponent } from '../../widgets/theme-brand/theme-brand.component';
import { ThemeHomeSliderComponent } from '../../widgets/theme-home-slider/theme-home-slider.component';
import { ThemeProductComponent } from '../../widgets/theme-product/theme-product.component';
import { ThemeServicesComponent } from '../../widgets/theme-services/theme-services.component';
import { ThemeSocialMediaComponent } from '../../widgets/theme-social-media/theme-social-media.component';
import { ThemeTitleComponent } from '../../widgets/theme-title/theme-title.component';

@Component({
  selector: 'app-jewellery-2',
  standalone: true,
  imports: [CommonModule, CarouselModule,ThemeHomeSliderComponent,
            ThemeBannerComponent, ThemeTitleComponent, ThemeProductComponent,
            ThemeServicesComponent, ThemeSocialMediaComponent, ThemeBrandComponent,
            CategoriesComponent, ImageLinkComponent],
  templateUrl: './jewellery-2.component.html',
  styleUrl: './jewellery-2.component.scss'
})
export class Jewellery2Component {

  @Input() data?: JewelryTwo;
  @Input() slug?: string;

  public categories: Category[];
  public categories2: Category[];
  public options = categorySlider;
  public categorySlider = JewelleryCategorySlider;
  public filteredBanners: Banners[];
  public StorageURL = environment.storageURL;

  constructor(
    private store: Store,
    private themeOptionService: ThemeOptionService) {
  }

  ngOnInit() {
    if(this.data?.slug == this.slug) {
      let categoryIds = this.data?.content.categories.category_ids

      // Get Products
      let getProduct$;
      if(this.data?.content?.products_ids.length){
        getProduct$ = this.store.dispatch(new GetProductByIds({
          status: 1,
          approve: 1,
          ids: this.data?.content?.products_ids?.join(','),
          paginate: this.data?.content?.products_ids?.length
        }))
      }else{
        getProduct$ = of(null);
      }

      // Get Category
      let getCategory$;
      if(categoryIds && categoryIds.length){
        getCategory$ = this.store.dispatch(new GetCategories({
          status: 1,
          ids: categoryIds?.join(',')
        }));
      }else{
        getCategory$ = of(null);
      }

      // Get Brand
      let getBrands$;
      if(this.data?.content?.brand?.brand_ids.length && this.data?.content?.brand?.status){
        getBrands$ = this.store.dispatch(new GetBrands({
          status: 1,
          ids: this.data?.content?.brand?.brand_ids?.join(',')
        }));
      }else{
        getBrands$ = of(null);
      }
     
      // Skeleton Loader
      document.body.classList.add('skeleton-body');

      forkJoin([getProduct$, getCategory$, getBrands$]).subscribe({
        complete: () => {
          document.body.classList.remove('skeleton-body');
          this.themeOptionService.preloader = false;
        }
      })

    }
  }

  ngOnChanges(change: SimpleChanges){
    if(change['data'] && change['data'].currentValue){
      this.filteredBanners = change['data']?.currentValue?.content?.offer_banner_1?.banners?.filter((banner: Banners) => {
        return banner.status
      })
    }
  }
}