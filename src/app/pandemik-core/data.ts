import { BlueColor, YellowColor, BlackColor, GreenColor } from "./constants";
import { Pandemik } from "./pandemik";

export enum GameColor {
    Blue,
    Yellow,
    Black,
    Green
}

export const GameColors = [
    GameColor.Blue,
    GameColor.Yellow,
    GameColor.Black,
    GameColor.Green
];

export const GameColor3s = [
    BlueColor,
    YellowColor,
    BlackColor,
    GreenColor
]

export const DiseaseNames = [
    "Bluevirus",
    "Yellowcoccus",
    "Blackterium",
    "Greenmonella"
]

export interface CityData {
    id: string;
    name: string;
    color: GameColor;
    lat: number;
    long: number;
    posZero?: [number, number, number];
}
export var MissingCityData = { id:"missingcity", name: "Missing City", color: GameColor.Blue, lat: 0, long: 0 };

export var CityDataList: CityData[] = [];
export function CityDataById(id: string): CityData {
    let city = CityDataList.find(city => city.id === id);
    if (city) {
        return city;
    }
    return MissingCityData;
}
export function CityIdToIndex(id: string): number {
    return CityDataList.findIndex(city => city.id === id);
}

CityDataList.push({ id: "SanFrancisco", name: "San Francisco", color: GameColor.Blue, lat: 37.7749, long: -122.4194 });
CityDataList.push({ id: "Chicago", name: "Chicago", color: GameColor.Blue, lat: 41.8781, long: -87.6298 });
CityDataList.push({ id: "Atlanta", name: "Atlanta", color: GameColor.Blue, lat: 33.7490, long: -84.3880 });
CityDataList.push({ id: "Montreal", name: "Montreal", color: GameColor.Blue, lat: 45.5017, long: -73.5673 });
CityDataList.push({ id: "Washington", name: "Washington", color: GameColor.Blue, lat: 38.9072, long: -77.0369 });
CityDataList.push({ id: "NewYork", name: "New York", color: GameColor.Blue, lat: 40.7128, long: -74.0060 });
CityDataList.push({ id: "Madrid", name: "Madrid", color: GameColor.Blue, lat: 40.4168, long: -3.7038 });
CityDataList.push({ id: "London", name: "London", color: GameColor.Blue, lat: 51.5074, long: -0.1278 });
CityDataList.push({ id: "Paris", name: "Paris", color: GameColor.Blue, lat: 48.8566, long: 2.3522 });
CityDataList.push({ id: "Essen", name: "Essen", color: GameColor.Blue, lat: 51.4556, long: 7.0116 });
CityDataList.push({ id: "Milano", name: "Milano", color: GameColor.Blue, lat: 45.4642, long: 9.1900 });
CityDataList.push({ id: "SaintPetersburg", name: "Saint Petersburg", color: GameColor.Blue, lat: 59.9343, long: 30.3351 });
CityDataList.push({ id: "LosAngeles", name: "Los Angeles", color: GameColor.Yellow, lat: 34.0522, long: -118.2437 });
CityDataList.push({ id: "MexicoCity", name: "Mexico City", color: GameColor.Yellow, lat: 19.4326, long: -99.1332 });
CityDataList.push({ id: "Miami", name: "Miami", color: GameColor.Yellow, lat: 25.7617, long: -80.1918 });
CityDataList.push({ id: "Bogota", name: "Bogotá", color: GameColor.Yellow, lat: 4.7110, long: -74.0721 });
CityDataList.push({ id: "Lima", name: "Lima", color: GameColor.Yellow, lat: -12.0464, long: -77.0428 });
CityDataList.push({ id: "Santiago", name: "Santiago", color: GameColor.Yellow, lat: -33.4489, long: -70.6693 });
CityDataList.push({ id: "BuenosAires", name: "Buenos Aires", color: GameColor.Yellow, lat: -34.6037, long: -58.3816 });
CityDataList.push({ id: "SaoPaulo", name: "Sao Paulo", color: GameColor.Yellow, lat: -23.5505, long: -46.6333 });
CityDataList.push({ id: "Lagos", name: "Lagos", color: GameColor.Yellow, lat: 6.5244, long: 3.3792 });
CityDataList.push({ id: "Kinshasa", name: "Kinshasa", color: GameColor.Yellow, lat: -4.4419, long: 15.2663 });
CityDataList.push({ id: "Khartoum", name: "Khartoum", color: GameColor.Yellow, lat: 15.5007, long: 32.5599 });
CityDataList.push({ id: "Johannesburg", name: "Johannesburg", color: GameColor.Yellow, lat: -26.2041, long: 28.0473 });
CityDataList.push({ id: "Algiers", name: "Algiers", color: GameColor.Black, lat: 36.7538, long: 3.0588 });
CityDataList.push({ id: "Cairo", name: "Cairo", color: GameColor.Black, lat: 30.0444, long: 31.2357 });
CityDataList.push({ id: "Istanbul", name: "Istanbul", color: GameColor.Black, lat: 41.0082, long: 28.9784 });
CityDataList.push({ id: "Moscow", name: "Moscow", color: GameColor.Black, lat: 55.7558, long: 37.6173 });
CityDataList.push({ id: "Baghdad", name: "Baghdad", color: GameColor.Black, lat: 33.3152, long: 44.3661 });
CityDataList.push({ id: "Riyadh", name: "Riyadh", color: GameColor.Black, lat: 24.7136, long: 46.6753 });
CityDataList.push({ id: "Tehran", name: "Tehran", color: GameColor.Black, lat: 35.6892, long: 51.3890 });
CityDataList.push({ id: "Karachi", name: "Karachi", color: GameColor.Black, lat: 24.8607, long: 67.0011 });
CityDataList.push({ id: "Mumbai", name: "Mumbai", color: GameColor.Black, lat: 19.0760, long: 72.8777 });
CityDataList.push({ id: "Delhi", name: "Delhi", color: GameColor.Black, lat: 28.6139, long: 77.2090 });
CityDataList.push({ id: "Chennai", name: "Chennai", color: GameColor.Black, lat: 13.0827, long: 80.2707 });
CityDataList.push({ id: "Calcutta", name: "Calcutta", color: GameColor.Black, lat: 22.5726, long: 88.3639 });
CityDataList.push({ id: "Beijing", name: "Beijing", color: GameColor.Green, lat: 39.9042, long: 116.4074 });
CityDataList.push({ id: "Seoul", name: "Seoul", color: GameColor.Green, lat: 37.5665, long: 126.9780 });
CityDataList.push({ id: "Tokyo", name: "Tokyo", color: GameColor.Green, lat: 35.6895, long: 139.6917 });
CityDataList.push({ id: "Shanghai", name: "Shanghai", color: GameColor.Green, lat: 31.2304, long: 121.4737 });
CityDataList.push({ id: "HongKong", name: "Hong Kong", color: GameColor.Green, lat: 22.3193, long: 114.1694 });
CityDataList.push({ id: "Bangkok", name: "Bangkok", color: GameColor.Green, lat: 13.7563, long: 100.5018 });
CityDataList.push({ id: "Taipei", name: "Taipei", color: GameColor.Green, lat: 25.0330, long: 121.5654 });
CityDataList.push({ id: "Osaka", name: "Osaka", color: GameColor.Green, lat: 34.6937, long: 135.5023 });
CityDataList.push({ id: "Manila", name: "Manila", color: GameColor.Green, lat: 14.5995, long: 120.9842 });
CityDataList.push({ id: "HoChiMinhCity", name: "Ho Chi Minh City", color: GameColor.Green, lat: 10.7769, long: 106.7009 });
CityDataList.push({ id: "Jakarta", name: "Jakarta", color: GameColor.Green, lat: -6.2088, long: 106.8456 });
CityDataList.push({ id: "Sydney", name: "Sydney", color: GameColor.Green, lat: -33.8688, long: 151.2093 });

