
<x-layout>
    <header>
        <h1 id="title"><a href="{{ route('index') }}">林道マップ</a></h1>
        <menu>
            <h3><a href="#">林道とは？</a></h3>
            <h3><a href="#">マップについて</a></h3>
            <h3><a href="#">林道に行こう！</a></h3>
        </menu>
    </header>



    <div class="maps">
        <div class="rindo">
            <form id="difficulty_form" method="POST">
                @csrf
                <select name="difficulty" id="difficulty_select" >
                    <option value="selectAllRindo">全ての林道</option>
                    @foreach ($allDifficulties as $difficultyOption)
                        <option  value="{{ $difficultyOption->difficulty }}">
                            {{ convertDifficultyToStar($difficultyOption->difficulty) }}
                        </option>
                    @endforeach
                </select>
            </form>
            <div id="result">
                <span id="result_difficulty">選択中の難易度: 全ての林道</span>
                <ul id="result_list">
                    @foreach ($spots as $spot)
                        {{-- 林道のリスト --}}
                        <li class="spot_name"
                            data-id="{{ $spot->id }}"
                            data-coordinates="{{ $spot->coordinates }}"
                            {{-- data-description="{{ $spot->description }}" --}}
                            data-difficulty="{{ $spot->difficulty }}"
                            data-image-url="{{  $spot->image_url }}">
                            {{ $spot->name }}
                        </li>
                    @endforeach
                </ul>
            </div>
        </div>
        <div id="map"></div>
    </div>




    <div id="detail_container">

    </div>

    <script src="js/main.js"></script>
    <script async defer src="https://maps.googleapis.com/maps/api/js?key=AIzaSyBtZ4_zOw1-S22OOtCsCbEj7susgXK1PtA&callback=initMap"></script>
</x-layout>
