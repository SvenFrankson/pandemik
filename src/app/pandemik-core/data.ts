import { BlueColor, YellowColor, BlackColor, GreenColor } from "./constants";
import { Pandemik } from "./pandemik";

export enum GameColor {
    Blue,
    Yellow,
    Black,
    Green
}

export const GameColors = [GameColor.Blue, GameColor.Yellow, GameColor.Black, GameColor.Green];

export const DiseaseNames = [
    "Bluevirus",
    "Yellowcoccus",
    "Blackterium",
    "Greenmonella"
]

export const CityColor3s = [
    BlueColor,
    YellowColor,
    BlackColor,
    GreenColor
]

export enum CityID {
    SanFrancisco,
    Chicago,
    Atlanta,
    Montreal,
    Washington,
    NewYork,
    Madrid,
    London,
    Paris,
    Essen,
    Milano,
    SaintPetersburg,
    LosAngeles,
    MexicoCity,
    Miami,
    Bogota,
    Lima,
    Santiago,
    BuenosAires,
    SaoPaulo,
    Lagos,
    Kinshasa,
    Khartoum,
    Johannesburg,
    Algiers,
    Cairo,
    Istanbul,
    Moscow,
    Baghdad,
    Riyadh,
    Tehran,
    Karachi,
    Mumbai,
    Delhi,
    Chennai,
    Calcutta,
    Beijing,
    Seoul,
    Tokyo,
    Shanghai,
    HongKong,
    Bangkok,
    Taipei,
    Osaka,
    Manila,
    HoChiMinhCity,
    Jakarta,
    Sydney,
    LAST
}

export interface CityData {
    name: string;
    color: GameColor;
    lat: number;
    long: number;
    posZero?: [number, number, number];
}

export var MapData = [<CityData>{}];

