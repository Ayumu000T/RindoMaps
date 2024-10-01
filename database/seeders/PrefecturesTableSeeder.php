<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

/**
 * prefecturesテーブルのデータ内容
 * DatabaseSeeder.phpで呼び出してDBに挿入
 */
class PrefecturesTableSeeder extends Seeder
{
    public function run()
    {
        DB::table('prefectures')->insert([
            ['prefecture_name' => 'Tokyo', 'display_prefecture_name' => '東京都','created_at' => Carbon::now(), 'updated_at' => Carbon::now()],
            ['prefecture_name' => 'Saitama', 'display_prefecture_name' => '埼玉県','created_at' => Carbon::now(), 'updated_at' => Carbon::now()],
            ['prefecture_name' => 'Gunma', 'display_prefecture_name' => '群馬県','created_at' => Carbon::now(), 'updated_at' => Carbon::now()],
            ['prefecture_name' => 'Yamanashi', 'display_prefecture_name' => '山梨県','created_at' => Carbon::now(), 'updated_at' => Carbon::now()],
            ['prefecture_name' => 'Nagano', 'display_prefecture_name' => '長野県','created_at' => Carbon::now(), 'updated_at' => Carbon::now()],
        ]);
    }
}
