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

export interface CityLinkData {
    cityId1: string;
    cityId2: string;
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

export var CityLinkDataList: CityLinkData[] = [];

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

export function DEV_GenerateLinkCode(): void {
    let output = "";
    for (let cityIndex = 0; cityIndex < CityDataList.length; cityIndex++) {
        let city = Pandemik.DEV_INSTANCE?.map?.cities[cityIndex];
        if (city) {
            for (let link of city.links) {
                if (city === link.cityA) {
                    output += `CityLinkDataList.push({ cityId1: "${city.id}", cityId2: "${link.cityB.id}" })\n`;
                }
            }
        }
    }
    console.log(output);
}
(window as any).DEV_GenerateLinkCode = DEV_GenerateLinkCode;