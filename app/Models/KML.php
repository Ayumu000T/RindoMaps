<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * KMLモデル
 * kml_dataテーブルに対応するモデルクラス
 */
class KML extends Model
{
    use HasFactory;

    protected $table = 'kml_data'; //テーブル名

    protected $fillable = [
        'name', //林道名
        'coordinates',  //座標
        'difficulty_id', //難易度の外部キー
        'prefecture_id', //都道府県の外部キー
        'romaji_name' //ローマ字名
    ];

    /**
     * Difficultyモデル
     * kml_dataテーブルが属するdifficultiesテーブルとのリレーション
     */
    public function difficulty()
    {
        return $this->belongsTo(Difficulty::class);
    }

    /**
     * Prefectureモデル
     * kml_dataテーブルが属するPrefecturesテーブルとのリレーション
     */
    public function prefecture()
    {
        return $this->belongsTo(Prefecture::class);
    }

    /**
     * Descriptionモデル
     * kml_dataが持つ子テーブルdescriptionsテーブルとのリレーション
     */
    public function description()
    {
        return $this->hasOne(Description::class, 'kml_data_id');
    }
}
