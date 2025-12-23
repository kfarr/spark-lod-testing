import { ExtSplats } from './ExtSplats';
import { PackedSplats, SplatEncoding } from './PackedSplats';
import { RgbaArray } from './RgbaArray';
import { SplatEdit } from './SplatEdit';
import { FrameUpdateContext, GsplatModifier, SplatGenerator, SplatTransformer } from './SplatGenerator';
import { SplatFileType } from './SplatLoader';
import { PagedSplats, SplatPager } from './SplatPager';
import { SplatSkinning } from './SplatSkinning';
import { DynoBool, DynoFloat, DynoInt, DynoUsampler2D, DynoVal, DynoVec4, Gsplat } from './dyno';
import * as THREE from "three";
export type SplatMeshOptions = {
    url?: string;
    fileBytes?: Uint8Array | ArrayBuffer;
    fileType?: SplatFileType;
    fileName?: string;
    packedSplats?: PackedSplats;
    splats?: SplatSource;
    maxSplats?: number;
    constructSplats?: (splats: PackedSplats) => Promise<void> | void;
    onProgress?: (event: ProgressEvent) => void;
    onLoad?: (mesh: SplatMesh) => Promise<void> | void;
    editable?: boolean;
    raycastable?: boolean;
    onFrame?: ({ mesh, time, deltaTime, }: {
        mesh: SplatMesh;
        time: number;
        deltaTime: number;
    }) => void;
    objectModifier?: GsplatModifier;
    worldModifier?: GsplatModifier;
    splatEncoding?: SplatEncoding;
    extSplats?: boolean | ExtSplats;
    lod?: boolean | number;
    nonLod?: boolean | "wait";
    enableLod?: boolean;
    lodScale?: number;
    outsideFoveate?: number;
    behindFoveate?: number;
    coneFov0?: number;
    coneFov?: number;
    coneFoveate?: number;
    paged?: boolean | PagedSplats | SplatPager;
};
export type SplatMeshContext = {
    transform: SplatTransformer;
    viewToWorld: SplatTransformer;
    worldToView: SplatTransformer;
    viewToObject: SplatTransformer;
    recolor: DynoVec4<THREE.Vector4>;
    time: DynoFloat;
    deltaTime: DynoFloat;
    numSplats: DynoInt<string>;
    splats: SplatSource;
    enableLod: DynoBool<string>;
    lodIndices: DynoUsampler2D<"lodIndices", THREE.DataTexture>;
};
export interface SplatSource {
    prepareFetchSplat(): void;
    dispose(): void;
    getNumSplats(): number;
    hasRgbDir(): boolean;
    getNumSh(): number;
    setMaxSh(maxSh: number): void;
    fetchSplat({ index, viewOrigin, }: {
        index: DynoVal<"int">;
        viewOrigin?: DynoVal<"vec3">;
    }): DynoVal<typeof Gsplat>;
}
export declare class EmptySplatSource implements SplatSource {
    fetchDyno: DynoVal<{
        type: "Gsplat";
    }>;
    prepareFetchSplat(): void;
    dispose(): void;
    getNumSplats(): number;
    hasRgbDir(): boolean;
    getNumSh(): number;
    setMaxSh(maxSh: number): void;
    fetchSplat({ index }: {
        index: DynoVal<"int">;
    }): DynoVal<typeof Gsplat>;
}
export declare class SplatMesh extends SplatGenerator {
    initialized: Promise<SplatMesh>;
    isInitialized: boolean;
    packedSplats?: PackedSplats;
    extSplats?: ExtSplats;
    splats?: SplatSource;
    paged?: PagedSplats;
    recolor: THREE.Color;
    opacity: number;
    context: SplatMeshContext;
    onFrame?: ({ mesh, time, deltaTime, }: {
        mesh: SplatMesh;
        time: number;
        deltaTime: number;
    }) => void;
    objectModifier?: GsplatModifier;
    worldModifier?: GsplatModifier;
    enableViewToObject: boolean;
    enableViewToWorld: boolean;
    enableWorldToView: boolean;
    skinning: SplatSkinning | null;
    edits: SplatEdit[] | null;
    editable: boolean;
    raycastable: boolean;
    private rgbaDisplaceEdits;
    splatRgba: RgbaArray | null;
    maxSh: number;
    enableLod?: boolean;
    lodScale: number;
    outsideFoveate?: number;
    behindFoveate?: number;
    coneFov0?: number;
    coneFov?: number;
    coneFoveate?: number;
    constructor(options?: SplatMeshOptions);
    asyncInitialize(options: SplatMeshOptions): Promise<void>;
    static staticInitialized: Promise<void>;
    static isStaticInitialized: boolean;
    static dynoTime: DynoFloat<"value">;
    static staticInitialize(): Promise<void>;
    pushSplat(center: THREE.Vector3, scales: THREE.Vector3, quaternion: THREE.Quaternion, opacity: number, color: THREE.Color): void;
    forEachSplat(callback: (index: number, center: THREE.Vector3, scales: THREE.Vector3, quaternion: THREE.Quaternion, opacity: number, color: THREE.Color) => void): void;
    dispose(): void;
    getBoundingBox(centers_only?: boolean): THREE.Box3;
    constructGenerator(context: SplatMeshContext): void;
    updateGenerator(): void;
    update({ renderer, time, deltaTime, viewToWorld, camera, renderSize, globalEdits, lodIndices, }: FrameUpdateContext): void;
    raycast(raycaster: THREE.Raycaster, intersects: {
        distance: number;
        point: THREE.Vector3;
        object: THREE.Object3D;
    }[]): void;
}
