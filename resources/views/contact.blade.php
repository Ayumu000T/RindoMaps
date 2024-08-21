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

                <form id="mailForm" action="{{ route('contact.submitFrom') }}" method="POST">
                    @csrf
                    <div class="d-flex flex-column mt-3">
                        <label class="align-self-start" for="name">お名前（必須）</label>
                        <input class="form-control" type="text" id="name" name="name" autocomplete="off">
                        <div class="align-self-start" id="nameErrorMessage" style="color: red;"></div>
                    </div>
                    <div class="d-flex flex-column mt-3">
                        <label class="align-self-start" for="email">メールアドレス（必須）</label>
                        <input type="email" id="email" name="email" autocomplete="off">
                        <div class="align-self-start" id="emailErrorMessage" style="color: red;"></div>
                    </div>
                    <div class="d-flex flex-column mt-3">
                        <label class="align-self-start" for="message">内容（必須）</label>
                        <textarea name="message" id="message" cols="30" rows="10"></textarea>
                        <div class="align-self-start" id="messageErrorMessage" style="color: red;"></div>
                    </div>
                    <div>
                        <div class="d-flex mt-1">
                            <input class="me-1" type="checkbox" id="sendConfirmationEmail" name="sendConfirmationEmail" value="1" checked>
                            <label for="sendConfirmationEmail">送信後に確認メールを受け取る</label>
                        </div>
                    </div>
                    <button class="col-4  mt-3">送信</button>
                </form>

            </div>
        </div>
    </div>


    <!-- モーダル本体 -->
    <div class="modal fade" id="successModal" tabindex="-1" aria-labelledby="successModalLabel" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header pb-0">
          </div>
          <div class="modal-body d-flex flex-column align-items-center">
            <div>
                <img class="modal_img" src="storage/header/thankyou.png" alt="" width="400">
            </div>
            <p class="mt-4">送信が完了しました。<br>お問い合わせいただき、ありがとうございました。</p>
          </div>
          <div class="modal-footer pt-0">
            <button type="button" class="btn btn-secondary mx-auto" data-bs-dismiss="modal">閉じる</button>
          </div>
        </div>
      </div>
    </div>

</x-layout>

<script>
    document.body.dataset.status = "{{ session('status') }}";
</script>
