{{-- タイトルと読み込むファイル --}}
@section('title', 'お問い合わせ')
@push('scripts')
    @vite(['resources/js/contact/contact_page.js'])
@endpush
@push('styles')
    @vite(['resources/css/styles.css'])
@endpush

{{-- body内のコンテンツ --}}
<x-layout>
    <header class="px-4 py-3 d-flex">
        <a href="{{ route('index') }}">
            <img class="d-none d-md-block" src="storage/header/rindo_map_logo.png" alt="" height="50">
            <img class="d-md-none" src="storage/header/rindo_map_logo_mini.png" alt="" height="40">
        </a>
    </header>

    <div class="mail_form container mt-5">
        <div class="row justify-content-center">
            <div class="text-center">
                <div class="mt-2">
                    <h1 class="mb-0">CONTACT</h1>
                    <p>お問い合わせ</p>
                </div>
                <div>
                    <img src="storage/header/contact_icon.png" width="100">
                </div>
                <form action="">
                    @csrf
                    <div class="d-flex flex-column mt-3">
                        <label class="align-self-start">お名前</label>
                        <input class="" type="text">
                    </div>
                    <div class="d-flex flex-column mt-3">
                        <label class="align-self-start">メールアドレス</label>
                        <input type="email">
                    </div>
                    <div class="d-flex flex-column mt-3">
                        <label class="align-self-start" >内容</label>
                        <textarea name="" id="" cols="30" rows="10"></textarea>
                    </div>
                    <div>
                        <div class="d-flex  mt-1">
                            <input class="me-1" type="checkbox" id="" name="" value="" checked>
                            <label >送信後に確認メールを受け取る</label>
                        </div>
                    </div>
                    <button class="col-4  mt-3">送信</button>
                </form>
            </div>
        </div>
    </div>
</x-layout>
