import { Injectable } from "@angular/core";
import { Scene } from "@babylonjs/core/scene.pure";
import { Player, RandomAvailableRole } from "./player";
import { BreakingInfo, BreakingNewsConnector } from "./ui-connectors/breaking-news-connector";
import { GlowLayer } from "@babylonjs/core/Layers/glowLayer";
import { Board } from "./board";
import type { AudioEngineV2 } from "@babylonjs/core/AudioV2/abstractAudio/audioEngineV2";
import { CreateAudioEngineAsync } from "@babylonjs/core/AudioV2/webAudio/webAudioEngine";
import type { SpotLight } from "@babylonjs/core/Lights/spotLight.pure";
import { DirectionalLight } from "@babylonjs/core/Lights/directionalLight.pure";
import { Vector3 } from "@babylonjs/core/Maths/math.vector.pure";
import { ArcRotateCamera } from "@babylonjs/core/Cameras/arcRotateCamera.pure";
import { Engine } from "@babylonjs/core/Engines/engine.pure";
import { HemisphericLight, Matrix } from "@babylonjs/core";
import { InfectionCard } from "./deck/infection-card";
import { CityCard } from "./deck/city-card";
import { Deck, PlayerCard } from "./deck/deck";
import { CityDataList, CityIdToIndex, DiseaseNames } from "./data";
import { GameCamera } from "./game-camera";
import { CityActionMenuConnector } from "./ui-connectors/city-action-menu-connector";
import { City, CityPart } from "./city";
import { GameMaster } from "./game-master";
import { SharedMaterials } from "./materials";
import { EpidemyCard } from "./deck/epidemic-card";
import { LoadWorldData } from "./data-world";
import { LoadFranceData } from "./data-france";

export class Pandemik {

    public DEBUG_MODE: boolean = false;
    public DEV_MODE: boolean = true;
    public static DEV_INSTANCE: Pandemik | null = null;

    public canvas: HTMLCanvasElement;
    public engine: Engine;
    public audioEngine: AudioEngineV2 | null = null;
    public get audioVolume(): number {
        return this.audioEngine ? this.audioEngine.volume : 0;
    }
    public set audioVolume(v: number) {
        if (this.audioEngine) {
            this.audioEngine.setVolume(v);
        }
    }
    public scene: Scene;
    public getScene(): Scene | null {
        return this.scene;
    }
    public gameCamera: GameCamera;
    public ambientLight: HemisphericLight;
    public glowLayer: GlowLayer;
    public sharedMaterials: SharedMaterials;

    public map: Board | null = null;
    public infectionDeck: Deck<InfectionCard> | null = null;
    public infectionDiscardPile: Deck<InfectionCard> | null = null;
    public playerDeck: Deck<PlayerCard> | null = null;
    public playerDiscardPile: Deck<PlayerCard> | null = null;
    public players: Player[] = [];
    public currentPlayerIndex: number = 0;
    public get currentPlayer(): Player | null {
        return this.players.length > 0 ? this.players[this.currentPlayerIndex] : null;
    }

    public gameMaster: GameMaster;
    public cityActionMenuConnector: CityActionMenuConnector;
    public breakingNewsConnector: BreakingNewsConnector;

    private _selectedCity: City | null = null;
    public get selectedCity(): City | null {
        return this._selectedCity;
    }
    public set selectedCity(city: City | null) {
        console.log("Selected city changed to:", city);
        if (this._selectedCity) {
            this._selectedCity.unselect();
        }
        this._selectedCity = city;
        if (this._selectedCity) {
            this._selectedCity.select();
            this.gameCamera?.goTo(this._selectedCity.position, 0.5);
        }
        this.cityActionMenuConnector.city = city;
    }
    private DEV_MODE_CONNECTING: boolean = false;

