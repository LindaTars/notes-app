<?php

use App\Http\Controllers\Autcontroller;
use Illuminate\Support\Facades\Route;

// * Aqui se pondran las rutas para registrar un nuevo usuario
Route::post('/registro', [Autcontroller::class,'registrar']);
//* Ruta pa hacer el logeo
Route::post('/login', [Autcontroller::class,'ingresar']);