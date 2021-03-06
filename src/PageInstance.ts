import { eContentType, FlowObjectData, FlowObjectDataArray, FlowObjectDataProperty } from "flow-component-model";
import { FlowType } from "./FlowType";

declare global {
    interface Crypto {
    randomUUID: () => string;
    }
}

export class PageInstance {

    id: string;
    parentId: string;
    parent: PageInstance;
    UID: string;
    name: string;
    title: string;
    breadcrumb: string;
    flow: string;
    children: Map<string,PageInstance>;

    objectData: FlowObjectData;

    constructor(uid?: string, name?:string, title?: string, breadcrumb?: string, parent?: string) {
        this.id = crypto.randomUUID();
        if(uid) this.UID = uid;
        if(name) this.name = name;
        if(title) this.title = title;
        if(breadcrumb) this.breadcrumb = breadcrumb;
        if(parent) this.parentId = parent;
        this.children=new Map();
    }

    public static parse(type: FlowType, src: FlowObjectData, parent: PageInstance) : PageInstance {
        let val: PageInstance = new PageInstance();
        val.parentId=parent?.UID;
        val.parent=parent;
        val.id=src.internalId;
        val.UID=src.properties?.Id?.value as string;
        val.name=src.properties?.Name?.value as string;
        val.title=src.properties?.Title?.value as string;
        val.breadcrumb=src.properties?.Breadcrumb?.value as string;
        val.flow=src.properties?.Flow?.value as string;
        val.children=new Map();
        (src.properties?.Children?.value as FlowObjectDataArray)?.items.forEach((value: FlowObjectData) => {
            let child : PageInstance = PageInstance.parse(type, value, val);
            val.children.set(child.id,child);
        });       
        return val;
    }

    addChild(newChild: PageInstance) {
        this.children.set(newChild.UID,newChild);
    }

    removeChild(child: PageInstance) {
        if(this.children?.has(child.id)) {
            this.children.delete(child.id);
        }
    }

    public toObjectData(type: FlowType) : FlowObjectData {
        let objData: FlowObjectData = FlowObjectData.newInstance("Page");
        objData.addProperty(FlowObjectDataProperty.newInstance("Id", eContentType.ContentString, this.UID));
        objData.addProperty(FlowObjectDataProperty.newInstance("Name", eContentType.ContentString, this.name));
        objData.addProperty(FlowObjectDataProperty.newInstance("Title", eContentType.ContentString,this.title));
        objData.addProperty(FlowObjectDataProperty.newInstance("Breadcrumb", eContentType.ContentString,this.breadcrumb));
        objData.addProperty(FlowObjectDataProperty.newInstance("Flow", eContentType.ContentString,this.flow));
        objData.typeElementId=type.id;
        let children: FlowObjectDataArray = new FlowObjectDataArray();
        this.children?.forEach((child: PageInstance) => {
            children.addItem(child.toObjectData(type));
        });
        let childrenProp: any = FlowObjectDataProperty.newInstance("Children", eContentType.ContentList,children);
        childrenProp.typeElementId=type.properties.getByDeveloperName("Children").typeElementId;
        objData.addProperty(childrenProp);
        //let od: any = objData.iFlowObjectDataArray()
        return objData;
    }
}