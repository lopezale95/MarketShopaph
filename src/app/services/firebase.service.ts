import { Injectable, inject } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  sendPasswordResetEmail,
} from 'firebase/auth';
import { User } from '../models/user.model';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { getFirestore, setDoc, doc, getDoc } from '@angular/fire/firestore';
import { getAuth } from 'firebase/auth';
import { UtilsService } from './utils.service';
@Injectable({
  providedIn: 'root',
})
export class FirebaseService {
  auth = inject(AngularFireAuth);
  firestore = inject(AngularFirestore);
  UtilsSvc= inject(UtilsService);

  //==============Autenticación================
  getAuth(){
    return getAuth();
  }
  //==============Acceder==================
  signIn(user: User) {
    return signInWithEmailAndPassword(getAuth(), user.email, user.password);
  }

  //==============Crear Usuario==================
  signUp(user: User) {
    return createUserWithEmailAndPassword(getAuth(), user.email, user.password);
  }

  //============Actualizar Usuario=============
  updateUser(displayName: string) {
    return updateProfile(getAuth().currentUser, { displayName });
  }

  //=========Restablecer contraseña=========

  sendRecoveryEmail(email: string) {
    return sendPasswordResetEmail(getAuth(), email);
  }
  //===========Cerrar Sesión=============
  signOut(){
    getAuth().signOut();
    localStorage.removeItem('user');
    this.UtilsSvc.routerLink('/auth');
  }
  //============Base de Datos=============

  //============Setear un documento=============

  setDocument(path: string, data: any) {
    return setDoc(doc(getFirestore(), path), data);
  }
  //=========Obtener un documento=========
  async getDocument(path: string) {
    return (await getDoc(doc(getFirestore(), path))).data();
  }
}
