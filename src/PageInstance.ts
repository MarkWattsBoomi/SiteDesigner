import { eContentType, FlowObjectData, FlowObjectDataArray, FlowObjectDataProperty } from "flow-component-model";
import { FlowType } from "./FlowType";

export class PageInstance {

    id: string;
    parentId: string;

    UID: string;
    name: string;
    title: string;
    breadcrumb: string;
    
    children: Map<string,PageInstance>;

    objectData: FlowObjectData;

    public static parse(type: FlowType, src: FlowObjectData, parentId: string) : PageInstance {
        let val: PageInstance = new PageInstance();
        val.parentId=parentId;
        val.id=src.internalId;
        val.UID=src.properties?.Id?.value as string;
        val.name=src.properties?.Name?.value as string;
        val.title=src.properties?.Title?.value as string;
        val.breadcrumb=src.properties?.BreadcrumbLabel?.value as string;
        val.children=new Map();
        (src.properties?.Children?.value as FlowObjectDataArray)?.items.forEach((value: FlowObjectData) => {
            let child : PageInstance = PageInstance.parse(type, value, val.UID);
            val.children.set(child.id,child);
        });       
        return val;
    }

    public static newInstance(name: string, parentId: string) : PageInstance {
        let newPage: PageInstance = new PageInstance();;
        newPage.parentId=parentId;
        newPage.id="";
        newPage.name=name;
        newPage.children=new Map();
        return newPage;
    }

    public toObjectData(type: FlowType) : FlowObjectData {
        let objData: FlowObjectData = FlowObjectData.newInstance("Page");
        objData.addProperty(FlowObjectDataProperty.newInstance("Id", eContentType.ContentString, this.UID));
        objData.addProperty(FlowObjectDataProperty.newInstance("Name", eContentType.ContentString, this.name));
        objData.addProperty(FlowObjectDataProperty.newInstance("Title", eContentType.ContentString,this.title));
        objData.addProperty(FlowObjectDataProperty.newInstance("BreadcrumbLabel", eContentType.ContentString,this.breadcrumb));
        objData.typeElementId=type.id;
        let children: FlowObjectDataArray = new FlowObjectDataArray();
        this.children.forEach((child: PageInstance) => {
            children.addItem(child.toObjectData(type));
        });
        let childrenProp: any = FlowObjectDataProperty.newInstance("Children", eContentType.ContentList,children);
        childrenProp.typeElementId=type.properties.getByDeveloperName("Children").typeElementId;
        objData.addProperty(childrenProp);
        //let od: any = objData.iFlowObjectDataArray()
        return objData;
    }
}