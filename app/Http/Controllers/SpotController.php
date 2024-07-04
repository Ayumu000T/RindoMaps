<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\KMLData;
use App\Helpers\DifficultyHelper;

class SpotController extends Controller
{
    //画像URLを生成して読み込み時にデータセットに渡す
    private function setImageUrl($spot)
    {
        $imagePath = 'storage/img/info_img_' . $spot->name . '.jpg';
        $imageExists = file_exists(public_path($imagePath));
        $spot->image_url = $imageExists ? asset($imagePath) : asset('storage/img/info_img_non.jpg');
        return $spot;
    }

    
    public function index()
    {
        $allDifficulties = KMLData::groupBy('difficulty')
            ->selectRaw('MIN(id) as id, difficulty')
            ->orderBy('difficulty', 'asc')
            ->get();

        $spots = KMLData::all()->map(function($spot) {
            return $this->setImageUrl($spot);
        });

        return view('index', [
            'spots' => $spots,
            'allDifficulties' => $allDifficulties
        ]);
    }


    public function handleFormApi(Request $request)
    {
        $difficulty = $request->input('difficulty');

        if ($difficulty === 'selectAllRindo') {
            $spots = KMLData::all()->map(function($spot) {
                return $this->setImageUrl($spot);
            });

            return response()->json([
                'spots' => $spots,
                'selectedDifficulty' => '全ての林道',
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

}
