<?php

namespace App\Http\Controllers;

use App\Models\KML;
use App\Models\Difficulty;
use App\Models\Description;
use Illuminate\Http\Request;

class DetailController extends Controller
{
    /**
     * 詳細ページのデータを取得し、JSON形式で返す。
     *
     * @param int $id 林道名のID
     * @return \Illuminate\Http\JsonResponse 詳細データを含むJSONレスポンス
     */
    public function detail($id)
    {
        $spot = KML::with('description')->findOrFail($id); // 林道の情報と子テーブルから説明(description)を取得
        $this->setImageUrl($spot); // 画像URLを設定
        $difficulty = Difficulty::where('id', $spot->difficulty_id)->first(); //難易度を取得
        $spot->display_difficulty = $difficulty ? $difficulty->display_difficulty : '未設定'; //難易度のデータがあればそれを、なければ未設定と表示

        // 林道の詳細情報をJSON形式で返す
        return response()->json([
            'name' => $spot->name, //林道名
            'display_difficulty' => $spot->display_difficulty, //難易度
            'description' => $spot->description->description ?? '準備中', // 説明文があれば表示、なければ準備中を表示
            'image_urls' => $spot->image_urls, // 画像のURL
        ]);
    }


    /**
     *  詳細ウィンドウに表示する画像URLを設定。
     *
     *  @param \App\Models\KML $spot spot(KML)のインスタンス
     *  @return void
     */
    private function setImageUrl($spot)
    {
        // 最大画像数の設定
        $maxImages = 3;
        $imagePaths = [];

        // 画像のパスをループで生成し、存在する画像のURLを追加
        for ($i = 1; $i <= $maxImages; $i++) {
            $imagePath = 'storage/detail_img/detail_img_' . $spot->romaji_name . '_' . $i .'.jpg';

            // 画像がある場合はURLをimagePaths[]に追加
            if (file_exists(public_path($imagePath))) {
                $imagePaths[] = asset($imagePath);
            }
        }

        //画像がある場合はspotにURLの情報を追加
        if (!empty($imagePaths)) {
            $spot->image_urls = $imagePaths;
        } else {
            $spot->image_urls = [];
        }
    }

}
