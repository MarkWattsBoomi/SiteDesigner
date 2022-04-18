import { eContentType, FlowObjectData, FlowObjectDataArray, FlowObjectDataProperty } from "flow-component-model";
import { PageInstance } from "./PageInstance";

export class Page {

    typeDeveloperName: string;
    typeDeveloperSummary: string;
    typeId: string;

    valueDeveloperName: string;
    valueDeveloperSummary: string;
    valueId: string;
    children: Map<string,PageInstance> = new Map();

    isValid: boolean = true;

    constructor() {

    }

    public static parseType(src: any) : Page{
        let type: Page = new Page();
        type.typeId=src.id;
        type.typeDeveloperName=src.developerName;
        type.typeDeveloperSummary=src.developerSummary;
        if(
            !src.properties.find((prop: any) => {return prop.developerName==="Id"}) ||
            !src.properties.find((prop: any) => {return prop.developerName==="Name"}) ||
            !src.properties.find((prop: any) => {return prop.developerName==="Title"}) ||
            !src.properties.find((prop: any) => {return prop.developerName==="BreadcrumbLabel"}) ||
            !src.properties.find((prop: any) => {return prop.developerName==="Children"})
        ) {
            type.isValid=false;
        }
        return type;
    }

    public static parseValue(src: any) : Page {
        let val: Page = new Page();
        val.valueId=src.id;
        val.valueDeveloperName=src.developerName;
        val.valueDeveloperSummary=src.developerSummary;
        val.typeDeveloperName=src.typeElementDeveloperName;
        val.typeId=src.typeElementId;
        val.children=new Map();
        src.defaultObjectData.forEach((value: any) => {
            let child : PageInstance = PageInstance.parse(new FlowObjectData([value]),null);
            val.children.set(child.id,child);
        });
        
        return val;
    }

    public static newInstance(name: string) : FlowObjectData {
        let newPage: FlowObjectData = FlowObjectData.newInstance("Page");
        newPage.addProperty(FlowObjectDataProperty.newInstance("Id", eContentType.ContentString, ""));
        newPage.addProperty(FlowObjectDataProperty.newInstance("Name", eContentType.ContentString, name));
        newPage.addProperty(FlowObjectDataProperty.newInstance("Title", eContentType.ContentString,""));
        newPage.addProperty(FlowObjectDataProperty.newInstance("BreadcrumbLabel", eContentType.ContentString,""));
        newPage.addProperty(FlowObjectDataProperty.newInstance("Children", eContentType.ContentList,new FlowObjectDataArray));
        return newPage;
    }

    toObjectData() : any {
        let objData: any = {};

        return objData;
    }

}