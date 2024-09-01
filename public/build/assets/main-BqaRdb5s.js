class g{constructor(){this.kmlLayerURLS={},this.difficultyURLS={}}async fetchKmlUrls(){try{const a=await(await fetch("/get-kml-urls")).json();this.kmlLayerURLS=a,this.difficultyURLS=this.createDifficultyURLS()}catch(e){console.error("KML URLの取得に失敗しました:",e)}}createDifficultyURLS(){const e={};return Object.keys(this.kmlLayerURLS).forEach(a=>{const t=a.replace("difficulty","");e[t]=this.kmlLayerURLS[a]}),e}async fetchAndSaveKmls(){let a=!0;for(let t=1;t<=5;t++)if(!sessionStorage.getItem(`kml${t}`)){a=!1;break}if(!a)try{const t=await fetch("/kml-urls");if(!t.ok)throw new Error(`Failed to fetch KML URLs: ${t.statusText}`);const s=await t.json(),i=Object.values(s),l=await Promise.all(i.map(r=>fetch(`/fetch-kml?kmlUrl=${encodeURIComponent(r)}`)));(await Promise.all(l.map(r=>{if(!r.ok)throw new Error(`HTTP error! Status: ${r.status}`);return r.text()}))).forEach((r,o)=>{sessionStorage.setItem(`kml${o+1}`,r)})}catch(t){console.error("Failed to fetch KML:",t)}}extractPlacemarksFromKml(e){const a=["kml1","kml2","kml3","kml4","kml5"],t={},s=[];a.forEach(l=>{const n=sessionStorage.getItem(l);if(n){const o=new DOMParser().parseFromString(n,"application/xml"),h=o.getElementsByTagName("Style"),c=o.getElementsByTagName("StyleMap");Array.from(h).forEach(m=>{t[m.id]=new XMLSerializer().serializeToString(m)}),Array.from(c).forEach(m=>{t[m.id]=new XMLSerializer().serializeToString(m)});const p=o.getElementsByTagName("Placemark");Array.from(p).forEach(m=>{s.push(m)})}});const i=[];return e.spots.forEach(l=>{for(let n=0;n<s.length;n++){const r=s[n].getElementsByTagName("name")[0];r&&r.textContent.replace(/\s+/g,"")===l.name.replace(/\s+/g,"")&&i.push(s[n])}}),{filteredPlacemarks:i,styleMap:t}}createKmlFromPlacemarks(e,a){if(!e||e.length===0){if(console.error("No placemarks to create KML."),!confirm("マップの読み込みに失敗しました。ページを更新しますか？(更新推奨)"))return;window.location.reload()}const t=`<?xml version="1.0" encoding="UTF-8"?>
        <kml xmlns="http://www.opengis.net/kml/2.2">
        <Document>`,s="</Document></kml>";let i="";Object.values(a).forEach(n=>{i+=n}),e.forEach(n=>{i+=new XMLSerializer().serializeToString(n)});const l=t+i+s;return new Blob([l],{type:"application/vnd.google-earth.kml+xml"})}async generateKmlUrl(e){const{filteredPlacemarks:a,styleMap:t}=this.extractPlacemarksFromKml(e),s=this.createKmlFromPlacemarks(a,t),i=e.spots[0].prefecture,n=document.getElementById("difficulty_select").value,r=await this.fetchHttpSever(s),o=`D: ${n}, P: ${i}`;return localStorage.setItem(o,r),r}async fetchHttpSever(e){const a=new FormData;a.append("kmlFile",e,"filteredData.kml");try{const t=await fetch("http://localhost:3000/filtered-data",{method:"POST",body:a});if(t.ok){const s=await t.json();return console.log("KML file successfully uploaded."),s.fileUrl}else return console.error("Failed to upload KML file. Status:",t.status),null}catch(t){return console.error("Error uploading KML file:",t),null}}async fetchDeleteKml(e){const a={kmlFileUrl:e};try{const t=await fetch("http://localhost:3000/delete-kml",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(a)});t.ok?console.log("kml file in the server has been deleted."):console.error("Failed to delete KML file. Status:",t.status)}catch(t){console.error("Error deleting KML file:",t)}}}class f{constructor(){this.detailContainer=document.getElementById("detail_container")}async showDetail(e,a){this.detailContainer.classList.add("appear");const t=`/detail/${e}`;try{const s=await fetch(t);if(!s.ok)throw new Error("Network response was not ok");const i=await s.json();this.renderDetail(i,a)}catch(s){console.error("詳細ページ取得エラー:",s)}}renderDetail(e,a){const t=e.image_urls.map(s=>`<div class="swiper-slide"><img src="${s}" width="500"></div>`).join(" ");this.detailContainer.innerHTML=`
            <div class="detail_window">
                <div id="detail_close">
                    <span>x</span>
                </div>
                <div class="detail_container">
                    <h2>${e.name}</h2>
                    <p>難易度: ${e.display_difficulty}</p>
                    <p>${e.description}</p>
                </div>
                <div class="swiper">
                    <div class="swiper-wrapper">
                        <div class="swiper-slide">
                            <img src="${a}" width="500">
                        </div>
                        ${t}
                    </div>
                </div>
                <div class="swiper-pagination"></div>
            </div>
        `,this.swiper(e),this.detailClose()}swiper(e){e.image_urls.map(t=>`<div class="swiper-slide"><img src="${t}" width="500"></div>`).join(" ")!==""&&(this.detailContainer.querySelector(".swiper").insertAdjacentHTML("beforeend",`
                <div class="swiper-button-prev"></div>
                <div class="swiper-button-next"></div>
            `),new Swiper(".swiper",{loop:!0,navigation:{nextEl:".swiper-button-next",prevEl:".swiper-button-prev"},effect:"fade",pagination:{el:".swiper-pagination",type:"bullets",clickable:"clickable"},autoHeight:!0}))}detailClose(){const e=document.getElementById("detail_close"),a=document.querySelector(".detail_window"),t=s=>{(!a.contains(s.target)||s.target===e||s.target.closest("#detail_close"))&&(this.detailContainer.classList.remove("appear"),this.detailContainer.innerHTML="",e.removeEventListener("click",t),this.detailContainer.removeEventListener("click",t))};e.addEventListener("click",t),this.detailContainer.addEventListener("click",t)}}class L{constructor(){this.showInfoWindow=null,this.currentSpotName=null,this.detailWindow=new f,this.handleCenterAndZoom=new y}handleInfoWindow(e,a,t,s,i){const l=document.getElementById("prefecture_select").value;if(this.showInfoWindow&&this.showInfoWindow.getContent()===a){this.showInfoWindow.close(),this.showInfoWindow=null,e.setCenter(this.handleCenterAndZoom.getCenter(l)),e.setZoom(this.handleCenterAndZoom.getZoomLevel(l));return}else this.showInfoWindow&&(this.currentSpotName&&this.spotNametoggle(this.currentSpotName),this.showInfoWindow.close(),this.showInfoWindow=null),this.showInfoWindow=new google.maps.InfoWindow({content:a,position:t}),this.showInfoWindow.open(e),e.setCenter(t),e.setZoom(12),google.maps.event.addListener(this.showInfoWindow,"domready",()=>{const n=document.querySelector(".detail_link");n&&n.addEventListener("click",r=>{r.preventDefault(),this.detailWindow.showDetail(s,i)})}),google.maps.event.addListener(this.showInfoWindow,"closeclick",()=>{this.showInfoWindow=null,this.spotNametoggle(this.currentSpotName)})}scrollList(e){const a=document.querySelector(`#spot_${e}`);if(a){const t=document.querySelector("#result");if(t){const s=t.clientHeight;t.scrollHeight>s&&t.scroll({top:a.offsetTop-t.offsetTop,behavior:"smooth"})}}}closeInfoWindoUpdateLayers(){this.showInfoWindow&&(this.showInfoWindow.close(),this.showInfoWindow=null,this.currentSpotName=null)}spotNametoggle(e){e.classList.toggle("selected"),this.currentSpotName=e}findSpotName(e){const a=document.querySelectorAll(".spot_name");for(let t of a)if(t.textContent.trim()===e.trim())return t;return null}}class u{constructor(){u.instance||(u.instance=new L)}getInstance(){return u.instance}}class y{constructor(){this.width=window.innerWidth}getZoomLevel(e){return e!=="selectAllPrefecture"?this.width>=768?10:9:this.width>=768?9:8}getCenter(e){return e!=="selectAllPrefecture"?this.prefectureCoordinate(e):this.width>=768?{lat:36.119417,lng:138.974642}:{lat:36.145823,lng:138.842241}}prefectureCoordinate(e){const t=[{id:"1",coordinate:{lat:35.809512,lng:139.097101}},{id:"2",coordinate:{lat:35.994789,lng:139.085967}},{id:"3",coordinate:{lat:36.455127,lng:138.889588}},{id:"4",coordinate:{lat:35.606833,lng:138.71675}},{id:"5",coordinate:{lat:36.193933,lng:138.345227}}].find(s=>s.id===e);return t?t.coordinate:void 0}}function _(d,e,a,t){return`
        <div class="info_window">
            <h2>${d.trim()}</h2>
            <p>難易度: ${e}</p>
            <a class="detail_link" href="/detail/${a}">詳細</a><br>
            <img src="${t}" class="info_window_img" width="">
        </div>
    `.trim()}class v{constructor(e){this.map=e;const a=new u;this.infoWindowManager=a.getInstance()}clickRindoList(e){document.querySelectorAll(".spot_name").forEach(a=>{a.addEventListener("click",()=>{this.handleSpotNameClick(a,e)})})}handleSpotNameClick(e,a){const t=e.dataset.coordinates.split(","),s=parseFloat(t[1]),i=parseFloat(t[0]),l={lat:s,lng:i},n=e.textContent.trim(),r=this.infoWindowManager.findSpotName(n),o=e.dataset.imageUrl,h=e.dataset.id,c=e.dataset.difficulty,p=_(n,c,h,o);this.infoWindowManager.handleInfoWindow(a,p,l,h,o),this.infoWindowManager.spotNametoggle(r)}}class k{constructor(e){this.csrfToken=document.querySelector('meta[name="csrf-token"]').getAttribute("content"),this.difficultySelect=document.getElementById("difficulty_select"),this.prefectureSelect=document.getElementById("prefecture_select"),this.clickSpotName=new v(e),this.kmlFileManager=new g}async fetchFilteredData(e){const a=this.difficultySelect.value,t=this.prefectureSelect.value,s=new FormData;s.append("input_difficulty",a),s.append("input_prefecture",t);try{const i=await fetch("/handle-form-filter",{method:"POST",headers:{"X-CSRF-TOKEN":this.csrfToken},body:s});if(!i.ok)throw new Error("Network response was not ok");const l=await i.json();if(this.updateSpotList(l,e),t!=="selectAllPrefecture"){if(!l.spots[0]){alert("該当するデータがありません。");return}const n=l.spots[0].prefecture,r=`D: ${a}, P: ${n}`;return localStorage.getItem(r)?{sortedKmlUrl:localStorage.getItem(r),data:l,source:"existing url"}:{sortedKmlUrl:await this.kmlFileManager.generateKmlUrl(l),data:l,source:"new url"}}else return}catch(i){throw console.error("Error fetching filtered data:",i),i}}updateSpotList(e,a){const t=document.getElementById("result_list");if(t.innerHTML="",e.spots.length>0)e.spots.forEach(s=>{const i=document.createElement("li");i.classList.add("spot_name"),i.classList.add("py-2"),i.classList.add("ps-2"),i.dataset.id=s.id,i.dataset.coordinates=s.coordinates,i.dataset.difficulty=s.display_difficulty,i.dataset.imageUrl=s.image_url,i.textContent=s.name,i.id=`spot_${s.id}`,t.appendChild(i)});else{const s=document.createElement("li");s.textContent="- 該当する結果がありません -",s.classList.add("no_data"),t.appendChild(s)}this.clickSpotName.clickRindoList(a)}}class w{constructor(){this.map=null,this.layers=[],this.filterLayers=[];const e=new u;this.infoWindowManager=e.getInstance(),this.kmlFileManager=new g,this.handleCenterAndZoom=new y,this.detailWindow=new f,this.csrfToken=document.querySelector('meta[name="csrf-token"]').getAttribute("content")}static loadGoogleMapsApi(e){return new Promise((a,t)=>{if(window.google&&window.google.maps){a();return}const s=document.createElement("script");s.src=`https://maps.googleapis.com/maps/api/js?key=${e}&loading=async&callback=initMap`,s.async=!0,s.defer=!0,s.onerror=t,document.head.appendChild(s),window.initMap=a})}async initMap(){const e=document.getElementById("google-maps-api-key"),a=e?e.getAttribute("data-api-key"):null,t=document.getElementById("prefecture_select").value;try{return this.showLoadingScreen(),await w.loadGoogleMapsApi(a),this.map=new google.maps.Map(document.getElementById("map"),{center:this.handleCenterAndZoom.getCenter(t),zoom:this.handleCenterAndZoom.getZoomLevel(t),styles:this.mapStyles()}),await this.kmlFileManager.fetchKmlUrls(),this.addKmlLayers(),this.hideLoadingScreen(),this.map}catch(s){throw console.error("Failed to load Google Maps API:",s),s}}addKmlLayers(){const e=this.kmlFileManager.difficultyURLS;Object.keys(e).forEach(a=>{const t=new google.maps.KmlLayer({url:e[a],map:this.map,preserveViewport:!0,suppressInfoWindows:!0});google.maps.event.addListener(t,"status_changed",()=>{const s=t.getStatus();s!==google.maps.KmlLayerStatus.OK&&(console.log(`KML layer status: ${s}`),console.error(`Error loading KML layer from URL: ${e[a]}, Status: ${s}`),confirm("マップの読み込みに失敗しました。ページを更新せず続けますか？"))}),this.layers.push(t),this.kmlLayerClick(t)})}kmlLayerClick(e){e.addListener("click",a=>{const t=a.featureData.name,s=a.latLng,i=this.infoWindowManager.findSpotName(t),l=i.dataset.imageUrl,n=i.dataset.id,r=i.dataset.difficulty,o=_(t,r,n,l);this.infoWindowManager.handleInfoWindow(this.map,o,s,n,l),this.infoWindowManager.spotNametoggle(i),this.infoWindowManager.scrollList(n)})}async updateLayers(){if(!this.map){console.error("Map is not initialized.");return}const e=document.getElementById("difficulty_select"),a=document.getElementById("prefecture_select"),t=e.value,s=a.value,i=this.kmlFileManager.createDifficultyURLS();this.infoWindowManager.closeInfoWindoUpdateLayers();const l=new k;if(this.filterLayers.forEach(n=>{n.setMap(null)}),this.filterLayers=[],t==="selectAllDifficulty"&&s==="selectAllPrefecture")this.layers.forEach(n=>{n.setMap(this.map)}),await l.fetchFilteredData(this.map),this.map.setCenter(this.handleCenterAndZoom.getCenter(s)),this.map.setZoom(this.handleCenterAndZoom.getZoomLevel(s));else if(t!=="selectAllDifficulty"&&s==="selectAllPrefecture"){this.layers.forEach(r=>{r.setMap(null)});const n=this.layers.find(r=>r.url===i[t]);n&&n.setMap(this.map),await l.fetchFilteredData(this.map)}else if(s!=="selectAllPrefecture"){const n=await l.fetchFilteredData(this.map);if(!n||!n.sortedKmlUrl){console.log("ソート結果が無いので、全てのKML Layerを非表示にする"),this.layers.forEach(c=>{c.setMap(null)});return}const{sortedKmlUrl:r,data:o,source:h}=n;if(this.layers.forEach(c=>{c.setMap(null)}),r){const c=new google.maps.KmlLayer({url:r,map:this.map,preserveViewport:!0,suppressInfoWindows:!0});c.addListener("status_changed",async()=>{try{await this.handleKmlLayerStatusChange(c,o,r,h)||(this.filterLayers.push(c),this.kmlLayerClick(c))}catch(p){console.error("KML Layerの処理中にエラーが発生:",p)}})}}s==="selectAllPrefecture"?(this.map.setCenter(this.handleCenterAndZoom.getCenter(s)),this.map.setZoom(this.handleCenterAndZoom.getZoomLevel(s))):(this.map.setCenter(this.handleCenterAndZoom.prefectureCoordinate(s)),this.map.setZoom(this.handleCenterAndZoom.getZoomLevel(s)))}async handleKmlLayerStatusChange(e,a,t,s){if(e.getStatus()===google.maps.KmlLayerStatus.OK&&s==="new url"){await this.kmlFileManager.fetchDeleteKml(t);return}else{if(e.getStatus()===google.maps.KmlLayerStatus.OK&&s==="existing url")return;console.log("Failed to load KML file. New URL generated.");try{const i=await this.kmlFileManager.generateKmlUrl(a);if(i){const l=new google.maps.KmlLayer({url:i,map:this.map,preserveViewport:!0,suppressInfoWindows:!0});return google.maps.event.addListener(l,"status_changed",async()=>{const n=l.getStatus();n===google.maps.KmlLayerStatus.OK?(await this.kmlFileManager.fetchDeleteKml(i),this.filterLayers=this.filterLayers.filter(r=>r!==e),this.filterLayers.push(l),this.kmlLayerClick(l)):console.error("Failed to load new KML layer. Status:",n)}),e.setMap(null),l}}catch(i){console.error("Failed to generate new KML URL",i)}}}showLoadingScreen(){document.getElementById("detail_container").classList.add("appear"),document.getElementById("loader_container").style.display="flex"}hideLoadingScreen(){document.getElementById("detail_container").classList.remove("appear"),document.getElementById("loader_container").style.display="none"}sortReset(){document.getElementById("sort_reset").addEventListener("click",()=>{const e=document.getElementById("difficulty_select"),a=document.getElementById("prefecture_select"),t=e.value,s=a.value;t==="selectAllDifficulty"&&s==="selectAllPrefecture"||(e.selectedIndex=0,a.selectedIndex=0,this.updateLayers())})}showMapResetWindow(){const e=document.getElementById("detail_container");document.getElementById("map_reset").addEventListener("click",()=>{e.classList.add("appear"),e.innerHTML=`
                <div class="detail_window data_reset">
                    <div id="detail_close">
                        <span>x</span>
                    </div>
                    <div>
                        <p class="mt-5">
                            もしマップに林道のデータが表示されない場合は「データを再読込み」をクリックしてください。
                            クリック後データを再読込みとページがページ更新されます。再読込み後もマップに表示されない場合はしばらく経ってからお試しください。
                        </p>
                        <div class="data_reset_btn my-3">
                            <button id="data_reset_btn">データを再読込み</button>
                        </div>
                    </div>
                <div>
            `,document.getElementById("data_reset_btn").addEventListener("click",()=>{localStorage.clear(),location.reload()}),this.detailWindow.detailClose()})}mapStyles(){return[{featureType:"landscape.man_made",elementType:"geometry.fill",stylers:[{color:"#EFEFF7"}]},{featureType:"water",elementType:"all",stylers:[{color:"#78A1BB"}]}]}}class S{constructor(){this.detailContainer=document.getElementById("detail_container"),this.menuContainer=document.getElementById("menu_container"),this.detailWindow=new f}showContent(e){switch(this.detailContainer.innerHTML="",this.detailContainer.classList.add("appear"),e){case"about_rindo":case"about_map":case"lets_go":this.renderExplain(e);break;default:window.location.reload();break}}clickMenuItems(){document.getElementById("menu").addEventListener("click",a=>{const t=a.target.closest("h3");t&&t.id&&(t.id==="sp_menu_icon"?this.showMenuSP():this.showContent(t.id))})}showMenuSP(){this.menuContainer.classList.add("appear"),this.menuContainer.innerHTML=`
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
        `,document.getElementById("about_rindo_sp").addEventListener("click",()=>{this.detailContainer.classList.add("appear"),this.renderExplain("about_rindo")}),document.getElementById("about_map_sp").addEventListener("click",()=>{this.detailContainer.classList.add("appear"),this.renderExplain("about_map")}),document.getElementById("lets_go_sp").addEventListener("click",()=>{this.detailContainer.classList.add("appear"),this.renderExplain("lets_go")}),this.menuWindowClose()}menuWindowClose(){const e=document.getElementById("menu_close"),a=document.querySelector(".menu_window"),t=s=>{(!a.contains(s.target)||s.target===e||s.target.closest("#menu_close"))&&(this.menuContainer.classList.remove("appear"),this.menuContainer.innerHTML="",e.removeEventListener("click",t),this.menuContainer.removeEventListener("click",t))};e.addEventListener("click",t),this.menuContainer.addEventListener("click",t)}renderExplain(e){const a=this.text(e);this.detailContainer.innerHTML=`
            <div class="detail_window overflow-auto"">
                <div id="detail_close" onclick="document.getElementById('detail_container').classList.remove('appear')">
                    <span>X</span>
                </div>
                <img class="header_images"  src="storage/header/${e}.png" width="300">
                ${a}
            </div>
        `,this.detailWindow.detailClose()}text(e){switch(e){case"about_rindo":return this.aboutRindoText();case"about_map":return this.aboutMapText();case"lets_go":return this.letsGoText();default:return""}}aboutRindoText(){return`
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
        `}aboutMapText(){return`
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
        `}letsGoText(){return`
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
        `}}document.addEventListener("DOMContentLoaded",async function(){try{new g().fetchAndSaveKmls();const e=new w,a=await e.initMap();new S().clickMenuItems(),new v(a).clickRindoList(a),document.getElementById("difficulty_select").addEventListener("change",function(){e.updateLayers()}),document.getElementById("prefecture_select").addEventListener("change",function(){e.updateLayers()}),e.sortReset(),e.showMapResetWindow()}catch(d){console.error("マップの初期化に失敗しました:",d)}});
