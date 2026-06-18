<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            //? por si acaso 'materia' tampoco existiera todavía
            if (!Schema::hasColumn('users', 'materia')) {
                $table->string('materia')->nullable();
            }
            //! esto es lo que realmente falta: si es estudiante o no
            //* empieza en null = "todavía no configuró su perfil" (así sabemos si mandarlo a Onboarding)
            if (!Schema::hasColumn('users', 'es_estudiante')) {
                $table->boolean('es_estudiante')->nullable();
            }
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn('es_estudiante');
        });
    }
};
