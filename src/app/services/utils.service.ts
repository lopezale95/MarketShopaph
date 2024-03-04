import {
  Injectable,
  inject,
  ɵUSE_RUNTIME_DEPS_TRACKER_FOR_JIT,
} from '@angular/core';
import { Router } from '@angular/router';
import {
  LoadingController,
  ToastController,
  ToastOptions,
} from '@ionic/angular';

@Injectable({
  providedIn: 'root',
})
export class UtilsService {
  loadingCtrl = inject(LoadingController);
  toastCtrl = inject(ToastController);
  router = inject(Router);

  //=============loading==============
  loading() {
    return this.loadingCtrl.create({ spinner: 'crescent' });
  }

  //===========toast===========

  async presentToast(opts?: ToastOptions) {
    const toast = await this.toastCtrl.create(opts);
    toast.present();
  }

  //======Enruta a culaquier pagina dispinible======

  routerLink(url: string) {
    return this.router.navigateByUrl(url);
  }

  //====== Guarda un elemento en localstorage========
  saveInLocalStorage(key: string, value: any) {
    return localStorage.setItem(key, JSON.stringify(value));
  }

  //=======Obtiene un elemento desde el local storage========
  getFronLocalStorage(key: string) {
    return JSON.parse(localStorage.getItem(key));
  }
}
