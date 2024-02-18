import { Component, OnInit, inject } from '@angular/core';
import { Product } from 'src/app/models/product.model';
import { User } from 'src/app/models/user.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';
import { AddUpdateProductComponent } from 'src/app/shared/components/add-update-product/add-update-product.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  firebaseSvc = inject(FirebaseService);
  utilsSvc = inject(UtilsService);


  products: Product[] = [];
  ngOnInit() {
  }

  user(): User{
    return this.utilsSvc.getFromLocalStorage('user');
  }

  ionViewWillEnter() {
    this.getProducts();
  }

  //=============== Obtener productos ===============
  getProducts(){
    let path = `users/${this.user().uid}/products`;

    let sub = this.firebaseSvc.getCollectionData(path).subscribe({
      next: (res: any) =>{
        console.log(res);
        this.products = res;
        sub.unsubscribe();
      }
    })
  }

  //=============== Agregar o actualizar pizza ===============
  async addUpdateProduct(product?: Product){
    
    let success = await this.utilsSvc.presentModal({
      component: AddUpdateProductComponent,
      cssClass: 'add-update-modal',
      componentProps: {product}
    })

    if(success) this.getProducts();

  }

  

  // ================ Confirmar la eliminacion del producto ===============
  async confirmDeleteProduct(product: Product) {
    this.utilsSvc.presentAlert({
      header: 'Eliminar Pizza',
      message: '¿Quieres eliminar esta pizza?',
      mode: 'ios',
      buttons: [
        {
          text: 'Cancelar',
        }, {
          text: 'Si, eliminar',
          handler: () => {
            this.deleteProduct(product);
          }
        }
      ]
    });
  }


  // ================ Eliminar Producto ===============
  async deleteProduct(product: Product) {

    let path = `users/${this.user().uid}/products/${product.id}`;

    const loading = await this.utilsSvc.loading();
    await loading.present();

    let imagePath = await this.firebaseSvc.getFilePath(product.image);
    await this.firebaseSvc.deleteFile(imagePath);

    this.firebaseSvc.deleteDocument(path).then(async res =>{

      this.products = this.products.filter(p => p.id !== product.id);
      
      this.utilsSvc.presentToast({
        message: 'Pizza eliminada exitosamente',
        duration: 1500,
        color: 'success',
        position: 'middle',
        icon: 'checkmark-circle-outline'
      });

    }).catch(error => {
      console.log(error);

      this.utilsSvc.presentToast({
        message: error.message,
        duration: 2500,
        color: 'danger',
        position: 'middle',
        icon: 'alert-circle-outline'
      });

    }).finally(() => {
      loading.dismiss();
    })
  
}

}
