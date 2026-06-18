<?php

// namespace App\Models;
// // use Illuminate\Contracts\Auth\MustVerifyEmail;
// //use Database\Factories\UserFactory;
// //use Illuminate\Database\Eloquent\Attributes\Fillable;
// use Illuminate\Database\Eloquent\Model;
// use Illuminate\Database\Eloquent\Factories\HasFactory;
// //use Illuminate\Foundation\Auth\User as Authenticatable;
// //use Illuminate\Notifications\Notifiable;

// // #[Fillable(['name', 'email', 'password','lastname'])]
// // #[Hidden(['password', 'remember_token'])]

// class Perfil extends Model
// {  
//     use HasFactory;
//     //* se define el nombre de la tabla de postgres
//     protected $table = 'perfiles';
//     //* Definimos los campos que se deben de guardar desde el front 
//     protected $fillable = [
//         'user_id',
//         'nombrePerfil',
//         'tipoPerfil',
//         'passwordPerfil',
//     ];

//     protected $casts = [
//         'tipoPerfil'=> 'array',
//     ];
// //* Funcion para rlacionar al perfil con el usuario 
//     public function user(){
//         //*Se usa belongsTo para acceder a user desde perfil 
//         return $this->belongsTo(User::class, 'user_id');
//     }
// //* Funcion para relacionar el Perfil con las Notas
//     public function notas(){
//         //* Usamor hasMany para definir las relaciones de uno a muchos, un padre con muchos hijos, un perfil con muchas notas 
//         return $this->hasMany(Nota::class, 'perfil_id');
//     }
// }
