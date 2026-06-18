<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;


class Nota extends Model
{  
    use HasFactory;
    //* se define el nombre de la tabla de postgres
    protected $table = 'notas';
    //* Definimos los campos que se deben de guardar desde el front 
    protected $fillable = [
        'user_id',
        'nombreTarea',
        'categoria',
        'fechaInicio',
        'fechaEntrega',
        'materia',
        'Descripcion'
    ];
//* Funcion para relacionar el notas con las Perfil, inversa
    public function user(){
      //*Se usa belongsTo para hacer que Nota pertenesca a Perfil espesifico usando su ID
        return $this->belongsTo(User::class, 'user_id');
        //return $this->belongsTo(User::class, 'user_id');
    }
}
