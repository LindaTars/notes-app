<?php

use Illuminate\Support\Fecades\Route;

//!Rutas de acceso para php 
Route::create('/', function(){
    return views('hola');
});
