declare global {
    interface Crypto {
      randomUUID: () => string;
    }
  }

export class FlowTypes {
    byId: Map<string,FlowType> = new Map();
    byDeveloperName: Map<string,string> = new Map();

    public static parse(src: any[]) : FlowTypes {
        let types: FlowTypes = new FlowTypes();
        for(let pos = 0 ; pos < src.length ; pos++) {
            let type: FlowType = FlowType.parse(src[pos]);
            types.add(type);
        }
        return types;
    }

    public get(id: string) {
        return this.byId.get(id);
    }

    public getByDeveloperName(name: string) {
        return this.byId.get(this.byDeveloperName.get(name));
    }

    public add(newType: FlowType) {
        this.byId.set(newType.id, newType);
        this.byDeveloperName.set(newType.developerName, newType.id);
    }
}

export class FlowType {
    id: string;
    developerName: string;
    developerSummary: string;
    elementType: string;
    properties: FlowTypeProperties;

    constructor() {
        this.elementType="TYPE";
        this.properties = new FlowTypeProperties();
    }

    public static parse(src: any) : FlowType {
        let type: FlowType = new FlowType();
        type.id = src.id;
        type.developerName=src.developerName;
        type.developerSummary=src.developerSummary;
        type.elementType=src.elementType;
        type.properties=FlowTypeProperties.parse(src.properties);
        return type;
    }

    public toObjectData() : any {
        let objData: any = {};
        objData.id=this.id;
        objData.developerName=this.developerName;
        objData.developerSummary=this.developerSummary;
        objData.elementType="TYPE";
        objData.updateByName=true;
        objData.properties= [];

        this.properties.byId.forEach((prop: FlowTypeProperty) => {
            objData.properties.push(prop.toObjectData());
        });
        return objData;
    }
}

export class FlowTypeProperties {
    byId: Map<string,FlowTypeProperty> = new Map();
    byDeveloperName: Map<string,string> = new Map();

    public static parse(src: any[]) : FlowTypeProperties {
        let props: FlowTypeProperties = new FlowTypeProperties();
        src?.forEach((prop: any) => {
            let newProp: FlowTypeProperty = FlowTypeProperty.parse(prop);
            props.add(newProp);
        });
        return props;
    }

    public get(id: string) {
        return this.byId.get(id);
    }

    public getByDeveloperName(name: string) {
        return this.byId.get(this.byDeveloperName.get(name));
    }

    public add(newProp: FlowTypeProperty) {
        this.byId.set(newProp.id, newProp);
        this.byDeveloperName.set(newProp.developerName, newProp.id);
    }
}

export class FlowTypeProperty {
    contentFormat: string;
    contentType: string;
    developerName: string;
    id: string;
    typeElementDeveloperName: string;
    typeElementId: string;

    constructor(developerName?: string, contentType?: string, contentFormat?: string, typeElementDeveloperName?: string, typeElementId?: string) {
        this.id = self.crypto.randomUUID();
        if(developerName) this.developerName=developerName;
        if(contentType) this.contentType=contentType;
        if(contentFormat) this.contentFormat=contentFormat;
        if(typeElementDeveloperName) this.typeElementDeveloperName=typeElementDeveloperName;
        if(typeElementId) this.typeElementId=typeElementId;
    }

    public static parse(src: any) : FlowTypeProperty {
        let prop: FlowTypeProperty = new FlowTypeProperty();
        prop.contentFormat=src.contentFormat;
        prop.contentType=src.contentType;
        prop.developerName=src.developerName;
        prop.id=src.id;
        prop.typeElementDeveloperName=src.typeElementDeveloperName;
        prop.typeElementId=src.typeElementId;
        return prop;
    }

    public toObjectData() : any {
        let objData: any = {};
        objData.id=this.id;
        objData.developerName=this.developerName;
        objData.contentType=this.contentType;
        objData.contentFormat=this.contentFormat;
        objData.typeElementDeveloperName=this.typeElementDeveloperName;
        objData.typeElementId=this.typeElementId;
        return objData;
    }
}