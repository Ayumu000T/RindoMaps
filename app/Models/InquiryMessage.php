<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * inquiry_messagesテーブルに対応するモデルクラス
 * メールフォームのメッセージ内容を処理
 */
class InquiryMessage extends Model
{
    use HasFactory;

    protected $table = 'inquiry_messages'; //テーブル名

    protected $fillable = [
        'inquiry_id', //外部キー
        'message' //メッセージ内容
    ];


    /**
     * Inquiryモデル
     * inquiriesテーブルとリレーション
     */
    public function inquiry()
    {
        return $this->belongsTo(Inquiry::class, 'inquiry_id');
    }
}
