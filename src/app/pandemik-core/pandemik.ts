import { Injectable } from "@angular/core";
import { Scene } from "@babylonjs/core/scene.pure";
import { Player } from "./player";
import { BreakingNewsConnector } from "./ui-connectors/breaking-news-connector";
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
import { CityID } from "./data";
import { GameCamera } from "./game-camera";
import { CityActionMenuConnector } from "./ui-connectors/city-action-menu-connector";
import { City, CityPart } from "./city";
import { GameMaster } from "./game-master";
import { SharedMaterials } from "./materials";

export class Pandemik {

    public DEBUG_MODE: boolean = false;

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
    public playerDeck: Deck<PlayerCard> | null = null;
    public players: Player[] = [];
    public get currentPlayer(): Player | null {
        return this.players.length > 0 ? this.players[0] : null;
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

    constructor(canvas: HTMLCanvasElement) {
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
        this.map = new Board(this);
        await this.map.instantiate();

        this.infectionDeck = new Deck<InfectionCard>();
        for (let cityId = 0; cityId < CityID.LAST; cityId++) {
            this.infectionDeck.addCard(new InfectionCard(cityId));
        }
        this.infectionDeck.shuffle();

        this.playerDeck = new Deck<PlayerCard>();
        for (let cityId = 0; cityId < CityID.LAST; cityId++) {
            this.playerDeck.addCard(new CityCard(cityId));
        }
        this.playerDeck.shuffle();

        this.map.onceStabilized(async () => {
            let atlanta = this.map!.cities[CityID.Atlanta];

            this.canvas?.addEventListener("pointerdown", this._pointerDown);
            this.canvas?.addEventListener("pointerup", this._pointerUp);

            const draws = 1;
            for (let n = 0; n < draws; n++) {
                let card = this.infectionDeck!.drawCard();
                if (card) {
                    let city = this.map!.cities[card.cityId];
                    await this.gameMaster.infect(city, card.diseaseColor, 3);
                }
            }
            for (let n = 0; n < draws; n++) {
                let card = this.infectionDeck!.drawCard();
                if (card) {
                    let city = this.map!.cities[card.cityId];
                    await this.gameMaster.infect(city, card.diseaseColor, 2);
                }
            }
            for (let n = 0; n < draws; n++) {
                let card = this.infectionDeck!.drawCard();
                if (card) {
                    let city = this.map!.cities[card.cityId];
                    await this.gameMaster.infect(city, card.diseaseColor, 1);
                }
            }

            await this.gameCamera!.goTo(atlanta.position, 1, 25);
            let player = new Player(this, atlanta);
            this.players.push(player);
            if (this.onPlayerAdded) {
                this.onPlayerAdded(player);
            }
            for (let n = 0; n < 4; n++) {
                await this.gameMaster.doDrawPlayerCard(player);
            }
            await atlanta.buildStation();
        });
    }

    public onPlayerAdded: ((player: Player) => void) | null = null;

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
                    selectedCity = city;
                }
            }
        }
        this._pointerDownX = -1;
        this._pointerDownY = -1;
        this.selectedCity = selectedCity;
    }
}