MapData[CityID.SanFrancisco] = { name: "San Francisco", color: GameColor.Blue, lat: 37.7749, long: -122.4194 };
MapData[CityID.Chicago] = { name: "Chicago", color: GameColor.Blue, lat: 41.8781, long: -87.6298 }
MapData[CityID.Atlanta] = { name: "Atlanta", color: GameColor.Blue, lat: 33.7490, long: -84.3880 }
MapData[CityID.Montreal] = { name: "Montreal", color: GameColor.Blue, lat: 45.5017, long: -73.5673 }
MapData[CityID.Washington] = { name: "Washington", color: GameColor.Blue, lat: 38.9072, long: -77.0369 }
MapData[CityID.NewYork] = { name: "New York", color: GameColor.Blue, lat: 40.7128, long: -74.0060 }
MapData[CityID.Madrid] = { name: "Madrid", color: GameColor.Blue, lat: 40.4168, long: -3.7038 }
MapData[CityID.London] = { name: "London", color: GameColor.Blue, lat: 51.5074, long: -0.1278 }
MapData[CityID.Paris] = { name: "Paris", color: GameColor.Blue, lat: 48.8566, long: 2.3522 }
MapData[CityID.Essen] = { name: "Essen", color: GameColor.Blue, lat: 51.4556, long: 7.0116 }
MapData[CityID.Milano ] = { name: "Milan", color: GameColor.Blue, lat: 45.4642, long: 9.1900 }
MapData[CityID.SaintPetersburg] = { name: "Saint Petersburg", color: GameColor.Blue, lat: 59.9343, long: 30.3351 }
MapData[CityID.LosAngeles] = { name: "Los Angeles", color: GameColor.Yellow, lat: 34.0522, long: -118.2437 }
MapData[CityID.MexicoCity] = { name: "Mexico City", color: GameColor.Yellow, lat: 19.4326, long: -99.1332 }
MapData[CityID.Miami] = { name: "Miami", color: GameColor.Yellow, lat: 25.7617, long: -80.1918 }
MapData[CityID.Bogota] = { name: "Bogotá", color: GameColor.Yellow, lat: 4.7110, long: -74.0721 }
MapData[CityID.Lima] = { name: "Lima", color: GameColor.Yellow, lat: -12.0464, long: -77.0428 }
MapData[CityID.Santiago] = { name: "Santiago", color: GameColor.Yellow, lat: -33.4489, long: -70.6693 }
MapData[CityID.BuenosAires] = { name: "Buenos Aires", color: GameColor.Yellow, lat: -34.6037, long: -58.3816 }
MapData[CityID.SaoPaulo] = { name: "Sao Paulo", color: GameColor.Yellow, lat: -23.5505, long: -46.6333 }
MapData[CityID.Lagos] = { name: "Lagos", color: GameColor.Yellow, lat: 6.5244, long: 3.3792 }
MapData[CityID.Kinshasa] = { name: "Kinshasa", color: GameColor.Yellow, lat: -4.4419, long: 15.2663 }
MapData[CityID.Khartoum] = { name: "Khartoum", color: GameColor.Yellow, lat: 15.5007, long: 32.5599 }
MapData[CityID.Johannesburg] = { name: "Johannesburg", color: GameColor.Yellow, lat: -26.2041, long: 28.0473 }
MapData[CityID.Algiers] = { name: "Algiers", color: GameColor.Black, lat: 36.7538, long: 3.0588 }
MapData[CityID.Cairo] = { name: "Cairo", color: GameColor.Black, lat: 30.0444, long: 31.2357 }
MapData[CityID.Istanbul] = { name: "Istanbul", color: GameColor.Black, lat: 41.0082, long: 28.9784 }
MapData[CityID.Moscow] = { name: "Moscow", color: GameColor.Black, lat: 55.7558, long: 37.6173 }
MapData[CityID.Baghdad] = { name: "Baghdad", color: GameColor.Black, lat: 33.3152, long: 44.3661 }
MapData[CityID.Riyadh] = { name: "Riyadh", color: GameColor.Black, lat: 24.7136, long: 46.6753 }
MapData[CityID.Tehran] = { name: "Tehran", color: GameColor.Black, lat: 35.6892, long: 51.3890 }
MapData[CityID.Karachi] = { name: "Karachi", color: GameColor.Black, lat: 24.8607, long: 67.0011 }
MapData[CityID.Mumbai] = { name: "Mumbai", color: GameColor.Black, lat: 19.0760, long: 72.8777 }
MapData[CityID.Delhi] = { name: "Delhi", color: GameColor.Black, lat: 28.6139, long: 77.2090 }
MapData[CityID.Chennai] = { name: "Chennai", color: GameColor.Black, lat: 13.0827, long: 80.2707 }
MapData[CityID.Calcutta] = { name: "Calcutta", color: GameColor.Black, lat: 22.5726, long: 88.3639 }
MapData[CityID.Beijing] = { name: "Beijing", color: GameColor.Green, lat: 39.9042, long: 116.4074 }
MapData[CityID.Seoul] = { name: "Seoul", color: GameColor.Green, lat: 37.5665, long: 126.9780 }
MapData[CityID.Tokyo] = { name: "Tokyo", color: GameColor.Green, lat: 35.6895, long: 139.6917 }
MapData[CityID.Shanghai] = { name: "Shanghai", color: GameColor.Green, lat: 31.2304, long: 121.4737 }
MapData[CityID.HongKong] = { name: "Hong Kong", color: GameColor.Green, lat: 22.3193, long: 114.1694 }
MapData[CityID.Bangkok] = { name: "Bangkok", color: GameColor.Green, lat: 13.7563, long: 100.5018 }
MapData[CityID.Taipei] = { name: "Taipei", color: GameColor.Green, lat: 25.0330, long: 121.5654 }
MapData[CityID.Osaka] = { name: "Osaka", color: GameColor.Green, lat: 34.6937, long: 135.5023 }
MapData[CityID.Manila] = { name: "Manila", color: GameColor.Green, lat: 14.5995, long: 120.9842 }
MapData[CityID.HoChiMinhCity] = { name: "Ho Chi Minh City", color: GameColor.Green, lat: 10.7769, long: 106.7009 }
MapData[CityID.Jakarta] = { name: "Jakarta", color: GameColor.Green, lat: -6.2088, long: 106.8456 }
MapData[CityID.Sydney] = { name: "Sydney", color: GameColor.Green, lat: -33.8688, long: 151.2093 }

