<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\KML;
use App\Models\Difficulty;
use App\Models\Prefecture;
use App\Models\Description;
use Storage;
use DB;

/**
 * kmlファイルをDBにインポートするクラス
 * kmlファイルはGoogle My MapsからDLしてインポート用に編集してからstrage/app/kmlに配置
 * 挿入されたデータの使用用途
 * ・林道名のリスト表示
 * ・リストのソート(都道府県と難易度のソート)
 * ・Google Maps APIのInfoWindowをマップ上に表示するたの座標
 */
class InportKmlFileCommand extends Command
{

    protected $signature = 'kml-file:import'; //インポート時のコマンド
    protected $description = 'Import KML data into the database'; //コマンドの説明

    /**
     *既存データを削除して新しいデータを挿入する処理
     */
    public function handle()
    {
        // 外部キー制約を一時的に無効にする
        DB::statement('SET FOREIGN_KEY_CHECKS=0;');

        // 既存のデータを削除
        KML::truncate();
        Description::truncate();

        // 外部キー制約を再度有効にする
        DB::statement('SET FOREIGN_KEY_CHECKS=1;');

        /**
         * ディレクトリ内のすべてのkmlファイルを取得
         * ifで'.kml'であるかチェック
         * ファイルのフルパスを生成してimportKmlFileメソット呼び出し処理
         */
        $files = Storage::files('kml');
        foreach ($files as $file) {
            if (pathinfo($file, PATHINFO_EXTENSION) == 'kml') {
                $this->importKmlFile(storage_path('app/' . $file));
            }
        }

        //インポート成功時のメッセージ
        $this->info('KML data imported successfully!!!');
    }

    /**
     * .kmlファイルから必要データを取得して挿入データの作成挿入の処理
     */
    private function importKmlFile($filePath)
    {
        $contents = file_get_contents($filePath); //kmlファイルからXML文字列を取得
        $xml = simplexml_load_string($contents); //取得したXML文字列をXMLオブジェクト変換

        /**
         * Placemark内に必要なデータが入っている
         * name = 林道名
         * difficulty = 難易度(1~5)
         * prefecture = 都道府県(ローマ字)
         * coordinates = 座標
         * difficultyとprefectureはExtendedData内にあり０がdifficulty、１がprefecture
         */
        foreach ($xml->Document->Placemark as $placemark) {
            $name = trim((string) $placemark->name);
            $difficulty = isset($placemark->ExtendedData->Data[0]->value) ? trim((string) $placemark->ExtendedData->Data[0]->value) : 'Unknown';
            $prefecture = isset($placemark->ExtendedData->Data[1]->value) ? trim((string) $placemark->ExtendedData->Data[1]->value) : 'Unknown';
            $romaji_name = isset($placemark->ExtendedData->Data[2]->value) ? trim((string) $placemark->ExtendedData->Data[2]->value) : 'Unknown';
            $description = isset($placemark->description) ? trim(preg_replace('/\s+/', ' ', (string) $placemark->description)) : 'No description yet';
            $coordinates = trim(preg_replace('/\s+/', '', (string) $placemark->Point->coordinates));

            // 新しいデータを作成
            $kmlData = KML::create([
                'name' => $name,
                'romaji_name' => $romaji_name,
                'difficulty_id' => Difficulty::where('difficulty', $difficulty)->first()->id, //difficultiesテーブルから合致する難易度を選択
                'prefecture_id' => Prefecture::where('prefecture_name', $prefecture)->first()->id, //prefecturesテーブルから合致する都道府県を選択
                'coordinates' => $coordinates,
            ]);

            // Descriptionも作成
            Description::create([
                'kml_data_id' => $kmlData->id, //kml_dataテーブル内から合致するidを検索して選択
                'description' => $description,
            ]);
        }
    }
}
