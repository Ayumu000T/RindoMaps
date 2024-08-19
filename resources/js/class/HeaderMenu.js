import { DetailWindow } from './DetailWindow.js';

//ヘッダー<header>に関するクラス
export class HeaderMenu {
    constructor() {
        this.detailContainer = document.getElementById('detail_container');
        this.menuContainer = document.getElementById('menu_container'); // 新しいコンテナ
        this.detailWindow = new DetailWindow();
    }

    /**
     * 指定されたIDに基づいて詳細コンテンツを表示する
     * @param {string} id - 表示するコンテンツのID
     */
    showContent(id) {
        // detailContainerの内容をクリアして新しいコンテンツを追加
        this.detailContainer.innerHTML = '';
        this.detailContainer.classList.add('appear');

        // IDに基づいて表示するコンテンツを切り替える
        switch (id) {
            case 'about_rindo':
            case 'about_map':
            case 'lets_go':
                this.renderExplain(id);
                break;
            default:
                // 該当するIDがない場合はページをリロード
                window.location.reload();
                break;
        }
    }

    // メニューアイテムのクリックイベントを設定
    clickMenuItems() {
        const menu = document.getElementById('menu');
        menu.addEventListener('click', (event) => {
            // 最も近い h3 要素を取得し、そのIDを使用してコンテンツを表示
            const target = event.target.closest('h3');
            if (target && target.id) {
                if (target.id === 'sp_menu_icon') {
                    this.showMenuSP();
                } else {
                    this.showContent(target.id);
                }
            }
        });
    }

    //spメニュー表示
    showMenuSP() {
        this.menuContainer.classList.add('appear');
        this.menuContainer.innerHTML = `
            <div class="menu_window overflow-auto">
                <div id="menu_close" onclick="document.getElementById('menu_container').classList.remove('appear')">
                    <span>X</span>
                </div>
                <menu class="sp_menu d-block p-0">
                    <h3 id="about_rindo_sp" class="my-5">
                        <img src="storage/header/rindo_icon.png" alt="" width="40">
                            林道とは？
                    </h3>
                    <h3 id="about_map_sp" class="my-5">
                        <img src="storage/header/map_icon.png" alt="" width="40">
                            マップについて
                    </h3>
                    <h3 id="lets_go_sp" class="my-5">
                        <img src="/storage/header/helmet_icon.png" alt="" width="40">
                            林道に行こう
                    </h3>
                    <h3 class="my-5">
                        <a href="${contactUrl}">
                            <img src="/storage/header/contact_icon.png" alt="" width="40">
                            お問い合わせ
                        </a>
                    </h3>
                </menu>
            </div>
        `;


        document.getElementById('about_rindo_sp').addEventListener('click', () => {
            this.detailContainer.classList.add('appear');
            this.renderExplain('about_rindo');
        });
        document.getElementById('about_map_sp').addEventListener('click', () => {
            this.detailContainer.classList.add('appear');
            this.renderExplain('about_map');
        });
        document.getElementById('lets_go_sp').addEventListener('click', () => {
            this.detailContainer.classList.add('appear');
            this.renderExplain('lets_go');
        });

        // // ウィンドウを閉じる
        this.menuWindowClose();
    }

    menuWindowClose() {
        const menuClose = document.getElementById('menu_close');
        const menuWindow = document.querySelector('.menu_window');

        const closeHandler = (event) => {
            if (!menuWindow.contains(event.target) || event.target === menuClose || event.target.closest('#menu_close')) {
                this.menuContainer.classList.remove('appear');
                this.menuContainer.innerHTML = '';
                menuClose.removeEventListener('click', closeHandler);
                this.menuContainer.removeEventListener('click', closeHandler);
            }
        };

        menuClose.addEventListener('click', closeHandler);
        this.menuContainer.addEventListener('click', closeHandler);
    }

    // 詳細コンテンツをレンダリングするメソッド
    renderExplain(id) {
        const text = this.text(id); // IDに基づいてテキストを取得
        this.detailContainer.innerHTML = `
            <div class="detail_window overflow-auto"">
                <div id="detail_close" onclick="document.getElementById('detail_container').classList.remove('appear')">
                    <span>X</span>
                </div>
                <img class="header_images"  src="storage/header/${id}.png" width="300">
                ${text}
            </div>
        `;

        // // ウィンドウを閉じる
        this.detailWindow.detailClose();
    }



