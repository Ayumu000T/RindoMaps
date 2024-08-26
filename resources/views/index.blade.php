{{-- タイトルと読み込むファイル --}}
@section('title', '林道マップ')
@push('scripts')
    @vite(['resources/js/main.js'])
@endpush
@push('styles')
    @vite(['resources/css/styles.css'])
@endpush

{{-- body内のコンテンツ --}}
<x-layout>

    <div class="container-fluid p-0 d-flex flex-column min-vh-100">
        <header class="px-4 py-3 d-flex justify-content-between">
            <h1 id="title" class="m-0 p-0">
                <a href="{{ route('index') }}">
                    <img class="d-none d-md-block" src="storage/header/rindo_map_logo.png" alt="" height="50">
                    <img class="d-md-none" src="storage/header/rindo_map_logo_mini.png" alt="" height="40">
                </a>
            </h1>
            <menu id="menu" class="my-0">
                <h3 id="about_rindo" class="m-0 p-0 d-none d-md-block">
                    <img src="storage/header/rindo_icon.png" class="" alt="" width="40">
                </h3>
                <h3 id="about_map" class="m-0 p-0 d-none d-md-block">
                    <img src="storage/header/map_icon.png" alt="" width="40">
                </h3>
                <h3 id="lets_go" class="m-0 p-0 d-none d-md-block">
                    <img src="/storage/header/helmet_icon.png" alt="" width="40">
                </h3>
                <h3 class="m-0 p-0 d-none d-md-block">
                    <a href="{{ route('contact') }}">
                        <img src="/storage/header/contact_icon.png" alt="" width="40">
                    </a>
                </h3>
                <h3 id="sp_menu_icon" class="m-0 p-0 d-md-none">
                    <i class="bi bi-three-dots-vertical"></i>
                </h3>
            </menu>
        </header>

        <div class="d-flex flex-column-reverse flex-md-row flex-grow-1">
            <div id="map" class="col-12 col-lg-10 col-md-9 order-1 order-md-1">
            </div>

            <div class="rindo col-12 col-lg-2 col-md-3 order-0 order-md-0">
                <form class="mt-3 ms-3" id="difficulty_form" method="POST">
                    @csrf
                    <div class="d-flex me-3">
                        <h5 class="col-6 ms-1">難易度</h5>
                        <select class="col-6" name="input_difficulty" id="difficulty_select">
                            <option value="selectAllDifficulty">指定無し</option>
                            @foreach ($allDifficulties as $difficultyOption)
                                <option value="{{ $difficultyOption->id }}">
                                    {{ $difficultyOption->display_difficulty }}
                                </option>
                            @endforeach
                        </select>
                    </div>
                </form>
                <form class="mt-1 ms-3" method="POST">
                    @csrf
                    <div class="d-flex me-3">
                        <h5 class="col-6 ms-1">都道府県</h5>
                        <select class="col-6" name="input_prefecture" id="prefecture_select">
                            <option value="selectAllPrefecture">指定無し</option>
                            @foreach ($allPrefectures as $prefectureOption)
                                <option value="{{ $prefectureOption->id }}">
                                    {{ $prefectureOption->display_prefecture_name }}
                                </option>
                            @endforeach
                        </select>
                    </div>
                </form>

                <div class="d-flex justify-content-center">
                    <button id="sort_reset" class="col-11 mt-2">リセット</button>
                </div>


                <div id="result" class="mt-2 mx-3">
                    <ul id="result_list">
                        @foreach ($spots as $spot)
                            <li id="spot_{{ $spot->id }}" class="spot_name py-2 ps-2"
                                data-id="{{ $spot->id }}"
                                data-coordinates="{{ $spot->coordinates }}"
                                data-difficulty="{{ $spot->difficulty_display }}"
                                data-image-url="{{ $spot->image_url }}" >
                                {{ $spot->name }}
                            </li>
                        @endforeach
                    </ul>
                </div>

                <div class="mt-2 ms-3 d-flex">
                    <p id="map_reset" class="m-0">マップに林道が表示されない場合</p>
                </div>
            </div>
        </div>
    </div>


    {{-- 詳細とヘッダーメニューの表示 --}}
    <div id="detail_container">
    </div>
    <div id="menu_container">
    </div>

    {{-- ロード画面のアニメーション --}}
    <div id="loader_container">
        <span id="loader" class="loader"></span>
        <p>読込み中...</p>
    </div>

    {{-- jsでメニュー生成時のcontactのURL --}}
    <script>
        const contactUrl = "{{ route('contact') }}";
    </script>

    <div id="google-maps-api-key" data-api-key="{{ config('services.google_maps.key') }}"></div>

</x-layout>
