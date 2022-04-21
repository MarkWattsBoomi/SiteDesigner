import { eContentType, FlowObjectData, FlowObjectDataArray, FlowObjectDataProperty } from "flow-component-model";
import { FlowType } from "./FlowType";
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

    public static parseValue(src: any, type: FlowType) : Page {
        let val: Page = new Page();
        val.valueId=src.id;
        val.valueDeveloperName=src.developerName;
        val.valueDeveloperSummary=src.developerSummary;
        val.typeDeveloperName=src.typeElementDeveloperName;
        val.typeId=src.typeElementId;
        val.children=new Map();
        src.defaultObjectData.forEach((value: any) => {
            let child : PageInstance = PageInstance.parse(type, new FlowObjectData([value]),null);
            val.children.set(child.id,child);
        });
        
        return val;
    }

    public static newInstance(name: string) : FlowObjectData {
        let newPage: FlowObjectData = FlowObjectData.newInstance("Page");
        newPage.addProperty(FlowObjectDataProperty.newInstance("Id", eContentType.ContentString, ""));
        newPage.addProperty(FlowObjectDataProperty.newInstance("Name", eContentType.ContentString, name));
        newPage.addProperty(FlowObjectDataProperty.newInstance("Title", eContentType.ContentString,""));
        newPage.addProperty(FlowObjectDataProperty.newInstance("Breadcrumb", eContentType.ContentString,""));
        newPage.addProperty(FlowObjectDataProperty.newInstance("Children", eContentType.ContentList,new FlowObjectDataArray));
        return newPage;
    }

    toObjectData(type: FlowType) : any {
        let objData: any = {};
        objData.id = this.valueId;
        objData.access = "PUBLIC";
        objData.developerName = this.valueDeveloperName;
        objData.developerSummary = this.valueDeveloperSummary;
        objData.typeElementId = this.typeId;
        objData.typeElementDeveloperName = this.typeDeveloperName;
        objData.contentType = "ContentObject";
        objData.elementType = "VARIABLE";
        objData.updateByName = true;
        objData.defaultContentValue = null;
        objData.initializationOperations = [];
        let children: FlowObjectDataArray = new FlowObjectDataArray([]);
        this.children.forEach((child: PageInstance) => {
            children.addItem(child.toObjectData(type));
        });
        objData.defaultObjectData=children.iFlowObjectDataArray();
        return objData;
    }

}