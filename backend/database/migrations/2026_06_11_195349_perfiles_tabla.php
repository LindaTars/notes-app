<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {

    //     //*Este contenido se usa para los valores de las tablas de la BD
    //     Schema::create('perfiles', function (Blueprint $table) {
    //     $table->id(); //!idPerfil (PK)
    //     //! Conexión automática a la tabla 'users' que está en los archivos base de Laravel
    //     $table->foreignId('user_id')->constrained()->onDelete('cascade'); 
    //     $table->string('nombrePerfil');//! nombre asignado a cada perfil 
    //     $table->string('tipoPerfil'); //! es el tipo si es Estudiante o personal 
    //     $table->string('passwordPerfil')->nullable(); //!definiendo contraseña del perfil
    //     $table->timestamps();//! Revisa el tiempo de creacion 
    // });
        //
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
      //  Schema::dropIfExists('perfiles');//! En caso de hacer un rollback 
        //
    }
};
