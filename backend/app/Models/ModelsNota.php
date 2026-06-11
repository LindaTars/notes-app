<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;


class Nota extends Model
{  
    use HasFactory;
    //* se define el nombre de la tabla de postgres
    protected $table = 'Notas';
    //* Definimos los campos que se deben de guardar desde el front 
    protected $fillable = [
        'idNota',
        'perfil_id',
        'nombreTarea',
        'categoria',
        'fechaInicio',
        'fechaEntrega',
        'materia',
        'Decripcion'
    ];

//* Funcion para relacionar el notas con las Perfil, inversa
    protected function notas(){
      //*Se usa belongsTo para hacer que Nota pertenesca a Perfil espesifico usando su ID
        return $this-> belongsTo(Perfil::class, 'perfil_id');
    }
}