CityDataById("SanFrancisco").posZero = [-6.397, 6.867, 4.708];
CityDataById("Chicago").posZero = [-7.463, 7.382, 0.216];
CityDataById("Atlanta").posZero = [-9.025, 5.351, 0.422];
CityDataById("Montreal").posZero = [-6.300, 8.195, -1.845];
CityDataById("Washington").posZero = [-8.297, 6.171, -1.825];
CityDataById("NewYork").posZero = [-7.016, 6.778, -3.884];
CityDataById("Madrid").posZero = [-1.948, 6.076, -8.339];
CityDataById("London").posZero = [-1.282, 8.931, -5.371];
CityDataById("Paris").posZero = [-0.295, 7.598, -7.242];
CityDataById("Essen").posZero = [1.572, 8.569, -5.860];
CityDataById("Milano").posZero = [1.992, 6.752, -7.790];
CityDataById("SaintPetersburg").posZero = [2.194, 9.593, -3.661];
CityDataById("LosAngeles").posZero = [-8.182, 5.368, 3.805];
CityDataById("MexicoCity").posZero = [-9.815, 3.334, 1.670];
CityDataById("Miami").posZero = [-9.520, 3.989, -1.925];
CityDataById("Bogota").posZero = [-10.063, 0.862, -2.872];
CityDataById("Lima").posZero = [-10.007, -2.191, -2.302];
CityDataById("Santiago").posZero = [-8.394, -5.740, -2.616];
CityDataById("BuenosAires").posZero = [-7.184, -5.974, -4.791];
CityDataById("SaoPaulo").posZero = [-6.997, -4.195, -6.609];
CityDataById("Lagos").posZero = [0.615, 1.193, -10.414];
CityDataById("Kinshasa").posZero = [2.756, -0.813, -10.099];
CityDataById("Khartoum").posZero = [5.475, 2.722, -8.536];
CityDataById("Johannesburg").posZero = [4.430, -4.636, -8.314];
CityDataById("Algiers").posZero = [0.370, 5.322, -9.044];
CityDataById("Cairo").posZero = [4.360, 4.931, -8.181];
CityDataById("Istanbul").posZero = [4.072, 7.192, -6.477];
CityDataById("Moscow").posZero = [4.332, 8.509, -4.369];
CityDataById("Baghdad").posZero = [6.057, 5.673, -6.432];
CityDataById("Riyadh").posZero = [7.374, 3.554, -6.576];
CityDataById("Tehran").posZero = [6.869, 6.681, -4.293];
CityDataById("Karachi").posZero = [8.287, 4.626, -4.491];
CityDataById("Mumbai").posZero = [9.576, 3.030, -3.061];
CityDataById("Delhi").posZero = [8.620, 5.576, -2.203];
CityDataById("Chennai").posZero = [10.302, 1.734, -1.050];
CityDataById("Calcutta").posZero = [9.589, 4.266, -0.308];
CityDataById("Beijing").posZero = [7.104, 7.344, 2.419];
CityDataById("Seoul").posZero = [5.916, 7.177, 4.873];
CityDataById("Tokyo").posZero = [4.148, 6.665, 6.973];
CityDataById("Shanghai").posZero = [7.789, 5.683, 4.158];
CityDataById("HongKong").posZero = [9.201, 3.773, 3.369];
CityDataById("Bangkok").posZero = [10.120, 2.459, 1.335];
CityDataById("Taipei").posZero = [7.964, 3.745, 5.727];
CityDataById("Osaka").posZero = [6.228, 5.347, 6.547];
CityDataById("Manila").posZero = [8.718, 1.362, 5.691];
CityDataById("HoChiMinhCity").posZero = [9.841, 1.183, 3.465];
CityDataById("Jakarta").posZero = [9.983, -1.268, 2.997];
CityDataById("Sydney").posZero = [4.199, -5.852, 7.641];

