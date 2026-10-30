import { CityDataList, GameColor, CityDataById, CityLinkDataList, GameColors, CityRings } from "./data";

export function LoadFranceData(): void {

    CityDataList.push({ id: "paris", name: "Paris", color: GameColor.Blue, lat: 48.8566, long: 2.3522 });
    CityDataList.push({ id: "marseille", name: "Marseille", color: GameColor.Green, lat: 43.2965, long: 5.3698 });
    CityDataList.push({ id: "lyon", name: "Lyon", color: GameColor.Green, lat: 45.764, long: 4.8357 });
    CityDataList.push({ id: "toulouse", name: "Toulouse", color: GameColor.Yellow, lat: 43.6047, long: 1.4442 });
    CityDataList.push({ id: "nice", name: "Nice", color: GameColor.Green, lat: 43.7102, long: 7.2620 });
    CityDataList.push({ id: "nantes", name: "Nantes", color: GameColor.Yellow, lat: 47.2184, long: -1.5536 });
    CityDataList.push({ id: "montpellier", name: "Montpellier", color: GameColor.Green, lat: 43.6119, long: 3.8772 });
    CityDataList.push({ id: "strasbourg", name: "Strasbourg", color: GameColor.Black, lat: 48.5734, long: 7.7521 });
    CityDataList.push({ id: "bordeaux", name: "Bordeaux", color: GameColor.Yellow, lat: 44.8378, long: -0.5792 });
    CityDataList.push({ id: "lille", name: "Lille", color: GameColor.Black, lat: 50.6292, long: 3.0573 });
    CityDataList.push({ id: "rennes", name: "Rennes", color: GameColor.Yellow, lat: 48.1173, long: -1.6778 });
    CityDataList.push({ id: "toulon", name: "Toulon", color: GameColor.Green, lat: 43.1242, long: 5.9280 });
    CityDataList.push({ id: "reims", name: "Reims", color: GameColor.Black, lat: 49.2583, long: 4.0317 });
    CityDataList.push({ id: "saintetienne", name: "Saint-Étienne", color: GameColor.Green, lat: 45.4397, long: 4.3872 });
    CityDataList.push({ id: "lehavre", name: "Le Havre", color: GameColor.Yellow, lat: 49.4944, long: 0.1079 });
    //CityDataList.push({ id: "villeurbanne", name: "Villeurbanne", color: GameColor.Green, lat: 45.7719, long: 4.8902 });
    CityDataList.push({ id: "dijon", name: "Dijon", color: GameColor.Black, lat: 47.3220, long: 5.0415 });
    CityDataList.push({ id: "angers", name: "Angers", color: GameColor.Yellow, lat: 47.4784, long: -0.5632 });
    CityDataList.push({ id: "grenoble", name: "Grenoble", color: GameColor.Green, lat: 45.1885, long: 5.7245 });
    //CityDataList.push({ id: "saintdenis", name: "Saint-Denis", color: GameColor.Yellow, lat: -20.8821, long: 55.4500 });
    CityDataList.push({ id: "nimes", name: "Nîmes", color: GameColor.Green, lat: 43.8367, long: 4.3601 });
    CityDataList.push({ id: "aixenprovence", name: "Aix-en-Provence", color: GameColor.Green, lat: 43.5297, long: 5.4474 });
    CityDataList.push({ id: "saintdenis", name: "Saint-Denis", color: GameColor.Blue, lat: 48.9362, long: 2.3574 });
    CityDataList.push({ id: "clermontferrand", name: "Clermont-Ferrand", color: GameColor.Yellow, lat: 45.7772, long: 3.0870 });
    CityDataList.push({ id: "lemans", name: "Le Mans", color: GameColor.Yellow, lat: 48.0061, long: 0.1996 });
    CityDataList.push({ id: "brest", name: "Brest", color: GameColor.Yellow, lat: 48.3904, long: -4.4861 });
    CityDataList.push({ id: "tours", name: "Tours", color: GameColor.Yellow, lat: 47.3941, long: 0.6848 });
    CityDataList.push({ id: "amiens", name: "Amiens", color: GameColor.Black, lat: 49.8941, long: 2.2958 });
    CityDataList.push({ id: "annecy", name: "Annecy", color: GameColor.Green, lat: 45.8992, long: 6.1294 });
    CityDataList.push({ id: "limoges", name: "Limoges", color: GameColor.Yellow, lat: 45.8336, long: 1.2611 });
    CityDataList.push({ id: "metz", name: "Metz", color: GameColor.Black, lat: 49.1193, long: 6.1757 });
    CityDataList.push({ id: "algrange", name: "Algrange", color: GameColor.Black, lat: 49.3667, long: 6.0167 });
    CityDataList.push({ id: "perpignan", name: "Perpignan", color: GameColor.Green, lat: 42.6887, long: 2.8948 });
    CityDataList.push({ id: "boulognebillancourt", name: "Boulogne-Billancourt", color: GameColor.Blue, lat: 48.8397, long: 2.2399 });
    CityDataList.push({ id: "besancon", name: "Besançon", color: GameColor.Black, lat: 47.2378, long: 6.0241 });
    CityDataList.push({ id: "rouen", name: "Rouen", color: GameColor.Blue, lat: 49.4431, long: 1.0993 });
    CityDataList.push({ id: "orleans", name: "Orléans", color: GameColor.Blue, lat: 47.9029, long: 1.9093 });
    CityDataList.push({ id: "montreuil", name: "Montreuil", color: GameColor.Blue, lat: 48.8638, long: 2.4486 });
    CityDataList.push({ id: "caen", name: "Caen", color: GameColor.Yellow, lat: 49.1829, long: -0.3707 });
    //CityDataList.push({ id: "saintpaul", name: "Saint-Paul", color: GameColor.Yellow, lat: -21.0096, long: 55.2708 });
    CityDataList.push({ id: "argenteuil", name: "Argenteuil", color: GameColor.Blue, lat: 48.9472, long: 2.2467 });
    CityDataList.push({ id: "mulhouse", name: "Mulhouse", color: GameColor.Black, lat: 47.7508, long: 7.3359 });
    CityDataList.push({ id: "nancy", name: "Nancy", color: GameColor.Black, lat: 48.6921, long: 6.1844 });
    CityDataList.push({ id: "tourcoing", name: "Tourcoing", color: GameColor.Black, lat: 50.7239, long: 3.1614 });
    CityDataList.push({ id: "roubaix", name: "Roubaix", color: GameColor.Black, lat: 50.6920, long: 3.1743 });
    CityDataList.push({ id: "nanterre", name: "Nanterre", color: GameColor.Blue, lat: 48.8924, long: 2.2060 });
    CityDataList.push({ id: "vitrysurseine", name: "Vitry-sur-Seine", color: GameColor.Blue, lat: 48.7874, long: 2.3910 });
    CityDataList.push({ id: "asnieressurseine", name: "Asnières-sur-Seine", color: GameColor.Blue, lat: 48.9080, long: 2.2876 });
    CityDataList.push({ id: "creteil", name: "Créteil", color: GameColor.Blue, lat: 48.7904, long: 2.4550 });
    CityDataList.push({ id: "avignon", name: "Avignon", color: GameColor.Green, lat: 43.9493, long: 4.8055 });
    CityDataList.push({ id: "colombes", name: "Colombes", color: GameColor.Blue, lat: 48.9234, long: 2.2523 });

    for (const color of GameColors) {
        console.log(GameColor[color] + " city loaded count " + CityDataList.filter(city => city.color === color).length);
    }

    CityRings.push(["paris", "montreuil", "creteil", "vitrysurseine", "boulognebillancourt", "nanterre", "colombes", "argenteuil", "asnieressurseine", "saintdenis"]);

    CityDataById("paris").posZero = [5.487, 150.852, -131.962]
    CityDataById("marseille").posZero = [13.196, 137.112, -145.692]
    CityDataById("lyon").posZero = [11.887, 143.879, -139.132]
    CityDataById("toulouse").posZero = [3.631, 138.280, -145.141]
    CityDataById("nice").posZero = [18.409, 138.561, -143.744]
    CityDataById("nantes").posZero = [-3.902, 147.049, -136.241]
    CityDataById("montpellier").posZero = [9.361, 137.993, -145.157]
    CityDataById("strasbourg").posZero = [18.029, 150.376, -131.386]
    CityDataById("bordeaux").posZero = [-1.454, 141.365, -142.176]
    CityDataById("lille").posZero = [5.947, 155.026, -127.011]
    CityDataById("rennes").posZero = [-4.031, 149.331, -133.732]
    CityDataById("toulon").posZero = [15.560, 136.807, -145.747]
    CityDataById("reims").posZero = [9.774, 152.041, -130.339]
    CityDataById("saintetienne").posZero = [10.539, 142.660, -140.489]
    CityDataById("lehavre").posZero = [-0.067, 152.739, -129.889]
    CityDataById("dijon").posZero = [11.772, 147.405, -135.401]
    CityDataById("angers").posZero = [-1.378, 147.688, -135.597]
    CityDataById("grenoble").posZero = [14.191, 142.137, -140.698]
    CityDataById("nimes").posZero = [10.669, 139.041, -144.063]
    CityDataById("aixenprovence").posZero = [14.223, 138.375, -144.396]
    CityDataById("saintdenis").posZero = [7.573, 151.906, -130.643]
    CityDataById("clermontferrand").posZero = [7.454, 143.700, -139.625]
    CityDataById("lemans").posZero = [0.349, 149.098, -134.052]
    CityDataById("brest").posZero = [-10.428, 149.912, -132.732]
    CityDataById("tours").posZero = [1.643, 147.388, -135.920]
    CityDataById("amiens").posZero = [4.869, 153.740, -128.610]
    CityDataById("annecy").posZero = [15.057, 144.054, -138.643]
    CityDataById("limoges").posZero = [3.051, 143.807, -139.680]
    CityDataById("metz").posZero = [14.729, 151.603, -130.383]
    CityDataById("algrange").posZero = [13.264, 152.529, -129.458]
    CityDataById("perpignan").posZero = [7.402, 135.883, -147.246]
    CityDataById("boulognebillancourt").posZero = [4.038, 149.491, -133.553]
    CityDataById("besancon").posZero = [14.440, 147.161, -135.408]
    CityDataById("rouen").posZero = [2.141, 152.751, -129.857]
    CityDataById("orleans").posZero = [4.393, 148.144, -135.035]
    CityDataById("montreuil").posZero = [8.234, 150.731, -131.957]
    CityDataById("caen").posZero = [-1.212, 151.534, -131.286]
    CityDataById("argenteuil").posZero = [4.258, 152.375, -130.246]
    CityDataById("mulhouse").posZero = [17.298, 148.357, -133.759]
    CityDataById("nancy").posZero = [14.124, 150.300, -131.950]
    CityDataById("tourcoing").posZero = [7.200, 155.946, -125.814]
    CityDataById("roubaix").posZero = [7.938, 154.769, -127.215]
    CityDataById("nanterre").posZero = [2.736, 150.340, -132.629]
    CityDataById("vitrysurseine").posZero = [6.027, 149.100, -133.915]
    CityDataById("asnieressurseine").posZero = [6.100, 152.569, -129.945]
    CityDataById("creteil").posZero = [7.672, 149.595, -133.277]
    CityDataById("avignon").posZero = [12.453, 139.526, -143.449]
    CityDataById("colombes").posZero = [2.985, 151.488, -131.311]

    CityLinkDataList.push({ cityId1: "paris", cityId2: "montreuil" })
    CityLinkDataList.push({ cityId1: "paris", cityId2: "creteil" })
    CityLinkDataList.push({ cityId1: "paris", cityId2: "vitrysurseine" })
    CityLinkDataList.push({ cityId1: "paris", cityId2: "boulognebillancourt" })
    CityLinkDataList.push({ cityId1: "paris", cityId2: "nanterre" })
    CityLinkDataList.push({ cityId1: "paris", cityId2: "argenteuil" })
    CityLinkDataList.push({ cityId1: "paris", cityId2: "saintdenis" })
    CityLinkDataList.push({ cityId1: "marseille", cityId2: "toulon" })
    CityLinkDataList.push({ cityId1: "lyon", cityId2: "grenoble" })
    CityLinkDataList.push({ cityId1: "lyon", cityId2: "clermontferrand" })
    CityLinkDataList.push({ cityId1: "toulouse", cityId2: "perpignan" })
    CityLinkDataList.push({ cityId1: "toulouse", cityId2: "limoges" })
    CityLinkDataList.push({ cityId1: "nice", cityId2: "aixenprovence" })
    CityLinkDataList.push({ cityId1: "nantes", cityId2: "rennes" })
    CityLinkDataList.push({ cityId1: "montpellier", cityId2: "nimes" })
    CityLinkDataList.push({ cityId1: "montpellier", cityId2: "toulouse" })
    CityLinkDataList.push({ cityId1: "strasbourg", cityId2: "mulhouse" })
    CityLinkDataList.push({ cityId1: "bordeaux", cityId2: "toulouse" })
    CityLinkDataList.push({ cityId1: "lille", cityId2: "tourcoing" })
    CityLinkDataList.push({ cityId1: "lille", cityId2: "amiens" })
    CityLinkDataList.push({ cityId1: "rennes", cityId2: "brest" })
    CityLinkDataList.push({ cityId1: "rennes", cityId2: "lemans" })
    CityLinkDataList.push({ cityId1: "toulon", cityId2: "nice" })
    CityLinkDataList.push({ cityId1: "reims", cityId2: "metz" })
    CityLinkDataList.push({ cityId1: "saintetienne", cityId2: "lyon" })
    CityLinkDataList.push({ cityId1: "saintetienne", cityId2: "grenoble" })
    CityLinkDataList.push({ cityId1: "lehavre", cityId2: "rouen" })
    CityLinkDataList.push({ cityId1: "dijon", cityId2: "besancon" })
    CityLinkDataList.push({ cityId1: "dijon", cityId2: "lyon" })
    CityLinkDataList.push({ cityId1: "angers", cityId2: "nantes" })
    CityLinkDataList.push({ cityId1: "angers", cityId2: "tours" })
    CityLinkDataList.push({ cityId1: "grenoble", cityId2: "aixenprovence" })
    CityLinkDataList.push({ cityId1: "grenoble", cityId2: "annecy" })
    CityLinkDataList.push({ cityId1: "nimes", cityId2: "avignon" })
    CityLinkDataList.push({ cityId1: "aixenprovence", cityId2: "marseille" })
    CityLinkDataList.push({ cityId1: "aixenprovence", cityId2: "toulon" })
    CityLinkDataList.push({ cityId1: "saintdenis", cityId2: "asnieressurseine" })
    CityLinkDataList.push({ cityId1: "saintdenis", cityId2: "reims" })
    CityLinkDataList.push({ cityId1: "clermontferrand", cityId2: "limoges" })
    CityLinkDataList.push({ cityId1: "lemans", cityId2: "angers" })
    CityLinkDataList.push({ cityId1: "tours", cityId2: "limoges" })
    CityLinkDataList.push({ cityId1: "amiens", cityId2: "roubaix" })
    CityLinkDataList.push({ cityId1: "amiens", cityId2: "argenteuil" })
    CityLinkDataList.push({ cityId1: "annecy", cityId2: "lyon" })
    CityLinkDataList.push({ cityId1: "limoges", cityId2: "bordeaux" })
    CityLinkDataList.push({ cityId1: "metz", cityId2: "nancy" })
    CityLinkDataList.push({ cityId1: "metz", cityId2: "strasbourg" })
    CityLinkDataList.push({ cityId1: "metz", cityId2: "algrange" })
    CityLinkDataList.push({ cityId1: "perpignan", cityId2: "montpellier" })
    CityLinkDataList.push({ cityId1: "boulognebillancourt", cityId2: "tours" })
    CityLinkDataList.push({ cityId1: "boulognebillancourt", cityId2: "orleans" })
    CityLinkDataList.push({ cityId1: "rouen", cityId2: "argenteuil" })
    CityLinkDataList.push({ cityId1: "orleans", cityId2: "tours" })
    CityLinkDataList.push({ cityId1: "orleans", cityId2: "vitrysurseine" })
    CityLinkDataList.push({ cityId1: "montreuil", cityId2: "saintdenis" })
    CityLinkDataList.push({ cityId1: "caen", cityId2: "lehavre" })
    CityLinkDataList.push({ cityId1: "caen", cityId2: "rennes" })
    CityLinkDataList.push({ cityId1: "caen", cityId2: "lemans" })
    CityLinkDataList.push({ cityId1: "argenteuil", cityId2: "colombes" })
    CityLinkDataList.push({ cityId1: "mulhouse", cityId2: "besancon" })
    CityLinkDataList.push({ cityId1: "nancy", cityId2: "reims" })
    CityLinkDataList.push({ cityId1: "nancy", cityId2: "besancon" })
    CityLinkDataList.push({ cityId1: "nancy", cityId2: "strasbourg" })
    CityLinkDataList.push({ cityId1: "nancy", cityId2: "dijon" })
    CityLinkDataList.push({ cityId1: "tourcoing", cityId2: "roubaix" })
    CityLinkDataList.push({ cityId1: "roubaix", cityId2: "lille" })
    CityLinkDataList.push({ cityId1: "nanterre", cityId2: "boulognebillancourt" })
    CityLinkDataList.push({ cityId1: "nanterre", cityId2: "lemans" })
    CityLinkDataList.push({ cityId1: "nanterre", cityId2: "caen" })
    CityLinkDataList.push({ cityId1: "vitrysurseine", cityId2: "boulognebillancourt" })
    CityLinkDataList.push({ cityId1: "vitrysurseine", cityId2: "creteil" })
    CityLinkDataList.push({ cityId1: "asnieressurseine", cityId2: "paris" })
    CityLinkDataList.push({ cityId1: "asnieressurseine", cityId2: "argenteuil" })
    CityLinkDataList.push({ cityId1: "asnieressurseine", cityId2: "amiens" })
    CityLinkDataList.push({ cityId1: "creteil", cityId2: "montreuil" })
    CityLinkDataList.push({ cityId1: "creteil", cityId2: "dijon" })
    CityLinkDataList.push({ cityId1: "avignon", cityId2: "aixenprovence" })
    CityLinkDataList.push({ cityId1: "avignon", cityId2: "marseille" })
    CityLinkDataList.push({ cityId1: "avignon", cityId2: "grenoble" })
    CityLinkDataList.push({ cityId1: "colombes", cityId2: "nanterre" })
    CityLinkDataList.push({ cityId1: "colombes", cityId2: "paris" })
}
