import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        loadChildren: ()=>
            import('./features/products/routes').then(r=> r.PRODUCT_ROUTES)
    },
    {
        path: 'products',
        loadChildren: ()=>
            import('./features/products/routes').then(r=> r.PRODUCT_ROUTES)
    }
];
