<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <link rel="stylesheet" href="css/styles.css">
    <title>林道マップ</title>
     <meta name="csrf-token" content="{{ csrf_token() }}">
</head>
<body>
    <h1 id="title"><a href="{{ route('index') }}">林道マップ</a></h1>
    <div>
        <h3>難易度</h3>
        <ul>
            <li>★ 舗装林道など</li>
            <li>★★ フラットなダート</li>
            <li>★★★ 轍などがあり</li>
            <li>★★★★ 少しガレていたり、砕石が撒かれたり</li>
            <li>★★★★★道が細かったり斜度がキツイ</li>
        </ul>
    </div>
    

    <form id="difficulty_form" method="POST">
        @csrf
        <select name="difficulty" id="difficulty_select" onchange="submit">
            <option value="selectAllRindo">全ての林道</option>
            @foreach ($allDifficulties as $difficultyOption)
                <option  value="{{ $difficultyOption->difficulty }}">
                    {{ convertDifficultyToStar($difficultyOption->difficulty) }}
                </option>
            @endforeach
        </select>
    </form>

     <div class="maps">
        <div id="result">
            <span id="result_difficulty">選択中の難易度: 全ての林道</span>
            <ul id="result_list">
                @foreach ($spots as $spot)
                    <li class="spot_name" data-coordinates="{{ $spot->coordinates }}" data-description="{{$spot->description}}">
                        {{ $spot->name }}
                    </li>
                @endforeach
            </ul>
        </div>
        <div id="map"></div>
    </div>

<script src="js/main.js"></script>
<script defer src="https://maps.googleapis.com/maps/api/js?key=AIzaSyBtZ4_zOw1-S22OOtCsCbEj7susgXK1PtA&callback=initMap"></script>
</body>
</html>