    // 指定されたIDに基づいてテキストを取得
    text(id) {
        switch (id) {
            case 'about_rindo':
                return this.aboutRindoText();
            case 'about_map':
                return this.aboutMapText();
            case 'lets_go':
                return this.letsGoText();
            default:
                return '';
        }
    }

    //林道について
    aboutRindoText() {
        return `
            <div class="detail_container mt-2">
                <p class="text-start">
                    林道とは、林道規程に基づいて作られた道路で、一般道の国道や県道などと区別されています。
                    主に森林の管理保全や開拓のために使用したり、生活路や登山道に繋がる道として広く利用されています。
                    林道というと砂利道で未舗装という印象を持つ方も多いかもしれませんが、すべてがそうではありません。
                    全て舗装されている林道もあれば、未舗装路と舗装路が混ざった林道もあります。私が住む東京近郊では舗装路の方が多い印象があります。
                    ”林道”ではないが未舗装の道も多く存在しています。
                    当マップは”林道マップ”となっていますが、林道ではない未舗装の道などを紹介しています。
                </p>
                <div class="header_img d-md-flex justify-content-center mx-auto gap-4">
                    <div>
                        <img class="header_images" src="storage/header/about_rindo_2.jpg" width="330">
                        <p>舗装された林道</p>
                    </div>
                    <div>
                        <img class="header_images" src="storage/header/about_rindo_4.jpg" width="330">
                        <p>高知県中津明神山の林道</p>
                    </div>
                </div>
                <div class="header_img d-md-flex justify-content-center mx-auto gap-4">
                    <div>
                        <img class="header_images"  src="storage/header/about_rindo_1.jpg" width="330">
                        <p>秋田県の海岸沿いの見舗装路</p>
                    </div>
                    <div>
                        <img class="header_images"  src="storage/header/about_rindo_3.jpg" width="330">
                        <p>北海道稚内の白い道</p>
                    </div>
                </div>
            </div>
        `;
    }

    //マップについて
    aboutMapText() {
        return `
        <div class="detail_container">
            <p class="text-start mt-3">
                このマップは主に未舗装の林道を紹介しています(★１に関しては舗装林道等)。
                地図上のピンについては林道起点終点からではなくダート区間の始まりからの場合いもありますがご了承ください。
            </p>
            <div class="d-md-flex justify-content-center gap-4">
                <div class="header_img">
                    <img class="header_images"  src="storage/header/about_map_3.jpg" width="330">
                    <p>舗装林道からの景色</p>
                </div>
                <div class="header_img">
                    <img class="header_images"  src="storage/header/about_map_5.jpg" width="330">
                    <p>林道の起点標識</p>
                </div>
            </div>
            <h3 class="mt-3">難易度について</h3>
            <p class="text-start">
                私が実際に走った林道で独断と偏見で難易度を設定してあります。オフロード走行初心者やアドベンチャーバイクでの走行を想定しているので
                人によっては設定難易度より簡単に感じるかと思います。あくまで参考程度にして頂ければと思います。
            </p>
            <ul class="text-start list-unstyled">
                <li class="mt-4">★:&ensp;舗装林道や旧道。基本舗装されているが荒れている箇所もたまにある</li>
                <li class="mt-2">★★:&ensp;フラットダートで走りやすい林道</li>
                <li class="mt-2">★★★:&ensp;浅い轍(わだち)があったり路面がゴツゴツした箇所が多少ある</li>
                <li class="mt-2">★★★★:&ensp;走行可能な程度のガレ場があったり砕石が撒かれた道や、斜度がややある道</li>
                <li class="mt-2">★★★★★:&ensp;注意が必要なガレ場や斜度が少しキツく道が細い道</li>
            </ul>
            <div class="d-md-flex justify-content-center gap-4 mt-3">
                <div class="header_img">
                    <img class="header_images"  src="storage/header/about_map_4.jpg" width="330">
                    <p>剣山スーパー林道周辺</p>

                </div>
                <div class="header_img">
                    <img class="header_images"  src="storage/header/about_map_6.jpg" width="330">
                    <p>奥沢線の終点</p>
                </div>
            </div>
            <h3 class="mt-3">注意事項</h3>
            <p class="text-start">
                林道は大雨や雪など、天候の影響を受けやすいため、行く時期によって道の状況が変わることが多々あります。
                そのため、自治体の林道の通行止め情報やSNSで状況を確認した上で林道に行くことを強くお勧めします。
                また、当サイトに記載されている林道での事故やトラブルに関しては一切責任を負いかねますので、林道走行は自己責任でお願いします。
            </p>
            <div class="d-md-flex justify-content-center gap-4">
                <div class="header_img">
                    <img class="header_images"  src="storage/header/about_map_1.jpg" width="330">
                    <p>降雪後の林道</p>
                </div>
                <div class="header_img">
                    <img class="header_images"  src="storage/header/about_map_2.jpg" width="330">
                    <p>土砂崩れで行き止まり</p>
                </div>
            </div>
        </div>
        `;
    }

