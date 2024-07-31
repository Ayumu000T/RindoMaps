<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;


class DatabaseSeeder extends Seeder
{
    /**
     * テーブルにデータを挿入
     */
    public function run(): void
    {
        $this->call([
            DifficultiesTableSeeder::class, //difficulties(難易度)テーブルへ
            PrefecturesTableSeeder::class,  //prefectures(都道府県)テーブルへ
        ]);
    }
}
