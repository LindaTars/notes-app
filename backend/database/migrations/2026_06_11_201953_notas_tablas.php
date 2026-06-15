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
        //*Este contenido se usa para los valores de las tablas de la BD
        Schema::create('notas', function (Blueprint $table) {
        $table->id(); //! id de nota, se define asi para mayor pracicidad
        // !Conexión al perfil que creamos en el paso anterior
        $table->foreignId('perfil_id')->constrained('perfiles')->onDelete('cascade');
        
        //! Atributos para la tabla
        $table->string('nombreTarea'); //!nombre de la tarea
        $table->string('categoria'); //! Se coloca el tipo de tarea a realizar, proyecto, examnen u otro 
        $table->text('Descripcion'); //!Descripcion de la tarea 
        
        //! Campos opcionales  según el tipo de perfil
        $table->string('materia')->nullable(); //! Materia
        $table->date('fechaEntrega')->nullable(); //!es la fecha de entrega ya sea de un examen o proyecto 
        $table->date('fechaInicio')->nullable(); //!para almacenar la fecha de inicio 
        
        $table->timestamps(); //! Define los valores de tiempo fechas
    });
    }
    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('notas');//! En caso de rollback
        
    }
};
