import { Component, Input } from '@angular/core';
import { FurnitureDark } from '../../../../shared/interface/theme.interface';
import { Category } from '../../../../shared/interface/category.interface';
import { Store } from '@ngxs/store';
import { ThemeOptionService } from '../../../../shared/services/theme-option.service';
import { GetProductByIds } from '../../../../shared/store/action/product.action';
import { GetCategories } from '../../../../shared/store/action/category.action';
import { forkJoin, of } from 'rxjs';
import { CommonModule } from '@angular/common';
import { ThemeHomeSliderComponent } from '../../widgets/theme-home-slider/theme-home-slider.component';
import { ThemeTitleComponent } from '../../widgets/theme-title/theme-title.component';
import { ThemeProductComponent } from '../../widgets/theme-product/theme-product.component';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { FurnitureCategorySlider } from '../../../../shared/data/owl-carousel';
import { ImageLinkComponent } from '../../../../shared/components/widgets/image-link/image-link.component';
import { ThemeServicesComponent } from '../../widgets/theme-services/theme-services.component';
import { ThemeBlogComponent } from '../../widgets/theme-blog/theme-blog.component';
import { ThemeBrandComponent } from '../../widgets/theme-brand/theme-brand.component';
import { CategoriesComponent } from '../../../../shared/components/widgets/categories/categories.component';
import { GetBrands } from '../../../../shared/store/action/brand.action';
import { GetBlogs } from '../../../../shared/store/action/blog.action';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-furniture-dark',
  standalone: true,
  imports: [CommonModule, CarouselModule ,ThemeHomeSliderComponent, ThemeTitleComponent, ThemeProductComponent,
            ImageLinkComponent, ThemeServicesComponent, ThemeBlogComponent, ThemeBrandComponent, CategoriesComponent],
  templateUrl: './furniture-dark.component.html',
  styleUrl: './furniture-dark.component.scss'
})
export class FurnitureDarkComponent {

  @Input() data?: FurnitureDark;
  @Input() slug?: string;

  public categories: Category[];
  public categoryOptions = FurnitureCategorySlider;
  public StorageURL = environment.storageURL;

  constructor(
    private store: Store,
    private themeOptionService: ThemeOptionService) {
  }

  ngOnChanges() {
    if(this.data?.slug == this.slug) {

      // Get Products
      const getProduct$ = this.store.dispatch(new GetProductByIds({
        status: 1,
        approve: 1,
        ids: this.data?.content?.products_ids?.join(','),
        paginate: this.data?.content?.products_ids?.length
      }))
      // Get Category
      const getCategory$ = this.store.dispatch(new GetCategories({
        status: 1,
        ids: this.data?.content.categories_icon_list.category_ids?.join(',')
      }));

      // Get Blog
      let getBlog$;
      if(this.data?.content?.featured_blogs?.blog_ids?.length && this.data?.content?.featured_blogs?.status){
        getBlog$ = this.store.dispatch(new GetBlogs({
          status: 1,
          ids: this.data?.content?.featured_blogs?.blog_ids?.join(',')
        }));
      } else { getBlog$ = of(null); }

      // Get Brand
      const getBrands$ = this.store.dispatch(new GetBrands({
        status: 1,
        ids: this.data?.content?.brand?.brand_ids?.join(',')
      }));

      // Skeleton Loader
      document.body.classList.add('skeleton-body');
      document.body.classList.add('dark');
      document.body.classList.add('dark-demo');
      
      forkJoin([getProduct$, getCategory$, getBrands$, getBlog$]).subscribe({
        complete: () => {
          document.body.classList.remove('skeleton-body');
          this.themeOptionService.preloader = false;
        }
      });

    }

  }

  ngOnDestroy() {
    // Remove Class
    document.body.classList.remove('dark');
    document.body.classList.remove('dark-demo');
  }
}