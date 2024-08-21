<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 *  inquiriesテーブルに対応するモデルクラス
 *  メールフォームの名前とアドレスの処理をする
 */
class Inquiry extends Model
{
    use HasFactory;

    protected $table = 'inquiries';

    protected $fillable = [
        'name', // 名前
        'email', //メールアドレス
    ];
}
