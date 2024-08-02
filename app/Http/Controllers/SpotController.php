<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\KML;
use App\Models\Difficulty;
use App\Models\Prefecture;
use App\Helpers\DifficultyHelper;
use App\Helpers\PrefectureHelper;

class SpotController extends Controller
{
    /**
     * infoWindowに表示する画像のURLを生成して渡す
     *   infoWindow用の画像は'storage/app/public/imgに配置
     *   画像URLの例:"info_img_林道名.jpg"、該当画像が無い場合は"info_no_img.jpg"を指定
     */
    private function setImageUrl($spot)
    {
        // 画像URL
        $imagePath = 'storage/img/info_img_' . $spot->name . '.jpg';
        // 画像URLが存在するか確認
        $imageExists = file_exists(public_path($imagePath));
        // URLが存在しない場合は”準備中...”の画像URLを指定
        $spot->image_url = $imageExists ? asset($imagePath) : asset('storage/img/info_no_img.jpg');
        return $spot;
    }

    /**
     * 初期ロード後ブラウザに表示するために必要な情報
     *   $spots = 林道名をリスト表示とデータセット
     *   $allDifficulties = ドロップダウンリストに難易度の一覧を表示と林道名のデータセットに一部使用
     *   $allPrefectures = ドロップダウンリストに都道府県の一覧を表示
     */
    public function index()
    {
        //林道名
        $spots = KML::all()->map(function($spot) {
            return $this->setImageUrl($spot);
        });

        // 難易度
        $allDifficulties = Difficulty::select('id', 'display_difficulty')->get()->keyBy('id');

        // 都道府県
        $allPrefectures = Prefecture::all(['id','display_prefecture']);

        return view('index', [
            'spots' => $spots, // 林道名
            'allDifficulties' => $allDifficulties, // 難易度
            'allPrefectures' => $allPrefectures, // 都道府県
        ]);
    }

    /**
     * $spotの共通情報を設定するメソッド
     *   handleFormDifficultyとhandleFormPrefectureのメソッド内で使用
     *   内容
     *      setImageUrl = infoWindowの画像表示用のURL
     *      $difficulty = KMLテーブルの難易度IDに基づいて、Difficultyテーブルから対応するレコードを取得
     *      難易度が存在すれば、その難易度を設定、なければ'未設定'を設定
     */
    private function setSpotInfo($spot)
    {
        $this->setImageUrl($spot); // 画像URL
        $difficulty = Difficulty::where('id', $spot->difficulty_id)->first(); // Difficultyテーブルから対応するレコードを取得
        $spot->display_difficulty = $difficulty ? $difficulty->display_difficulty : '未設定'; // 難易度が存在したら設定
        return $spot;
    }

    /**
     * 難易度(difficulty)を選択して、林道名のリストをソート
     *   DifficultySelecter.jsのメソッドfetchDifficultyData()からのリクエストにjsonで返す
     *   selectAllDifficultyの場合はソート無しの全ての林道を表示
     *   難易度が選択されたらsetSpotInfo($spot)の情報を返す
     */
    public function handleFormDifficulty(Request $request)
    {
        // フォームから送信された難易度を取得
        $difficulty = $request->input('input_difficulty');

        // "指定無し"を選択した場合
        if ($difficulty === 'selectAllDifficulty') {
            $spots = KML::all()->map(function($spot) {
                return $this->setSpotInfo($spot);
            });

            return response()->json([
                'spots' => $spots,
            ]);
        //  難易度を選択した場合
        } else {
            $spots = KML::where('difficulty_id', $difficulty)->get()->map(function($spot) {
                return $this->setSpotInfo($spot);
            });

            return response()->json([
                'spots' => $spots,
            ]);
        }
    }

    /**
     * 難易度(difficulty)を選択して、林道名のリストをソート
     *   DifficultySelecter.jsのメソッドfetchPrefectureData()からのリクエストにjsonで返す
     *   selectAllDifficultyの場合はソート無しの全ての林道を表示
     *   難易度が選択されたらsetSpotInfo($spot)の情報を返す
     */
    public function handleFormPrefecture(Request $request)
    {
        // フォームから送信された難易度を取得
        $prefecture = $request->input('input_prefecture');

        // "指定無し"を選択した場合
        if ( $prefecture === 'selectAllPrefecture') {
            $spots = KML::all()->map(function($spot) {
                return $this->setSpotInfo($spot);
            });

            return response()->json([
                'spots' => $spots,
            ]);
        //  難易度を選択した場合
        } else {
            $spots = KML::where('prefecture_id', $prefecture)->get()->map(function($spot) {
                return $this->setSpotInfo($spot);
            });

            return response()->json([
                 'spots' => $spots,
            ]);
        }
    }

}
