<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Description extends Model
{
    use HasFactory;

    protected $table = 'descriptions'; //テーブル名

    protected $fillable = [
        'kml_data_id', //外部キー
        'description' //説明文
    ];

    /**
     * KMLモデル
     * kml_dataテーブルとリレーション
     */
    public function kml()
    {
        return $this->belongsTo(KML::class, 'kml_data_id');
    }
}
