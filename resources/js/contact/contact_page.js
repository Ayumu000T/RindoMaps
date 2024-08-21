'use strict';
{
    /**
     * メールフォーム必須項目の検証
     */
    function validateMailForm() {
        document.getElementById('mailForm').addEventListener('submit', function (event) {
            // 各フィールドのidとエラーメッセージ
            const fields = [
                { id: 'name', errorMessageId: 'nameErrorMessage', message: '「お名前」を入力してください。' },
                { id: 'email', errorMessageId: 'emailErrorMessage', message: '「メールアドレス」を入力してください。' },
                { id: 'message', errorMessageId: 'messageErrorMessage', message: '「内容」を入力してください。' }
            ];

            let hasError = false;

            // 各フィールドをチェック
            fields.forEach(field => {
                const inputValue = document.getElementById(field.id).value.trim();
                const errorMessage = document.getElementById(field.errorMessageId);

                if (!inputValue) {
                    errorMessage.textContent = field.message;
                    hasError = true;
                } else {
                    errorMessage.textContent = '';
                }
            });

            if (hasError) {
                event.preventDefault();
            }
        });
    }


    document.addEventListener('DOMContentLoaded', function () {
        // メールフォームの必須項目の検証
        validateMailForm();

        // セッションに 'status' が 'success' の場合にモーダルを表示
        const status = document.body.dataset.status;
        if (status === 'success') {
            const myModal = new bootstrap.Modal(document.getElementById('successModal'), {
                keyboard: false
            });
            myModal.show();
        }
    });
}
