export enum eAssetType {
    image,
    css,
    js
}

export class FlowAssets {
    byKey: Map<string,FlowAsset> = new Map();
    byName: Map<string,string> = new Map();

    public static parse(src: any[]) : FlowAssets {
        let assets: FlowAssets = new FlowAssets();
        for(let pos = 0 ; pos < src.length ; pos++) {
            let asset: FlowAsset = FlowAsset.parse(src[pos]);
            assets.add(asset);
        }
        return assets;
    }

    public getAscending(type?: eAssetType) : Map<string,FlowAsset> {
        const assets: Map<string, FlowAsset> = new Map(Array.from(this.byKey).sort((item1, item2) => {
            return item1[1].name.localeCompare(item2[1].name)
        }).filter((item) => {
            return this.isOfType(item[1].name,type);
        }));
        return assets;
    }

    isOfType(fileName: string, type: eAssetType) {
        switch(type) {
            case eAssetType.image:
                if(["png","jpg","jpeg","jfif","gif","giff"].indexOf(fileName.substring(fileName.lastIndexOf(".")+1).toLowerCase()) >=0) {
                    return true;
                }
                else {
                    return false;
                }
            default:
                return true;
        }
    }

    public get(key: string) {
        return this.byKey.get(key);
    }

    public getByName(name: string) {
        return this.byKey.get(this.byName.get(name));
    }

    public add(newAsset: FlowAsset) {
        this.byKey.set(newAsset.key, newAsset);
        this.byName.set(newAsset.name, newAsset.key);
    }
}

export class FlowAsset {
    contentType: string;
    key: string;
    name: string;
    publicUrl: string;
    size: number;

    public static parse(src: any) : FlowAsset {
        let asset: FlowAsset = new FlowAsset();
        asset.contentType = src.contentType;
        asset.key = src.key;
        asset.name = asset.key.substring(asset.key.lastIndexOf("/")+1);
        asset.publicUrl = src.publicUrl;
        asset.size = src.size;
        return asset;
    }
}