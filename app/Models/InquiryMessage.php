<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class InquiryMessage extends Model
{
    use HasFactory;

    protected $table = 'inquiry_messages'; //テーブル名

    protected $fillable = [
        'inquiry_id', //外部キー
        'message' //メッセージ内容
    ];


    public function inquiry()
    {
        return $this->belongsTo(Inquiry::class, 'inquiry_id');
    }
}
