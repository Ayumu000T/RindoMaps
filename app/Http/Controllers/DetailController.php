<?php

namespace App\Http\Controllers;

use App\Models\KML;
use App\Models\Difficulty;
use App\Models\Description;
use Illuminate\Http\Request;

class DetailController extends Controller
{
    public function detail($id)
    {
        $spot = KML::with('description')->findOrFail($id); // リレーション名を `description` に修正
        $this->setImageUrl($spot);
        $difficulty = Difficulty::where('id', $spot->difficulty_id)->first();
        $spot->display_difficulty = $difficulty ? $difficulty->display_difficulty : '未設定';

        return response()->json([
            'name' => $spot->name,
            'display_difficulty' => $spot->display_difficulty,
            'description' => $spot->description->description ?? '準備中', // リレーション名に合わせて修正
            'image_urls' => $spot->image_urls, // 必要に応じて設定
        ]);
    }

    //詳細に表示する追加画像URL
    private function setImageUrl($spot)
    {
        $maxImages = 3;
        $imagePaths = [];

        for ($i = 1; $i <= $maxImages; $i++) {
            $imagePath = 'storage/detail_img/detail_img_' . $spot->name . '_' . $i .'.jpg';
            if (file_exists(public_path($imagePath))) {
                $imagePaths[] = asset($imagePath);
            }
        }

        if (!empty($imagePaths)) {
            $spot->image_urls = $imagePaths;
        } else {
            $spot->image_urls = [];
        }
    }

}
