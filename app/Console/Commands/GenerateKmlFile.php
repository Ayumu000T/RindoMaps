<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Storage;
use SimpleXMLElement;
use File;
use DOMDocument;
use DOMXPath;
use DB;

class GenerateKmlFile extends Command
{
    // 定数としてKMLファイルのURLを定義
    private const KML_URLS = [
        'https://www.google.com/maps/d/u/0/kml?forcekml=1&mid=1T0oMKSRVbGhwBW33mJuhVOo0-MGQeds&lid=7ynBOV8jQUo',
        'https://www.google.com/maps/d/u/0/kml?forcekml=1&mid=1T0oMKSRVbGhwBW33mJuhVOo0-MGQeds&lid=FHEwq7ut1X8',
        'https://www.google.com/maps/d/u/0/kml?forcekml=1&mid=1T0oMKSRVbGhwBW33mJuhVOo0-MGQeds&lid=rd6pvMc1c1c',
        'https://www.google.com/maps/d/u/0/kml?forcekml=1&mid=1T0oMKSRVbGhwBW33mJuhVOo0-MGQeds&lid=7SU8cepGjbg',
        'https://www.google.com/maps/d/u/0/kml?forcekml=1&mid=1T0oMKSRVbGhwBW33mJuhVOo0-MGQeds&lid=2_crKVxfQWY',
    ];

    protected $signature = 'kml:filter {--output=sorted.kml : The name of the output KML file}';
    protected $description = 'Filter multiple kml files and generate a kml file.';

    public function __construct()
    {
        parent::__construct();
    }

    public function handle()
    {
        // kmlファイルを生成するときのソート条件の配列と県のid1~5
        $conditions = [];
        $prefectures = range(1, 5);

        // 条件の配列を作成
        foreach ($prefectures as $prefecture_id) {
            $conditions[] = ['prefecture_id' => $prefecture_id,  'difficulty_id' => null];
            for ($difficulty_id = 1; $difficulty_id <= 5; $difficulty_id++) {
                $conditions[] = ['prefecture_id' => $prefecture_id, 'difficulty_id' => $difficulty_id];
            }
        }

        //  条件ごとにkmlを生成
        foreach ($conditions as $condition) {
            $difficulty = $condition['difficulty_id'] !== null ? "_{$condition['difficulty_id']}" : '';
            $outputFileName = "filtered_{$condition['prefecture_id']}{$difficulty}.kml";
            $outputFilePath = public_path('filtered_kml/' . $outputFileName);

            // 新しいKMLファイルの作成
            $filterdDocument = new DOMDocument();
            $filterdDocument->xmlVersion = '1.0';
            $filterdDocument->encoding = 'UTF-8';

            $kmlElement = $filterdDocument->createElement('kml');
            $kmlElement->setAttribute('xmlns', 'http://www.opengis.net/kml/2.2');
            $documentElement = $filterdDocument->createElement('Document');
            $kmlElement->appendChild($documentElement);
            $filterdDocument->appendChild($kmlElement);

            // データベースからフィルター条件を取得
            $query = DB::table('kml_data')->where('prefecture_id', $condition['prefecture_id']);

            if ($condition['difficulty_id'] !== null) {
                $query->where('difficulty_id', $condition['difficulty_id']);
            }

            $filterNames = $query->pluck('name')->toArray();

            if (empty($filterNames)) {
                $this->info("No matching Placemark found for prefecture {$condition['prefecture_id']} and difficulty {$condition['difficulty_id']}. KML file not generated.");
                continue; // 該当するPlacemarkがない場合は生成しない
            }

            foreach (self::KML_URLS as $url) {
                // KMLファイルの取得
                $kmlContent = file_get_contents($url);
                if ($kmlContent === false) {
                    $this->error("Failed to retrieve KML file from URL: $url");
                    continue;
                }

                $dom = new DOMDocument();
                $dom->loadXML($kmlContent);

                // 名前空間の取得
                $xpath = new DOMXPath($dom);
                $xpath->registerNamespace('kml', 'http://www.opengis.net/kml/2.2');

                // Style要素とStyleMap要素を取得して追加
                $styles = $xpath->query('//kml:Style | //kml:StyleMap');
                foreach ($styles as $style) {
                    $importedStyle = $filterdDocument->importNode($style, true);
                    $documentElement->appendChild($importedStyle);
                }

                // Placemark要素を取得
                $placemarks = $xpath->query('//kml:Placemark');

                foreach ($placemarks as $placemark) {
                    // nameタグのテキストを取得
                    $nameNode = $xpath->query('kml:name', $placemark)->item(0);
                    if ($nameNode) {
                        $name = trim($nameNode->textContent);

                        // データベースのフィルター条件と一致するか確認
                        if (in_array($name, $filterNames)) {
                            // Placemarkをコピー
                            $importedPlacemark = $filterdDocument->importNode($placemark, true);
                            $documentElement->appendChild($importedPlacemark);
                        }
                    }
                }
            }

            // 統合後のKMLファイルを保存
            if ($documentElement->childNodes->length > 0) {
                File::ensureDirectoryExists(public_path('sorted_kml'));
                $filterdDocument->save($outputFilePath);
                $this->info("Filterd KML file '$outputFileName' saved to 'public/sorted_kml' successfully.");
            } else {
                $this->info("No Placemark found for prefecture {$condition['prefecture_id']} and difficulty {$condition['difficulty_id']}. KML file not generated.");
            }
        }
    }
}
