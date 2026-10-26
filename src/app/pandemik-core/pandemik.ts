import { Injectable } from "@angular/core";
import { Scene } from "@babylonjs/core/scene.pure";
import { GlowLayer } from "@babylonjs/core/Layers/glowLayer";
import { Board } from "./board";
import type { AudioEngineV2 } from "@babylonjs/core/AudioV2/abstractAudio/audioEngineV2";
import { CreateAudioEngineAsync } from "@babylonjs/core/AudioV2/webAudio/webAudioEngine";
import type { SpotLight } from "@babylonjs/core/Lights/spotLight.pure";
import { DirectionalLight } from "@babylonjs/core/Lights/directionalLight.pure";
import { Vector3 } from "@babylonjs/core/Maths/math.vector.pure";
import { ArcRotateCamera } from "@babylonjs/core/Cameras/arcRotateCamera.pure";
import { Engine } from "@babylonjs/core/Engines/engine.pure";
import { HemisphericLight } from "@babylonjs/core";
import { InfectionCard } from "./deck/infection-card";
import { Deck } from "./deck/deck";
import { CityID } from "./data";
import { GameCamera } from "./game-camera";

@Injectable({
	providedIn: 'root',
})
export class Pandemik {

    public DEBUG_MODE: boolean = false;

    public canvas: HTMLCanvasElement | null = null;
    public engine: Engine | null = null;
    public audioEngine: AudioEngineV2 | null = null;
    public get audioVolume(): number {
        return this.audioEngine ? this.audioEngine.volume : 0;
    }
    public set audioVolume(v: number) {
        if (this.audioEngine) {
            this.audioEngine.setVolume(v);
        }
    }
    public scene: Scene | null = null;
    public getScene(): Scene | null {
        return this.scene;
    }
    public gameCamera: GameCamera | null = null;
    public ambientLight: HemisphericLight | null = null;
    public glowLayer: GlowLayer | null = null;

    public map: Board | null = null;
    public infectionDeck: Deck<InfectionCard> | null = null;

    constructor() {
        
    }

    public async initialize(canvas: HTMLCanvasElement): Promise<void> {
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

        this.map = new Board(this);
        await this.map.instantiate();

        this.infectionDeck = new Deck<InfectionCard>();
        for (let cityId = 0; cityId < CityID.LAST; cityId++) {
            this.infectionDeck.addCard(new InfectionCard(cityId));
        }
        this.infectionDeck.shuffle();

        this.map.onceStabilized(async () => {
            for (let n = 0; n < 3; n++) {
                let card = this.infectionDeck!.drawCard();
                if (card) {
                    let city = this.map!.cities[card.cityId];
                    await this.gameCamera!.goTo(city.position, 20);
                    for (let i = 0; i < 3; i++) {
                        await city.infect(card.diseaseColor);
                    }
                }
            }
            for (let n = 0; n < 3; n++) {
                let card = this.infectionDeck!.drawCard();
                if (card) {
                    let city = this.map!.cities[card.cityId];
                    await this.gameCamera!.goTo(city.position, 20);
                    for (let i = 0; i < 2; i++) {
                        await city.infect(card.diseaseColor);
                    }
                }
            }
            for (let n = 0; n < 3; n++) {
                let card = this.infectionDeck!.drawCard();
                if (card) {
                    let city = this.map!.cities[card.cityId];
                    await this.gameCamera!.goTo(city.position, 20);
                    for (let i = 0; i < 1; i++) {
                        await city.infect(card.diseaseColor);
                    }
                }
            }
        });
    }

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
}
