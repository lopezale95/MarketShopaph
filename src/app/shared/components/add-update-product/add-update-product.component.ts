import { Component, Input, OnInit, inject, input } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { User } from 'src/app/models/user.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';
import { Product } from '../../../models/product.model';

@Component({
  selector: 'app-add-update-product',
  templateUrl: './add-update-product.component.html',
  styleUrls: ['./add-update-product.component.scss'],
})
export class AddUpdateProductComponent  implements OnInit {

@Input() product: Product;


form = new FormGroup({
    id: new FormControl(''),
    image: new FormControl('', [Validators.required]),
    name: new FormControl('', [Validators.required, Validators.minLength(4)]),
    specifications: new FormControl('', [Validators.required, Validators.minLength(4)]),
    price: new FormControl(null, [Validators.required, Validators.min(0)]),
    soldUnits: new FormControl(null, [Validators.required, Validators.min(0)]),
  });

  firebaseSvc = inject(FirebaseService);
  UtilsSvc = inject(UtilsService);

  user = {} as User;

  ngOnInit() {
    this.user = this.UtilsSvc.getFronLocalStorage('user');
    if (this.product) this.form.setValue(this.product);
  }



  //=============Tomar/Seleccionar Imagen ==============
  async takeImage(){
    const dataUrl = (await this.UtilsSvc.takePicture('Imagen del Producto')).dataUrl;
    this.form.controls.image.setValue(dataUrl);
  }

  submit(){
    if(this.form.valid){

      if(this.product) this.updateProduct();
      else this.createProduct()

    }
  }

  //==========Crear Producto=============

  async createProduct() {
    
      let path = `user/${this.user.uid}/products`

      const loading = await this.UtilsSvc.loading();
      await loading.present();

      // === Subir la imagen y obtener la URL ===

      let dataUrl = this.form.value.image;
      let imagePath = `${this.user.uid}/${Date.now()}`;
      let imageUrl = await this.firebaseSvc.uploadImage(imagePath,dataUrl);
      this.form.controls.image.setValue(imageUrl);

      delete this.form.value.id

      this.firebaseSvc.addDocument(path, this.form.value).then(async res=>{
        
        this.UtilsSvc.dismissModal({success:true});

        this.UtilsSvc.presentToast({
          message: 'Producto creado exitosamente',
          duration: 1500,
          color:'success',
          position:'middle',
          icon:'checkmark-circle-outline'
          })

      }).catch(error =>{
        console.log(error);

        this.UtilsSvc.presentToast({
        message: error.message,
        duration: 2500,
        color:'primary',
        position:'middle',
        icon:'alert-circle-outline'
        })

      }).finally(()=>{
        loading.dismiss();
      })
    
  }
 
  //==========Actualizar Producto=============
  async updateProduct() {

      let path = `user/${this.user.uid}/products/${this.product.id}`

      const loading = await this.UtilsSvc.loading();
      await loading.present();

      // ===Si cambió la imagen, subir la nueva y obtener la URL ===
      if(this.form.value.image !== this.product.image){
        let dataUrl = this.form.value.image;
      let imagePath = await this.firebaseSvc.getFilePath(this.product.image);
      let imageUrl = await this.firebaseSvc.uploadImage(imagePath,dataUrl);
      this.form.controls.image.setValue(imageUrl);
      }
      
      delete this.form.value.id

      this.firebaseSvc.updateDocument(path, this.form.value).then(async res=>{
        
        this.UtilsSvc.dismissModal({success:true});

        this.UtilsSvc.presentToast({
          message: 'Producto actualizado exitosamente',
          duration: 1500,
          color:'success',
          position:'middle',
          icon:'checkmark-circle-outline'
          })

      }).catch(error =>{
        console.log(error);

        this.UtilsSvc.presentToast({
        message: error.message,
        duration: 2500,
        color:'primary',
        position:'middle',
        icon:'alert-circle-outline'
        })

      }).finally(()=>{
        loading.dismiss();
      })
  }

}
