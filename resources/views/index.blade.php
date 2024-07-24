
<x-layout>
    <div class="container-fluid p-0 d-flex flex-column min-vh-100">
        <header class="px-4 py-3">
            <h1 id="title" class="m-0 p-0"><a href="{{ route('index') }}"><img src="storage/header/rindo_map_logo.png" alt="" height="60"></a></h1>
            <menu id="menu" class="m-0">
                <h3 id="about_rindo" class="m-0 align-items-bottom"><img src="storage/header/rindo_icon.png" class="align-items-bottom" alt="" width="40"></h3>
                <h3 id="about_map" class="m-0 align-items-bottom"><img src="storage/header/map_icon.png" alt="" width="40"></h3>
                <h3 id="lets_go" class="m-0 align-items-bottom"><img src="/storage/header/helmet_icon.png" alt="" width="40"></h3>
            </menu>
        </header>

        <div class="maps d-flex flex-grow-1">
            <div class="rindo col-2">
                <form id="difficulty_form" method="POST">
                    @csrf
                    <div class="d-flex">
                        <h5 class="my-0 me-3">難易度</h5>
                        <select name="difficulty" id="difficulty_select" >
                            <option value="selectAllRindo">全ての林道</option>
                            @foreach ($allDifficulties as $difficultyOption)
                                <option value="{{ $difficultyOption->difficulty }}">
                                    {{ convertDifficultyToStar($difficultyOption->difficulty) }}
                                </option>
                            @endforeach
                        </select>
                    </div>
                </form>
                <div id="result" class="mt-3">
                    <ul id="result_list">
                        @foreach ($spots as $spot)
                            {{-- 林道のリスト --}}
                            <li class="spot_name my-2"
                                data-id="{{ $spot->id }}"
                                data-coordinates="{{ $spot->coordinates }}"
                                data-difficulty="{{ $spot->difficulty }}"
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