    constructor(canvas: HTMLCanvasElement) {
        Pandemik.DEV_INSTANCE = this;
        this.canvas = canvas;
        this.engine = new Engine(canvas, true, undefined, true);
        (async () => {
            this.audioEngine = await CreateAudioEngineAsync();
        })();

        this.scene = new Scene(this.engine);
        this.scene.clearColor.set(0, 0, 0, 0);

        this.gameCamera = new GameCamera(30, Vector3.Zero(), this.scene);
        this.gameCamera.wheelPrecision *= 2;
        this.gameCamera.attachControl(canvas, true);

        this.ambientLight = new HemisphericLight("hemispheric-light", (new Vector3(2, 1, 3)).normalize(), this.scene);
        this.ambientLight.groundColor.copyFromFloats(0.5, 0.5, 0.5);
        this.ambientLight.diffuse.copyFromFloats(1, 1, 1);

        this.glowLayer = new GlowLayer("glow-layer", this.scene);

        this.gameMaster = new GameMaster(this);
        this.cityActionMenuConnector = new CityActionMenuConnector(this);
        this.breakingNewsConnector = new BreakingNewsConnector(this);
        this.sharedMaterials = new SharedMaterials(this);
    }

    public async initialize(): Promise<void> {
        LoadFranceData();

        this.map = new Board(this);
        await this.map.instantiate();
        let atlanta = this.map!.cities[0];
        requestAnimationFrame(() => {
            this.gameCamera?.goTo(atlanta.position, 1, 15 + this.map!.projection.radius);
        });

        this.infectionDeck = new Deck<InfectionCard>();
        for (let cityId = 0; cityId < CityDataList.length; cityId++) {
            this.infectionDeck.addCard(new InfectionCard(CityDataList[cityId].id));
        }
        this.infectionDeck.shuffle();
        this.infectionDiscardPile = new Deck<InfectionCard>();

        this.playerDeck = new Deck<PlayerCard>();
        for (let cityId = 0; cityId < CityDataList.length; cityId++) {
            this.playerDeck.addCard(new CityCard(CityDataList[cityId].id));
        }
        this.playerDeck.shuffle();

        this.map.onceStabilized(async () => {

            this.canvas?.addEventListener("pointerdown", this._pointerDown);
            this.canvas?.addEventListener("pointerup", this._pointerUp);
            this.canvas?.addEventListener("keydown", this._keyDown);
            this.canvas?.addEventListener("keyup", this._keyUp);

            const draws = 3;
            for (let n = 0; n < draws; n++) {
                let card = this.infectionDeck!.drawCard();
                if (card) {
                    this.infectionDiscardPile!.addCard(card);
                    let city = this.map!.getCityById(card.cityId);
                    if (city) {
                        this.breakingNewsConnector.addBreakingInfo(
                            new BreakingInfo(DiseaseNames[card.diseaseColor].toLocaleUpperCase() + " epidemic. +3", city, 2)
                        )
                        await this.gameMaster.infect(city, card.diseaseColor, 3);
                    }
                    else {
                        console.error(`City with ID ${card.cityId} not found`);
                    }
                }
            }
            for (let n = 0; n < draws; n++) {
                let card = this.infectionDeck!.drawCard();
                if (card) {
                    this.infectionDiscardPile!.addCard(card);
                    let city = this.map!.getCityById(card.cityId);
                    if (city) {
                        this.breakingNewsConnector.addBreakingInfo(
                            new BreakingInfo("Multiple " + DiseaseNames[card.diseaseColor].toLocaleUpperCase() + " infections. +2", city, 1)
                        )
                        await this.gameMaster.infect(city, card.diseaseColor, 2);
                    }
                    else {
                        console.error(`City with ID ${card.cityId} not found`);
                    }
                }
            }
            for (let n = 0; n < draws; n++) {
                let card = this.infectionDeck!.drawCard();
                if (card) {
                    this.infectionDiscardPile!.addCard(card);
                    let city = this.map!.getCityById(card.cityId);
                    if (city) {
                        this.breakingNewsConnector.addBreakingInfo(
                            new BreakingInfo(DiseaseNames[card.diseaseColor].toLocaleUpperCase() + " infection. +1", city, 0)
                        )
                        await this.gameMaster.infect(city, card.diseaseColor, 1);
                    }
                    else {
                        console.error(`City with ID ${card.cityId} not found`);
                    }
                }
            }

            await this.gameCamera!.goTo(atlanta.position, 1, 15 + this.map!.projection.radius);
            for (let pIndex = 0; pIndex < 2; pIndex++) {
                let PlayerRole = RandomAvailableRole(this);
                let player = new PlayerRole(this, atlanta);
                this.players.push(player);
                for (const callback of this.onPlayerAdded) {
                    callback(player);
                }
                for (let n = 0; n < 4; n++) {
                    await this.gameMaster.doDrawPlayerCard(player);
                }
            }
            let nPandemicCards = 6;
            let cutDecks = this.playerDeck!.cutInPlace(nPandemicCards);
            for (let i = 0; i < nPandemicCards; i++) {
                cutDecks[i].addCard(new EpidemyCard());
                //cutDecks[i].shuffle();
            }
            for (let deck of cutDecks) {
                this.playerDeck!.stack(deck);
            }
            console.log(this.playerDeck);
            await atlanta.buildStation();
            this.currentPlayerIndex = 0;
            if (this.currentPlayer) {
                this.currentPlayer.setAvailableAPs(4);
            }
        });
    }