    //林道に行こう
    letsGoText() {
        return `
        <div class="detail_container">
            <p class="text-start">
                林道ツーリングに行く際の服装や持ち物、そもそもどんなバイクで行くかなどを軽く紹介します。
            </p>
            <h4>バイクの種類</h4>
            <p class="text-start">
                林道走るには絶対このバイクといった事はなく、自分がそのバイクを未舗装の道で扱えれば正直なんでもいいと思います。
                ただ一般的に林道向けのバイクといえばオフロードバイクやアドベンチャーバイク。またはHONDAハンターカブなども林道でよく見かけますね。
            </p>
            <p class="text-start">オフロードバイクのモデル例</p>
            <ul class="text-start">
                <li>YAMAHA SEROW250</li>
                <li>HONDA CRF250</li>
                <li>KAWASAKI KLX250</li>
            </ul>
            <p class="text-start">アドベンチャーバイクのモデル例</p>
            <ul class="text-start">
                <li>YAMAHA Ténéré700</li>
                <li>SUZUKI V-STROM 800DE</li>
                <li>HONDA CRF1100L Africa Twin</li>
            </ul>
            <p class="text-start">
                オフロードバイクとアドベンチャーバイクの違いは、簡単に言えばオフロードバイクはオフロード向けかつオンロード性能もそれなり、
                アドベンチャーバイクはオンロード向けではあるけどオフロードもそれなりに走れるっと言ったところです。車種によって性能が違うので一概には言えませんが。。。
                何に乗るかは自分のツーリングスタイルに合わせて選んだり体格に合わせて選びましょう。
            </p>
            <div class="d-md-flex justify-content-center gap-4">
                <div class="header_img">
                    <img class="header_images"  src="storage/header/lets_go_2.jpg" width="330">
                    <p>オフロードバイク SEROW250</p>
                </div>
                <div class="header_img">
                    <img class="header_images"  src="storage/header/lets_go_3.jpg" width="330">
                    <p>アドベンチャーバイク XT660Z Ténéré</p>
                </div>
            </div>

            <h4>服装とプロテクター</h4>
            <p class="text-start">
                服装に関しては人によって考え方は違うと思いますが、一般的にバイクに乗る格好(長袖長ズボン等)であればOK。
                ただ、林道などの見舗装路では転倒のリスクが高いのでプロテクター類を着用することをおすすめします。
                特に足はしっかり守ったほうが良いですね。スネまで守れるニーガードとハイカットなど足首が守れる靴。
                参考までに私が林道に行く際の装備は以下の物です。
            </p>
            <ul class="text-start">
                <li>オフロードヘルメット＋ゴーグル</li>
                <li>オフロードジャージ&パンツ(寒い時期はジャケットなど)</li>
                <li>チェストプロテクター</li>
                <li>ニーガード</li>
                <li>オフロードブーツ</li>
            </ul>
            <p class="text-start">
            </p>
            <div class="d-md-flex justify-content-center gap-4">
                <div class="header_img">
                    <img class="header_images"  src="storage/header/lets_go_1.jpg" width="330">
                    <p>ジャケットと冬用オフロードパンツ</p>
                </div>
                <div class="header_img">
                    <img class="header_images"  src="storage/header/lets_go_4.jpg" width="330">
                    <p>モトクロスジャージとパンツ</p>
                </div>
            </div>

            <h4>その他持ち物</h4>
            <p class="text-start">
                私が林道ツーリングに出かける際に持って行く物一覧。どこ行くにしても基本この荷物です。
            </p>
            <ul class="text-start">
                <li>工具類</li>
                <li>空気圧計と空気入れ</li>
                <li>救急キット</li>
                <li>水と軽食</li>
                <li>ライト</li>
                <li>スマホ</li>
                <li>現金</li>
                <li>GPSウォッチ</li>
                <li>雨具</li>
            </ul>

            <h5>工具類</h5>
            <p class="text-start">
                工具に関しては沢山持っていく人もいますが、私は車載工具＋αで十分だと思っています。
                最低限補修して帰宅出来る程度の工具があれば十分でパンク修理キット等は持って行きません。車載工具で締め付け等が出来ないパーツように別途準備するのがベター。
                一番使うのは結束バンドとダクトテープ。パーツが折れたり割れたりした場合よく使います。
            </p>

            <h5 class="">空気圧計と空気入れ</h5>
            <p class="text-start">
                林道を走る時にタイヤの空気圧を落とすために持って行きます。基本的にオフロード走行の際は規定空気圧より下げた方がグリップして走りやすいです。
                ただチューブタイヤでビートストッパーを入れてない場合は下げすぎるパンクするので注意。空気圧の例を挙げると以前乗っていたセロー250はフロント0.85キロリア0.6~0.8キロくらいで、
                現在乗っているxt660zだとフロントとリア共に2.0キロ(サービスマニュアルの推奨値)。
            </p>
            <div class="d-md-flex justify-content-center gap-4">
                <div class="header_img">
                    <img class="header_images"  src="storage/header/lets_go_5.jpg" width="330">
                    <p>空気圧計と空気入れ</p>
                </div>
                <div class="header_img">
                    <img class="header_images"  src="storage/header/lets_go_8.jpg" width="330">
                    <p>ダクトテープ</p>
                </div>
            </div>

            <h5 class="">救急キット</h5>
            <p class="text-start">
                Amazonで2000円くらいで売ってる救急キットがおすすめ。高価な物では無いのであると便利。虫刺され用にポイズンリムーバー入りの物がおすすめ。
            </p>

            <h5 class="">水と軽食</h5>
            <p class="text-start">
                オフロード走行は思ってるより体力を消耗します。なので飲み物は必須、軽食があればなお良し。人里に降りず山の中ずっと走ってると買い物できる場所は無いので山に入る前に準備しましょう。
                夏は塩分補給用に塩タブレットもおすすめ。
            </p>

            <h5 class="">ライト、スマホ、現金、GPSウォッチ</h5>
            <p class="text-start">
                スマホに関してはマップアプリにオフラインマップをDLしとくと便利。登山系のマップアプリなど林道も載っている場合があるのでおすすめ。オフラインマップさえDLしとけばGPSで現在地がわかるので便利。
                私は林道まではGoogle Mapsでナビで林道内はGPSウォッチで現在地を確認してます。次に現金について。田舎の方だと電子決済等が使えない場合があるので持っておいた方が良し。最後にライトに関しては薄暗い林道で
                バイクの補修などをする際に便利なので、登山用のヘッドライトを携帯しています。
            </p>
            <h5 class="">雨具</h5>
            <p class="text-start">
                降水確率が０％でも基本携帯してます。ツーリングのお守りみたいな物ですね。もちろん突然の雨の時には大活躍。
            </p>
            <div class="d-md-flex justify-content-center gap-4">
                <div class="header_img">
                    <img class="header_images"  src="storage/header/lets_go_7.jpg" width="330">
                    <p>GPSウォッチ</p>
                </div>
                <div class="header_img">
                    <img class="header_images"  src="storage/header/lets_go_6.jpg" width="330">
                    <p>救急キット</p>
                </div>
            </div>


            <h4>林道ツーリングに行こう！</h4>
            <p class="text-start">
                準備ができたら林道の下調べをして出発！帰るまでがツーリング、無理せず楽しみましょう！ご安全に！
            </p>
        </div>
        `;
    }
}

