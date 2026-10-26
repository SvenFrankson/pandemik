import { BlueColor, YellowColor, BlackColor, RedColor } from "./constants";

export enum CityColor {
    Blue,
    Yellow,
    Black,
    Red
}

export const CityColor3s = [
    BlueColor,
    YellowColor,
    BlackColor,
    RedColor
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
    Milan,
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
    color: CityColor;
    lat: number;
    long: number;
}

export var MapData = {
    cities: [<CityData>{}]
};

MapData.cities[CityID.SanFrancisco] = { name: "San Francisco", color: CityColor.Blue, lat: 37.7749, long: -122.4194 };
MapData.cities[CityID.Chicago] = { name: "Chicago", color: CityColor.Blue, lat: 41.8781, long: -87.6298 }
MapData.cities[CityID.Atlanta] = { name: "Atlanta", color: CityColor.Blue, lat: 33.7490, long: -84.3880 }
MapData.cities[CityID.Montreal] = { name: "Montreal", color: CityColor.Blue, lat: 45.5017, long: -73.5673 }
MapData.cities[CityID.Washington] = { name: "Washington", color: CityColor.Blue, lat: 38.9072, long: -77.0369 }
MapData.cities[CityID.NewYork] = { name: "New York", color: CityColor.Blue, lat: 40.7128, long: -74.0060 }
MapData.cities[CityID.Madrid] = { name: "Madrid", color: CityColor.Blue, lat: 40.4168, long: -3.7038 }
MapData.cities[CityID.London] = { name: "London", color: CityColor.Blue, lat: 51.5074, long: -0.1278 }
MapData.cities[CityID.Paris] = { name: "Paris", color: CityColor.Blue, lat: 48.8566, long: 2.3522 }
MapData.cities[CityID.Essen] = { name: "Essen", color: CityColor.Blue, lat: 51.4556, long: 7.0116 }
MapData.cities[CityID.Milan ] = { name: "Milan", color: CityColor.Blue, lat: 45.4642, long: 9.1900 }
MapData.cities[CityID.SaintPetersburg] = { name: "Saint Petersburg", color: CityColor.Blue, lat: 59.9343, long: 30.3351 }
MapData.cities[CityID.LosAngeles] = { name: "Los Angeles", color: CityColor.Yellow, lat: 34.0522, long: -118.2437 }
MapData.cities[CityID.MexicoCity] = { name: "Mexico City", color: CityColor.Yellow, lat: 19.4326, long: -99.1332 }
MapData.cities[CityID.Miami] = { name: "Miami", color: CityColor.Yellow, lat: 25.7617, long: -80.1918 }
MapData.cities[CityID.Bogota] = { name: "Bogotá", color: CityColor.Yellow, lat: 4.7110, long: -74.0721 }
MapData.cities[CityID.Lima] = { name: "Lima", color: CityColor.Yellow, lat: -12.0464, long: -77.0428 }
MapData.cities[CityID.Santiago] = { name: "Santiago", color: CityColor.Yellow, lat: -33.4489, long: -70.6693 }
MapData.cities[CityID.BuenosAires] = { name: "Buenos Aires", color: CityColor.Yellow, lat: -34.6037, long: -58.3816 }
MapData.cities[CityID.SaoPaulo] = { name: "Sao Paulo", color: CityColor.Yellow, lat: -23.5505, long: -46.6333 }
MapData.cities[CityID.Lagos] = { name: "Lagos", color: CityColor.Yellow, lat: 6.5244, long: 3.3792 }
MapData.cities[CityID.Kinshasa] = { name: "Kinshasa", color: CityColor.Yellow, lat: -4.4419, long: 15.2663 }
MapData.cities[CityID.Khartoum] = { name: "Khartoum", color: CityColor.Yellow, lat: 15.5007, long: 32.5599 }
MapData.cities[CityID.Johannesburg] = { name: "Johannesburg", color: CityColor.Yellow, lat: -26.2041, long: 28.0473 }
MapData.cities[CityID.Algiers] = { name: "Algiers", color: CityColor.Black, lat: 36.7538, long: 3.0588 }
MapData.cities[CityID.Cairo] = { name: "Cairo", color: CityColor.Black, lat: 30.0444, long: 31.2357 }
MapData.cities[CityID.Istanbul] = { name: "Istanbul", color: CityColor.Black, lat: 41.0082, long: 28.9784 }
MapData.cities[CityID.Moscow] = { name: "Moscow", color: CityColor.Black, lat: 55.7558, long: 37.6173 }
MapData.cities[CityID.Baghdad] = { name: "Baghdad", color: CityColor.Black, lat: 33.3152, long: 44.3661 }
MapData.cities[CityID.Riyadh] = { name: "Riyadh", color: CityColor.Black, lat: 24.7136, long: 46.6753 }
MapData.cities[CityID.Tehran] = { name: "Tehran", color: CityColor.Black, lat: 35.6892, long: 51.3890 }
MapData.cities[CityID.Karachi] = { name: "Karachi", color: CityColor.Black, lat: 24.8607, long: 67.0011 }
MapData.cities[CityID.Mumbai] = { name: "Mumbai", color: CityColor.Black, lat: 19.0760, long: 72.8777 }
MapData.cities[CityID.Delhi] = { name: "Delhi", color: CityColor.Black, lat: 28.6139, long: 77.2090 }
MapData.cities[CityID.Chennai] = { name: "Chennai", color: CityColor.Black, lat: 13.0827, long: 80.2707 }
MapData.cities[CityID.Calcutta] = { name: "Calcutta", color: CityColor.Black, lat: 22.5726, long: 88.3639 }
MapData.cities[CityID.Beijing] = { name: "Beijing", color: CityColor.Red, lat: 39.9042, long: 116.4074 }
MapData.cities[CityID.Seoul] = { name: "Seoul", color: CityColor.Red, lat: 37.5665, long: 126.9780 }
MapData.cities[CityID.Tokyo] = { name: "Tokyo", color: CityColor.Red, lat: 35.6895, long: 139.6917 }
MapData.cities[CityID.Shanghai] = { name: "Shanghai", color: CityColor.Red, lat: 31.2304, long: 121.4737 }
MapData.cities[CityID.HongKong] = { name: "Hong Kong", color: CityColor.Red, lat: 22.3193, long: 114.1694 }
MapData.cities[CityID.Bangkok] = { name: "Bangkok", color: CityColor.Red, lat: 13.7563, long: 100.5018 }
MapData.cities[CityID.Taipei] = { name: "Taipei", color: CityColor.Red, lat: 25.0330, long: 121.5654 }
MapData.cities[CityID.Osaka] = { name: "Osaka", color: CityColor.Red, lat: 34.6937, long: 135.5023 }
MapData.cities[CityID.Manila] = { name: "Manila", color: CityColor.Red, lat: 14.5995, long: 120.9842 }
MapData.cities[CityID.HoChiMinhCity] = { name: "Ho Chi Minh City", color: CityColor.Red, lat: 10.7769, long: 106.7009 }
MapData.cities[CityID.Jakarta] = { name: "Jakarta", color: CityColor.Red, lat: -6.2088, long: 106.8456 }
MapData.cities[CityID.Sydney] = { name: "Sydney", color: CityColor.Red, lat: -33.8688, long: 151.2093 }

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
CityLinks.links.push({ city1: CityID.Paris, city2: CityID.Milan });
CityLinks.links.push({ city1: CityID.Paris, city2: CityID.Algiers });

CityLinks.links.push({ city1: CityID.Essen, city2: CityID.Milan });
CityLinks.links.push({ city1: CityID.Essen, city2: CityID.SaintPetersburg });

CityLinks.links.push({ city1: CityID.Milan, city2: CityID.Istanbul });

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