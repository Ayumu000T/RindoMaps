<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Difficulty extends Model
{
    use HasFactory;

    protected $table = 'difficulties'; //テーブル名

    protected $fillable = [
        'difficulty', //難易度
        'display_difficulty' //難易度の★表示
    ];

    /**
     * KMLモデル
     * kml_dataテーブルとリレーション
     */
    public function kmls()
    {
        return $this->hasMany(KML::class, 'difficulty_id');
    }
}
