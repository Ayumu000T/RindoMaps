<?php

namespace App\Http\Controllers;

use App\Models\KMLData;
use Illuminate\Http\Request;

class DetailController extends Controller
{
    public function detail($id)
    {
        $spot = KMLData::findOrFail($id);
        $this->setImageUrl($spot);

        return response()->json($spot);
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
