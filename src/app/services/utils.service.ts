import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController, ModalController, ModalOptions, ToastController, ToastOptions } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  loadingCtrl = inject(LoadingController);
  toastCtrl = inject(ToastController);
  modalCtrl = inject(ModalController);
  router = inject(Router);

  //=============== Loading ===============
  loading() {
    return this.loadingCtrl.create({ spinner: 'crescent' })
  }

  //=============== Toast ===============
  async presentToast(opts?: ToastOptions) {
    const toast = await this.toastCtrl.create(opts);
    toast.present();
  }

  //=============== Enruta a cualquier pagina disponible ===============
  routerLink(url: string){
    this.router.navigateByUrl(url);
  }

  //=============== Guarda un elemento en localstorage ===============
  saveInStorage(key: string, value: any){
    return localStorage.setItem(key, JSON.stringify(value));
  }

  //=============== Obtiene un elemento de localstorage ===============
  getFromLocalStorage(key: string){
    return JSON.parse(localStorage.getItem(key));
  }

  //=============== Modal ===============
  async presentModal(opts: ModalOptions) {
    const modal = await this.modalCtrl.create(opts);  
    await modal.present();

    const { data } = await modal.onWillDismiss();
    if(data) return data;
  }

  dismissModal(data?: any){
    return this.modalCtrl.dismiss(data);
  }

}
