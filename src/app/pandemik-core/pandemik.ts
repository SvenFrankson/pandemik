import { Injectable } from "@angular/core";
import { Scene } from "@babylonjs/core/scene.pure";
import { PandemikMap } from "./pandemik-map";
import type { AudioEngineV2 } from "@babylonjs/core/AudioV2/abstractAudio/audioEngineV2";
import { CreateAudioEngineAsync } from "@babylonjs/core/AudioV2/webAudio/webAudioEngine";
import type { SpotLight } from "@babylonjs/core/Lights/spotLight.pure";
import { DirectionalLight } from "@babylonjs/core/Lights/directionalLight.pure";
import { Vector3 } from "@babylonjs/core/Maths/math.vector.pure";
import { ArcRotateCamera } from "@babylonjs/core/Cameras/arcRotateCamera.pure";
import { Engine } from "@babylonjs/core/Engines/engine.pure";
import { HemisphericLight } from "@babylonjs/core";

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
    public gameCamera: ArcRotateCamera | null = null;
    public ambientLight: HemisphericLight | null = null;

    constructor() {
        
    }

    public async initialize(canvas: HTMLCanvasElement): Promise<void> {
        this.canvas = canvas;
        this.engine = new Engine(canvas, true);
        this.engine.disableUniformBuffers = true;
        (async () => {
            this.audioEngine = await CreateAudioEngineAsync();
        })();

        this.scene = new Scene(this.engine);
        this.scene.clearColor.set(0, 0, 0, 1);

        this.gameCamera = new ArcRotateCamera("game-camera", Math.PI / 2, Math.PI / 2, 10, Vector3.Zero(), this.scene);
        this.gameCamera.attachControl(canvas, true);

        this.ambientLight = new HemisphericLight("hemispheric-light", (new Vector3(2, 3, 1)).normalize(), this.scene);

        let test = new PandemikMap();
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
            
        }
    }
}
