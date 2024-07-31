<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;


class Prefecture extends Model
{
    use HasFactory;

    protected $table = 'prefectures'; //テーブル名

    protected $fillable = [
        'prefecture', //遠道府県ローマ字
        'display_prefecture' //遠道府県 漢字
    ];

    /**
     * KMLモデル
     * kml_dataテーブルとリレーション
     */
    public function kmls()
    {
        return $this->hasMany(KML::class, 'prefecture_id');
    }
}
