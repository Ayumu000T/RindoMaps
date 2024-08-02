
<x-layout>
    <div class="container-fluid p-0 d-flex flex-column min-vh-100">
        <header class="px-4 py-3">
            <h1 id="title" class="m-0 p-0">
                <a href="{{ route('index') }}">
                    <img class="" src="storage/header/rindo_map_logo.png" alt="" height="60">
                </a>
            </h1>
            <menu id="menu" class="my-0">
                <h3 id="about_rindo" class="m-0 p-0">
                    <img src="storage/header/rindo_icon.png" class="" alt="" width="40">
                </h3>
                <h3 id="about_map" class="m-0 p-0">
                    <img src="storage/header/map_icon.png" alt="" width="40">
                </h3>
                <h3 id="lets_go" class="m-0 p-0">
                    <img src="/storage/header/helmet_icon.png" alt="" width="40">
                </h3>
            </menu>
        </header>

        <div class="maps d-flex flex-grow-1">
            <div class="rindo col-2">
                {{-- 難易度を選択 --}}
                <form class="mt-2 ms-3" id="difficulty_form" method="POST">
                    @csrf
                    <div class="d-flex">
                        <h5 class="col-4">難易度</h5>
                        <select class="col-4" name="input_difficulty" id="difficulty_select" >
                            <option value="selectAllDifficulty">指定無し</option>
                            @foreach ($allDifficulties as $difficultyOption)
                                <option value="{{ $difficultyOption->id }}">
                                    {{ $difficultyOption->display_difficulty }}
                                </option>
                            @endforeach
                        </select>
                    </div>
                </form>
                {{-- 都道府県を選択 --}}
                <form class="mt-1 ms-3" method="POST">
                    @csrf
                    <div class="d-flex">
                        <h5 class="col-4">都道府県</h5>
                        <select class="col-4" name="input_prefecture" id="prefecture_select">
                            <option value="selectAllPrefecture">指定無し</option>
                            @foreach ($allPrefectures as $prefectureOption)
                                <option value="{{ $prefectureOption->id }}">
                                    {{ $prefectureOption->display_prefecture }}
                                </option>
                            @endforeach
                        </select>
                    </div>
                </form>
                {{-- 林道のリスト --}}
                <div id="result" class="mt-2 mx-3">
                    <ul id="result_list">
                        @foreach ($spots as $spot)
                            <li class="spot_name py-2 ps-2"
                                data-id="{{ $spot->id }}"
                                data-coordinates="{{ $spot->coordinates }}"
                                data-difficulty="{{ $spot->difficulty_display }}"
                                data-image-url="{{  $spot->image_url }}">
                                {{ $spot->name }}
                            </li>
                        @endforeach
                    </ul>
                </div>
            </div>
            <div id="map" class="col-10"></div>
        </div>
    </div>

    {{-- 詳細とヘッダーメニューの表示 --}}
    <div id="detail_container">
    </div>

<div id="google-maps-api-key" data-api-key="{{ config('services.google_maps.key') }}"></div>

</x-layout>
