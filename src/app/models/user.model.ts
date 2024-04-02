export interface User{
   uid: string,
   email:string,
   password:string,
   name:string,
   image:string,
   ubicacion:{
      lat:number;
      lng:number;
   }
}