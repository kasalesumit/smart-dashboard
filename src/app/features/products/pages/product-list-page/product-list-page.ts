import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../data-access/product.service';
import { LoaderService } from '../../../../core/services/loader.service';
import { Product } from '../../models/product.model';
import { catchError, Observable, of } from 'rxjs';
import { MyFormArray } from '../../../reactive-form/form-array/form-array';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, MyFormArray],
  templateUrl: './product-list-page.html',
  styleUrls: ['./product-list-page.scss']
})
export class ProductListPage implements OnInit {

  private readonly productService = inject(ProductService);

  products: Product[] = [];
  products$!: Observable<Product[]>;
  loaderService = inject(LoaderService);

  constructor(){}
  ngOnInit() {
    this.products$ = this.productService.getProducts().pipe(
      catchError((error) => {
        console.error(error);
        return of([]); // fallback empty list
      })
    );
  }

}