MapData[CityID.SanFrancisco].posZero = [-6.397, 6.867, 4.708];
MapData[CityID.Chicago].posZero = [-7.463, 7.382, 0.216];
MapData[CityID.Atlanta].posZero = [-9.025, 5.351, 0.422];
MapData[CityID.Montreal].posZero = [-6.300, 8.195, -1.845];
MapData[CityID.Washington].posZero = [-8.297, 6.171, -1.825];
MapData[CityID.NewYork].posZero = [-7.016, 6.778, -3.884];
MapData[CityID.Madrid].posZero = [-1.948, 6.076, -8.339];
MapData[CityID.London].posZero = [-1.282, 8.931, -5.371];
MapData[CityID.Paris].posZero = [-0.295, 7.598, -7.242];
MapData[CityID.Essen].posZero = [1.572, 8.569, -5.860];
MapData[CityID.Milano].posZero = [1.992, 6.752, -7.790];
MapData[CityID.SaintPetersburg].posZero = [2.194, 9.593, -3.661];
MapData[CityID.LosAngeles].posZero = [-8.182, 5.368, 3.805];
MapData[CityID.MexicoCity].posZero = [-9.815, 3.334, 1.670];
MapData[CityID.Miami].posZero = [-9.520, 3.989, -1.925];
MapData[CityID.Bogota].posZero = [-10.063, 0.862, -2.872];
MapData[CityID.Lima].posZero = [-10.007, -2.191, -2.302];
MapData[CityID.Santiago].posZero = [-8.394, -5.740, -2.616];
MapData[CityID.BuenosAires].posZero = [-7.184, -5.974, -4.791];
MapData[CityID.SaoPaulo].posZero = [-6.997, -4.195, -6.609];
MapData[CityID.Lagos].posZero = [0.615, 1.193, -10.414];
MapData[CityID.Kinshasa].posZero = [2.756, -0.813, -10.099];
MapData[CityID.Khartoum].posZero = [5.475, 2.722, -8.536];
MapData[CityID.Johannesburg].posZero = [4.430, -4.636, -8.314];
MapData[CityID.Algiers].posZero = [0.370, 5.322, -9.044];
MapData[CityID.Cairo].posZero = [4.360, 4.931, -8.181];
MapData[CityID.Istanbul].posZero = [4.072, 7.192, -6.477];
MapData[CityID.Moscow].posZero = [4.332, 8.509, -4.369];
MapData[CityID.Baghdad].posZero = [6.057, 5.673, -6.432];
MapData[CityID.Riyadh].posZero = [7.374, 3.554, -6.576];
MapData[CityID.Tehran].posZero = [6.869, 6.681, -4.293];
MapData[CityID.Karachi].posZero = [8.287, 4.626, -4.491];
MapData[CityID.Mumbai].posZero = [9.576, 3.030, -3.061];
MapData[CityID.Delhi].posZero = [8.620, 5.576, -2.203];
MapData[CityID.Chennai].posZero = [10.302, 1.734, -1.050];
MapData[CityID.Calcutta].posZero = [9.589, 4.266, -0.308];
MapData[CityID.Beijing].posZero = [7.104, 7.344, 2.419];
MapData[CityID.Seoul].posZero = [5.916, 7.177, 4.873];
MapData[CityID.Tokyo].posZero = [4.148, 6.665, 6.973];
MapData[CityID.Shanghai].posZero = [7.789, 5.683, 4.158];
MapData[CityID.HongKong].posZero = [9.201, 3.773, 3.369];
MapData[CityID.Bangkok].posZero = [10.120, 2.459, 1.335];
MapData[CityID.Taipei].posZero = [7.964, 3.745, 5.727];
MapData[CityID.Osaka].posZero = [6.228, 5.347, 6.547];
MapData[CityID.Manila].posZero = [8.718, 1.362, 5.691];
MapData[CityID.HoChiMinhCity].posZero = [9.841, 1.183, 3.465];
MapData[CityID.Jakarta].posZero = [9.983, -1.268, 2.997];
MapData[CityID.Sydney].posZero = [4.199, -5.852, 7.641];

export function DEV_GeneratePosZeroCode(): void {
    let output = "";
    for (let cityId = 0; cityId < CityID.LAST; cityId++) {
        let city = Pandemik.DEV_INSTANCE?.map?.cities[cityId];
        if (city) {
            output += `MapData[CityID.${CityID[cityId]}].posZero = [${city.position.x.toFixed(3)}, ${city.position.y.toFixed(3)}, ${city.position.z.toFixed(3)}];\n`;
        }
    }
    console.log(output);
}
(window as any).DEV_GeneratePosZeroCode = DEV_GeneratePosZeroCode;

export interface CityLinkData {
    city1: CityID;
    city2: CityID;
}

export var CityLinks = {
    links: [<CityLinkData>{}]
};

