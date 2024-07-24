<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\KMLData;
use App\Helpers\DifficultyHelper;
use App\Helpers\PrefectureHelper;

class SpotController extends Controller
{
    //画像URLを生成して読み込み時にデータセットに渡す
    private function setImageUrl($spot)
    {
        $imagePath = 'storage/img/info_img_' . $spot->name . '.jpg';
        $imageExists = file_exists(public_path($imagePath));
        $spot->image_url = $imageExists ? asset($imagePath) : asset('storage/img/info_no_img.jpg');
        return $spot;
    }

    //初期ロード時の表示
    public function index()
    {
        //難易度
        $allDifficulties = KMLData::groupBy('difficulty')
            ->selectRaw('MIN(id) as id, difficulty')
            ->orderBy('difficulty', 'asc')
            ->get();

        //都道府県
        $allPrefectures = KMLData::groupBy('prefecture')
            ->selectRaw('MIN(id) as id, prefecture')
            ->orderBy('prefecture', 'asc')
            ->get();

        $spots = KMLData::all()->map(function($spot) {
            return $this->setImageUrl($spot);
        });

        return view('index', [
            'spots' => $spots,
            'allDifficulties' => $allDifficulties,
            'allPrefectures' => $allPrefectures,
        ]);
    }


    public function handleFormDifficulty(Request $request)
    {
        $difficulty = $request->input('difficulty');

        if ($difficulty === 'selectAllDifficulty') {
            $spots = KMLData::all()->map(function($spot) {
                return $this->setImageUrl($spot);
            });

            return response()->json([
                'spots' => $spots,
                'selectedDifficulty' => '指定無し',
            ]);

        } else {
            $spots = KMLData::where('difficulty', $difficulty)->get()->map(function($spot) {
                return $this->setImageUrl($spot);
            });

            return response()->json([
                'spots' => $spots,
                'selectedDifficulty' => $difficulty,
            ]);
        }
    }

    public function handleFormPrefecture(Request $request)
    {
        $prefecture = $request->input('prefecture');

        if ( $prefecture === 'selectAllPrefecture') {
            $spots = KMLData::all()->map(function($spot) {
                return $this->setImageUrl($spot);
            });

            return response()->json([
                'spots' => $spots,
                'selectedPrefecture' => '指定無し',
            ]);
        } else {
            $spots = KMLData::where('prefecture', $prefecture)->get()->map(function($spot) {
                return $this->setImageUrl($spot);
            });

            return response()->json([
                 'spots' => $spots,
                 'selectedPrefecture' => $prefecture,
            ]);
        }
    }
}