    public onPlayerAdded: ((player: Player) => void)[] = [];

    public start() {
        this.scene!.onBeforeRenderObservable.removeCallback(this._update);
        this.scene!.onBeforeRenderObservable.add(this._update);
        this.engine!.runRenderLoop(() => {
            this.scene!.render()
        })
    }

    private _update = () => {
        let rawDT = this.scene ? this.scene.deltaTime / 1000 : 0;
        let fps = 1 / rawDT;
        if (isFinite(fps)) {
            if (this.map) {
                this.map.update();
            }
            if (this.sharedMaterials) {
                this.sharedMaterials.update();
            }
        }
    }

    private _pointerDownX: number = -1;
    private _pointerDownY: number = -1;
    private _pointerDown = (evt: PointerEvent) => {
        // Handle pointer down event
        this._pointerDownX = evt.clientX;
        this._pointerDownY = evt.clientY;
    }

    private _pointerUp = (evt: PointerEvent) => {
        // Handle pointer up event
        const dx = evt.clientX - this._pointerDownX;
        const dy = evt.clientY - this._pointerDownY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        let selectedCity: City | null = null;
        if (distance < 5) {
            let pickingRay = this.scene!.createPickingRay(
                this.scene!.pointerX,
                this.scene!.pointerY,
                Matrix.Identity(),
                this.gameCamera,
                false
            );
            pickingRay.direction.normalize();
            
            let pick = this.scene!.pickWithRay(
                pickingRay,
                (mesh) => {
                    if (mesh instanceof CityPart) {
                        return true;
                    }
                    return false;
                }
            );
            if (pick && pick.pickedMesh) {
                let cityPart = pick.pickedMesh as CityPart;
                let city = cityPart.city;
                if (city.opacity() > 0) {
                    if (this.DEV_MODE_CONNECTING) {
                        if (this.selectedCity && this.selectedCity !== city) {
                            if (city.getLink(this.selectedCity)) {
                                City.Disconnect(this.selectedCity, city);
                            }
                            else {
                                City.Connect(this.selectedCity, city);
                            }
                            city.updateLine();
                        }
                    }
                    selectedCity = city;
                }
            }
        }
        this._pointerDownX = -1;
        this._pointerDownY = -1;
        this.selectedCity = selectedCity;
    }

    private _keyDown = (evt: KeyboardEvent) => {
        if (this.DEV_MODE) {
            if (evt.key === "c") {
                this.DEV_MODE_CONNECTING = true;
            }
        }
    }

    private _keyUp = (evt: KeyboardEvent) => {
        if (this.DEV_MODE) {
            if (evt.key === "c") {
                this.DEV_MODE_CONNECTING = false;
            }
        }
    }
}