CityLinks.links = [];
CityLinks.links.push({ city1: CityID.SanFrancisco, city2: CityID.Tokyo });
CityLinks.links.push({ city1: CityID.SanFrancisco, city2: CityID.Manila });
CityLinks.links.push({ city1: CityID.SanFrancisco, city2: CityID.LosAngeles });
CityLinks.links.push({ city1: CityID.SanFrancisco, city2: CityID.Chicago });

CityLinks.links.push({ city1: CityID.Chicago, city2: CityID.LosAngeles });
CityLinks.links.push({ city1: CityID.Chicago, city2: CityID.MexicoCity });
CityLinks.links.push({ city1: CityID.Chicago, city2: CityID.Atlanta });
CityLinks.links.push({ city1: CityID.Chicago, city2: CityID.Montreal });

CityLinks.links.push({ city1: CityID.Atlanta, city2: CityID.Washington });
CityLinks.links.push({ city1: CityID.Atlanta, city2: CityID.Miami });

CityLinks.links.push({ city1: CityID.Montreal, city2: CityID.NewYork });
CityLinks.links.push({ city1: CityID.Montreal, city2: CityID.Washington });

CityLinks.links.push({ city1: CityID.Washington, city2: CityID.NewYork });
CityLinks.links.push({ city1: CityID.Washington, city2: CityID.Miami });

CityLinks.links.push({ city1: CityID.NewYork, city2: CityID.Madrid });
CityLinks.links.push({ city1: CityID.NewYork, city2: CityID.London });

CityLinks.links.push({ city1: CityID.Madrid, city2: CityID.London });
CityLinks.links.push({ city1: CityID.Madrid, city2: CityID.Paris });
CityLinks.links.push({ city1: CityID.Madrid, city2: CityID.Algiers });
CityLinks.links.push({ city1: CityID.Madrid, city2: CityID.SaoPaulo });

CityLinks.links.push({ city1: CityID.London, city2: CityID.Paris });
CityLinks.links.push({ city1: CityID.London, city2: CityID.Essen });

CityLinks.links.push({ city1: CityID.Paris, city2: CityID.Essen });
CityLinks.links.push({ city1: CityID.Paris, city2: CityID.Milano });
CityLinks.links.push({ city1: CityID.Paris, city2: CityID.Algiers });

CityLinks.links.push({ city1: CityID.Essen, city2: CityID.Milano });
CityLinks.links.push({ city1: CityID.Essen, city2: CityID.SaintPetersburg });

CityLinks.links.push({ city1: CityID.Milano, city2: CityID.Istanbul });

CityLinks.links.push({ city1: CityID.SaintPetersburg, city2: CityID.Istanbul });
CityLinks.links.push({ city1: CityID.SaintPetersburg, city2: CityID.Moscow });

CityLinks.links.push({ city1: CityID.LosAngeles, city2: CityID.MexicoCity });
CityLinks.links.push({ city1: CityID.LosAngeles, city2: CityID.Sydney });

CityLinks.links.push({ city1: CityID.MexicoCity, city2: CityID.Miami });
CityLinks.links.push({ city1: CityID.MexicoCity, city2: CityID.Bogota });
CityLinks.links.push({ city1: CityID.MexicoCity, city2: CityID.Lima });

CityLinks.links.push({ city1: CityID.Miami, city2: CityID.Bogota });

CityLinks.links.push({ city1: CityID.Bogota, city2: CityID.Lima });
CityLinks.links.push({ city1: CityID.Bogota, city2: CityID.BuenosAires });
CityLinks.links.push({ city1: CityID.Bogota, city2: CityID.SaoPaulo });

CityLinks.links.push({ city1: CityID.Lima, city2: CityID.Santiago });

CityLinks.links.push({ city1: CityID.BuenosAires, city2: CityID.SaoPaulo });

CityLinks.links.push({ city1: CityID.SaoPaulo, city2: CityID.Lagos });

CityLinks.links.push({ city1: CityID.Lagos, city2: CityID.Kinshasa });
CityLinks.links.push({ city1: CityID.Lagos, city2: CityID.Khartoum });

CityLinks.links.push({ city1: CityID.Kinshasa, city2: CityID.Khartoum });
CityLinks.links.push({ city1: CityID.Kinshasa, city2: CityID.Johannesburg });

CityLinks.links.push({ city1: CityID.Khartoum, city2: CityID.Johannesburg });
CityLinks.links.push({ city1: CityID.Khartoum, city2: CityID.Cairo });

