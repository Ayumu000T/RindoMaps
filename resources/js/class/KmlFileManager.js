// import { KmlParser } from './KmlParser';

//KMLファイルの読み込み
export class KmlFileManager {
    constructor() {
        this.kmlLayerURLS = {
            //My Mapsのオンライン上のkmlファイル
            // difficulty1: 'https://www.google.com/maps/d/u/0/kml?forcekml=1&mid=1T0oMKSRVbGhwBW33mJuhVOo0-MGQeds&lid=7ynBOV8jQUo',
            // difficulty2: 'https://www.google.com/maps/d/u/0/kml?forcekml=1&mid=1T0oMKSRVbGhwBW33mJuhVOo0-MGQeds&lid=FHEwq7ut1X8',
            // difficulty3: 'https://www.google.com/maps/d/u/0/kml?forcekml=1&mid=1T0oMKSRVbGhwBW33mJuhVOo0-MGQeds&lid=rd6pvMc1c1c',
            // difficulty4: 'https://www.google.com/maps/d/u/0/kml?forcekml=1&mid=1T0oMKSRVbGhwBW33mJuhVOo0-MGQeds&lid=7SU8cepGjbg',
            // difficulty5: 'https://www.google.com/maps/d/u/0/kml?forcekml=1&mid=1T0oMKSRVbGhwBW33mJuhVOo0-MGQeds&lid=2_crKVxfQWY',

            //GoogleDriveに配置したkmlファイル
            difficulty1: 'https://drive.google.com/uc?export=download&id=1k4XUvYQrQXn0T3QXwpjcWbv3UHYi08W8',
            difficulty2: 'https://drive.google.com/uc?export=download&id=1Vcdd1l-wPadSrLPg2jV3ufYdFdtaPfaK',
            difficulty3: 'https://drive.google.com/uc?export=download&id=15WaDTCSXXzNXdsNYtUWYlIFhAo7el1Ng',
            difficulty4: 'https://drive.google.com/uc?export=download&id=104xj2AUFFaHk0quG5p3UAPAsM_0hPvLG',
            difficulty5: 'https://drive.google.com/uc?export=download&id=1AlXRa7kMsSyJLMmxiSL_9N-MGLH5dmmG',
        };
        this.difficultyURLS = this.createDifficultyURLS();
    }

    createDifficultyURLS() {
        const urls = {};
        Object.keys(this.kmlLayerURLS).forEach(key => {
            const difficulty = key.replace('difficulty', '');
            urls[difficulty] = this.kmlLayerURLS[key];
        });
        return urls;
    }

    getURL(difficulty) {
        return this.difficultyURLS[difficulty];
    }
}
