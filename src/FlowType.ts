export class FlowTypes {
    byId: Map<string,FlowType> = new Map();
    byDeveloperName: Map<string,string> = new Map();

    public static parse(src: any[]) : FlowTypes {
        let types: FlowTypes = new FlowTypes();
        for(let pos = 0 ; pos < src.length ; pos++) {
            let type: FlowType = FlowType.parse(src[pos]);
            types.byId.set(type.id, type);
            types.byDeveloperName.set(type.developerName, type.id);
        }
        return types;
    }

    public get(id: string) {
        return this.byId.get(id);
    }

    public getByDeveloperName(name: string) {
        return this.byId.get(this.byDeveloperName.get(name));
    }
}

export class FlowType {
    id: string;
    developerName: string;
    developerSummary: string;
    elementType: string;
    properties: FlowTypeProperties;

    public static parse(src: any) : FlowType {
        let type: FlowType = new FlowType();
        type.id = src.id;
        type.developerName=src.developerName;
        type.developerSummary=src.developerSummary;
        type.elementType=src.elementType;
        type.properties=FlowTypeProperties.parse(src.properties);
        return type;
    }
}

export class FlowTypeProperties {
    byId: Map<string,FlowTypeProperty> = new Map();
    byDeveloperName: Map<string,string> = new Map();

    public static parse(src: any[]) : FlowTypeProperties {
        let props: FlowTypeProperties = new FlowTypeProperties();
        src?.forEach((prop: any) => {
            let newProp: FlowTypeProperty = FlowTypeProperty.parse(prop);
            props.byId.set(prop.id, prop);
            props.byDeveloperName.set(prop.developerName, prop.id);
        });
        return props;
    }

    public get(id: string) {
        return this.byId.get(id);
    }

    public getByDeveloperName(name: string) {
        return this.byId.get(this.byDeveloperName.get(name));
    }
}

export class FlowTypeProperty {
    contentFormat: string;
    contnetType: string;
    developerName: string;
    id: string;
    typeElementDeveloperName: string;
    typeElementId: string;

    public static parse(src: any) : FlowTypeProperty {
        let prop: FlowTypeProperty = new FlowTypeProperty();
        prop.contentFormat=src.contentFormat;
        prop.contnetType=src.contnetType;
        prop.developerName=src.developerName;
        prop.id=src.id;
        prop.typeElementDeveloperName=src.typeElementDeveloperName;
        prop.typeElementId=src.typeElementId;
        return prop;
    }
}