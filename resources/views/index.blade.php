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
        </ul>
    </div>


    <form id="difficulty_form" method="POST">
        @csrf
        <select name="difficulty" id="difficulty_select" onchange="submit">
            <option value="" hidden>--選択してください--</option>
            <option value="selectAllDifficulties">全ての林道</option>
            @foreach ($allDifficulties as $difficultyOption)
                <option  value="{{ $difficultyOption->difficulty }}">
                    {{ convertDifficultyToStar($difficultyOption->difficulty) }}
                </option>
            @endforeach
        </select>
    </form>

     <div class="maps">
        <iframe src="https://www.google.com/maps/d/embed?mid=1T0oMKSRVbGhwBW33mJuhVOo0-MGQeds&hl=ja&ehbc=2E312F" width="640" height="480"></iframe>
        {{-- <div id="">
            @if (isset($selectedDifficulty))
                <h3 id="rindo_Difficulty">難易度{{ convertDifficultyToStar($selectedDifficulty) }}の林道</h3>
            @endif

            @if (isset($spots) && count($spots) > 0 && $selectedDifficulty !== null)
                <ul id="rindo_list">
                    @foreach ($spots as $spot)
                        <li>{{ $spot->name }}</li>
                    @endforeach
                </ul>
            @endif
        </div> --}}
        <div id="result">
            <span id="result_difficulty">選択中の難易度:</span>
            <ul id="result_list"></ul>
        </div>
    </div>

<script src="js/main.js"></script>
</body>
</html>
