import { FlowObjectData, FlowObjectDataArray } from "flow-component-model";

export class PageInstance {

    id: string;
    parentId: string;

    UID: string;
    name: string;
    title: string;
    breadcrumb: string;
    
    children: Map<string,PageInstance>;

    objectData: FlowObjectData;

    public static parse(src: FlowObjectData, parentId: string) : PageInstance {
        let val: PageInstance = new PageInstance();
        val.parentId=parentId;
        val.id=src.internalId;
        val.UID=src.properties?.Id?.value as string;
        val.name=src.properties?.Name?.value as string;
        val.title=src.properties?.Title?.value as string;
        val.breadcrumb=src.properties?.BreadcrumbLabel?.value as string;
        val.children=new Map();
        (src.properties?.Children?.value as FlowObjectDataArray)?.items.forEach((value: FlowObjectData) => {
            let child : PageInstance = PageInstance.parse(value, val.UID);
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

    toObjectData() : any {
        let objData: any = {};

        return objData;
    }
}