/*
export function DEV_GeneratePosZeroCode(): void {
    let output = "";
    for (let cityIndex = 0; cityIndex < CityDataList.length; cityIndex++) {
        let city = Pandemik.DEV_INSTANCE?.map?.cities[cityIndex];
        if (city) {
            output += `CityDataList[CityID.${CityID[cityIndex]}].posZero = [${city.position.x.toFixed(3)}, ${city.position.y.toFixed(3)}, ${city.position.z.toFixed(3)}];\n`;
        }
    }
    console.log(output);
}
(window as any).DEV_GeneratePosZeroCode = DEV_GeneratePosZeroCode;
*/

export interface CityLinkData {
    cityId1: string;
    cityId2: string;
}

export var CityLinkDataList: CityLinkData[] = [];

CityLinkDataList.push({ cityId1: "SanFrancisco", cityId2: "Tokyo" });
CityLinkDataList.push({ cityId1: "SanFrancisco", cityId2: "Manila" });
CityLinkDataList.push({ cityId1: "SanFrancisco", cityId2: "LosAngeles" });
CityLinkDataList.push({ cityId1: "SanFrancisco", cityId2: "Chicago" });
CityLinkDataList.push({ cityId1: "Chicago", cityId2: "LosAngeles" });
CityLinkDataList.push({ cityId1: "Chicago", cityId2: "MexicoCity" });
CityLinkDataList.push({ cityId1: "Chicago", cityId2: "Atlanta" });
CityLinkDataList.push({ cityId1: "Chicago", cityId2: "Montreal" });
CityLinkDataList.push({ cityId1: "Atlanta", cityId2: "Washington" });
CityLinkDataList.push({ cityId1: "Atlanta", cityId2: "Miami" });
CityLinkDataList.push({ cityId1: "Montreal", cityId2: "NewYork" });
CityLinkDataList.push({ cityId1: "Montreal", cityId2: "Washington" });
CityLinkDataList.push({ cityId1: "Washington", cityId2: "NewYork" });
CityLinkDataList.push({ cityId1: "Washington", cityId2: "Miami" });
CityLinkDataList.push({ cityId1: "NewYork", cityId2: "Madrid" });
CityLinkDataList.push({ cityId1: "NewYork", cityId2: "London" });
CityLinkDataList.push({ cityId1: "Madrid", cityId2: "London" });
CityLinkDataList.push({ cityId1: "Madrid", cityId2: "Paris" });
CityLinkDataList.push({ cityId1: "Madrid", cityId2: "Algiers" });
CityLinkDataList.push({ cityId1: "Madrid", cityId2: "SaoPaulo" });
CityLinkDataList.push({ cityId1: "London", cityId2: "Paris" });
CityLinkDataList.push({ cityId1: "London", cityId2: "Essen" });
CityLinkDataList.push({ cityId1: "Paris", cityId2: "Essen" });
CityLinkDataList.push({ cityId1: "Paris", cityId2: "Milano" });
CityLinkDataList.push({ cityId1: "Paris", cityId2: "Algiers" });
CityLinkDataList.push({ cityId1: "Essen", cityId2: "Milano" });
CityLinkDataList.push({ cityId1: "Essen", cityId2: "SaintPetersburg" });
CityLinkDataList.push({ cityId1: "Milano", cityId2: "Istanbul" });
CityLinkDataList.push({ cityId1: "SaintPetersburg", cityId2: "Istanbul" });
CityLinkDataList.push({ cityId1: "SaintPetersburg", cityId2: "Moscow" });
CityLinkDataList.push({ cityId1: "LosAngeles", cityId2: "MexicoCity" });
CityLinkDataList.push({ cityId1: "LosAngeles", cityId2: "Sydney" });
CityLinkDataList.push({ cityId1: "MexicoCity", cityId2: "Miami" });
CityLinkDataList.push({ cityId1: "MexicoCity", cityId2: "Bogota" });
CityLinkDataList.push({ cityId1: "MexicoCity", cityId2: "Lima" });
CityLinkDataList.push({ cityId1: "Miami", cityId2: "Bogota" });
CityLinkDataList.push({ cityId1: "Bogota", cityId2: "Lima" });
CityLinkDataList.push({ cityId1: "Bogota", cityId2: "BuenosAires" });
CityLinkDataList.push({ cityId1: "Bogota", cityId2: "SaoPaulo" });
CityLinkDataList.push({ cityId1: "Lima", cityId2: "Santiago" });
CityLinkDataList.push({ cityId1: "BuenosAires", cityId2: "SaoPaulo" });
CityLinkDataList.push({ cityId1: "SaoPaulo", cityId2: "Lagos" });
CityLinkDataList.push({ cityId1: "Lagos", cityId2: "Kinshasa" });
CityLinkDataList.push({ cityId1: "Lagos", cityId2: "Khartoum" });
CityLinkDataList.push({ cityId1: "Kinshasa", cityId2: "Khartoum" });
CityLinkDataList.push({ cityId1: "Kinshasa", cityId2: "Johannesburg" });
CityLinkDataList.push({ cityId1: "Khartoum", cityId2: "Johannesburg" });
CityLinkDataList.push({ cityId1: "Khartoum", cityId2: "Cairo" });
CityLinkDataList.push({ cityId1: "Algiers", cityId2: "Cairo" });
CityLinkDataList.push({ cityId1: "Algiers", cityId2: "Istanbul" });
CityLinkDataList.push({ cityId1: "Cairo", cityId2: "Istanbul" });
CityLinkDataList.push({ cityId1: "Cairo", cityId2: "Baghdad" });
CityLinkDataList.push({ cityId1: "Cairo", cityId2: "Riyadh" });
CityLinkDataList.push({ cityId1: "Istanbul", cityId2: "Moscow" });
CityLinkDataList.push({ cityId1: "Istanbul", cityId2: "Baghdad" });
CityLinkDataList.push({ cityId1: "Moscow", cityId2: "Tehran" });
CityLinkDataList.push({ cityId1: "Baghdad", cityId2: "Riyadh" });
CityLinkDataList.push({ cityId1: "Baghdad", cityId2: "Tehran" });
CityLinkDataList.push({ cityId1: "Baghdad", cityId2: "Karachi" });
CityLinkDataList.push({ cityId1: "Riyadh", cityId2: "Karachi" });
CityLinkDataList.push({ cityId1: "Tehran", cityId2: "Karachi" });
CityLinkDataList.push({ cityId1: "Tehran", cityId2: "Delhi" });
CityLinkDataList.push({ cityId1: "Karachi", cityId2: "Mumbai" });
CityLinkDataList.push({ cityId1: "Karachi", cityId2: "Delhi" });
CityLinkDataList.push({ cityId1: "Mumbai", cityId2: "Delhi" });
CityLinkDataList.push({ cityId1: "Mumbai", cityId2: "Chennai" });
CityLinkDataList.push({ cityId1: "Delhi", cityId2: "Chennai" });
CityLinkDataList.push({ cityId1: "Delhi", cityId2: "Calcutta" });
CityLinkDataList.push({ cityId1: "Chennai", cityId2: "Calcutta" });
CityLinkDataList.push({ cityId1: "Chennai", cityId2: "Bangkok" });
CityLinkDataList.push({ cityId1: "Chennai", cityId2: "Jakarta" });
CityLinkDataList.push({ cityId1: "Calcutta", cityId2: "HongKong" });
CityLinkDataList.push({ cityId1: "Calcutta", cityId2: "Bangkok" });
CityLinkDataList.push({ cityId1: "Beijing", cityId2: "Seoul" });
CityLinkDataList.push({ cityId1: "Beijing", cityId2: "Shanghai" });
CityLinkDataList.push({ cityId1: "Seoul", cityId2: "Tokyo" });
CityLinkDataList.push({ cityId1: "Seoul", cityId2: "Shanghai" });
CityLinkDataList.push({ cityId1: "Tokyo", cityId2: "Shanghai" });
CityLinkDataList.push({ cityId1: "Tokyo", cityId2: "Osaka" });
CityLinkDataList.push({ cityId1: "Shanghai", cityId2: "HongKong" });
CityLinkDataList.push({ cityId1: "Shanghai", cityId2: "Taipei" });
CityLinkDataList.push({ cityId1: "HongKong", cityId2: "Bangkok" });
CityLinkDataList.push({ cityId1: "HongKong", cityId2: "Taipei" });
CityLinkDataList.push({ cityId1: "HongKong", cityId2: "Manila" });
CityLinkDataList.push({ cityId1: "HongKong", cityId2: "HoChiMinhCity" });
CityLinkDataList.push({ cityId1: "Bangkok", cityId2: "HoChiMinhCity" });
CityLinkDataList.push({ cityId1: "Bangkok", cityId2: "Jakarta" });
CityLinkDataList.push({ cityId1: "Taipei", cityId2: "Osaka" });
CityLinkDataList.push({ cityId1: "Taipei", cityId2: "Manila" });
CityLinkDataList.push({ cityId1: "Manila", cityId2: "HoChiMinhCity" });
CityLinkDataList.push({ cityId1: "Manila", cityId2: "Sydney" });
CityLinkDataList.push({ cityId1: "HoChiMinhCity", cityId2: "Jakarta" });
CityLinkDataList.push({ cityId1: "Jakarta", cityId2: "Sydney" });