CityLinks.links.push({ city1: CityID.Algiers, city2: CityID.Cairo });
CityLinks.links.push({ city1: CityID.Algiers, city2: CityID.Istanbul });

CityLinks.links.push({ city1: CityID.Cairo, city2: CityID.Istanbul });
CityLinks.links.push({ city1: CityID.Cairo, city2: CityID.Baghdad });
CityLinks.links.push({ city1: CityID.Cairo, city2: CityID.Riyadh });

CityLinks.links.push({ city1: CityID.Istanbul, city2: CityID.Moscow });
CityLinks.links.push({ city1: CityID.Istanbul, city2: CityID.Baghdad });

CityLinks.links.push({ city1: CityID.Moscow, city2: CityID.Tehran });

CityLinks.links.push({ city1: CityID.Baghdad, city2: CityID.Riyadh });
CityLinks.links.push({ city1: CityID.Baghdad, city2: CityID.Tehran });
CityLinks.links.push({ city1: CityID.Baghdad, city2: CityID.Karachi });

CityLinks.links.push({ city1: CityID.Riyadh, city2: CityID.Karachi });

CityLinks.links.push({ city1: CityID.Tehran, city2: CityID.Karachi });
CityLinks.links.push({ city1: CityID.Tehran, city2: CityID.Delhi });

CityLinks.links.push({ city1: CityID.Karachi, city2: CityID.Mumbai });
CityLinks.links.push({ city1: CityID.Karachi, city2: CityID.Delhi });

CityLinks.links.push({ city1: CityID.Mumbai, city2: CityID.Delhi });
CityLinks.links.push({ city1: CityID.Mumbai, city2: CityID.Chennai });

CityLinks.links.push({ city1: CityID.Delhi, city2: CityID.Chennai });
CityLinks.links.push({ city1: CityID.Delhi, city2: CityID.Calcutta });

CityLinks.links.push({ city1: CityID.Chennai, city2: CityID.Calcutta });
CityLinks.links.push({ city1: CityID.Chennai, city2: CityID.Bangkok });
CityLinks.links.push({ city1: CityID.Chennai, city2: CityID.Jakarta });

CityLinks.links.push({ city1: CityID.Calcutta, city2: CityID.HongKong });
CityLinks.links.push({ city1: CityID.Calcutta, city2: CityID.Bangkok });

CityLinks.links.push({ city1: CityID.Beijing, city2: CityID.Seoul });
CityLinks.links.push({ city1: CityID.Beijing, city2: CityID.Shanghai });

CityLinks.links.push({ city1: CityID.Seoul, city2: CityID.Tokyo });
CityLinks.links.push({ city1: CityID.Seoul, city2: CityID.Shanghai });

CityLinks.links.push({ city1: CityID.Tokyo, city2: CityID.Shanghai });
CityLinks.links.push({ city1: CityID.Tokyo, city2: CityID.Osaka });

CityLinks.links.push({ city1: CityID.Shanghai, city2: CityID.HongKong });
CityLinks.links.push({ city1: CityID.Shanghai, city2: CityID.Taipei });

CityLinks.links.push({ city1: CityID.HongKong, city2: CityID.Bangkok });
CityLinks.links.push({ city1: CityID.HongKong, city2: CityID.Taipei });
CityLinks.links.push({ city1: CityID.HongKong, city2: CityID.Manila });
CityLinks.links.push({ city1: CityID.HongKong, city2: CityID.HoChiMinhCity });

CityLinks.links.push({ city1: CityID.Bangkok, city2: CityID.HoChiMinhCity });
CityLinks.links.push({ city1: CityID.Bangkok, city2: CityID.Jakarta });

CityLinks.links.push({ city1: CityID.Taipei, city2: CityID.Osaka });
CityLinks.links.push({ city1: CityID.Taipei, city2: CityID.Manila });

CityLinks.links.push({ city1: CityID.Manila, city2: CityID.HoChiMinhCity });
CityLinks.links.push({ city1: CityID.Manila, city2: CityID.Sydney });

CityLinks.links.push({ city1: CityID.HoChiMinhCity, city2: CityID.Jakarta });

CityLinks.links.push({ city1: CityID.Jakarta, city2: CityID.Sydney });
/*
Beijing,
Seoul,
Tokyo,
Shanghai,
HongKong,
Bangkok,
Taipei,
Osaka,
Manila,
HoChiMinhCity,
Jakarta,
Sydney,
*/