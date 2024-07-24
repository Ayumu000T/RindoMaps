<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class KMLData extends Model
{
    use HasFactory;

    protected $table = 'kml';

    protected $fillable = [
        'name',
        'difficulty',
        'description',
        'coordinates',
        'prefecture',
    ];
}
