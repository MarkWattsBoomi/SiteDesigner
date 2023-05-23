import { eLoadingState, FlowComponent } from 'flow-component-model';
import * as React from 'react';
import "./SiteDesigner.css";
import { GetTenantToken, GetValue, SaveValue, GetTypes, SaveType, GetFlows } from './FlowFunctions';
import FlowTenantToken from './FlowTenantToken';
import { Page } from './Page';
import SitePage from './SitePage';
import PageEditForm from './PageEditForm';
import { PageInstance } from './PageInstance';
import { FlowType, FlowTypeProperty, FlowTypes } from './FlowType';
import { FlowFlows } from './FLowFlow';
import { FCMModal } from 'fcmkit';
import { FCMModalButton } from 'fcmkit/lib/ModalDialog/FCMModalButton';


declare var manywho: any;


export default class SiteDesigner extends FlowComponent {
    token: FlowTenantToken;
    flowFlows: FlowFlows;
    flowTypes: FlowTypes;
    pageType: FlowType;
    site: Page;
    children: Map<string,SitePage> = new Map();
    messageBox: FCMModal;
    retries: number = 0;

    form: any;

    draggedItem: PageInstance;
    dropTarget: PageInstance;

    constructor(props: any) {
        super(props);

        this.flowMoved = this.flowMoved.bind(this);
        this.addChild = this.addChild.bind(this);
        this.childAdded = this.childAdded.bind(this);
        this.editPage = this.editPage.bind(this);
        this.pageEditied = this.pageEditied.bind(this);
        this.reHome = this.reHome.bind(this);

        this.dragStart = this.dragStart.bind(this);
        this.dragEnter = this.dragEnter.bind(this);
        this.dragOver = this.dragOver.bind(this);
        this.dragLeave = this.dragLeave.bind(this);
        this.drop = this.drop.bind(this);

        this.saveChanges = this.saveChanges.bind(this);
    }

    async componentDidMount(): Promise<void> {
        await super.componentDidMount();
        (manywho as any).eventManager.addDoneListener(this.flowMoved, this.componentId);
        this.loadSite();        
    }

    async componentWillUnmount() {
        await super.componentWillUnmount();
        (manywho as any).eventManager.removeDoneListener(this.componentId);
    }

    async flowMoved(xhr: any, request: any) {
        const me: any = this;
        if (xhr.invokeType === 'FORWARD') {
            if (this.loadingState !== eLoadingState.ready && this.retries < 3) {
                this.retries ++;
                window.setTimeout(function() {me.flowMoved(xhr, request); }, 500);
            } else {
                this.retries = 0;
            }
        }

    }

    async loadSite() {
        this.token = await GetTenantToken(this.getAttribute("user"), this.getAttribute("token"),this.tenantId);
        if(this.token) {
            this.flowFlows = await GetFlows(this.tenantId, this.token);
            this.flowTypes = await GetTypes(this.tenantId, this.token);
            this.pageType = this.flowTypes.getByDeveloperName("$Page");
            if(!this.pageType){
                let pgType = new FlowType();
                pgType.developerName="$Page";
                pgType.developerSummary="The definition of a site / portal page";
                pgType.properties.add(new FlowTypeProperty("Id","ContentString",null,null,null));
                pgType.properties.add(new FlowTypeProperty("Name","ContentString",null,null,null));
                pgType.properties.add(new FlowTypeProperty("Title","ContentString",null,null,null));
                pgType.properties.add(new FlowTypeProperty("Breadcrumb","ContentString",null,null,null));
                pgType.properties.add(new FlowTypeProperty("Children","ContentList",null,"$Page",null));
                let newType: FlowType = await SaveType(this.tenantId, this.token,pgType);
                this.flowTypes.add(newType);
                this.pageType = this.flowTypes.getByDeveloperName("$Page");
            }
            //check if children is correct type
            if(this.pageType.properties.getByDeveloperName("Children").typeElementId !== this.pageType.id) {
                this.pageType.properties.getByDeveloperName("Children").typeElementDeveloperName="$Page";
                this.pageType.properties.getByDeveloperName("Children").typeElementId=this.pageType.id;
                this.pageType.properties.getByDeveloperName("Children").contentType="ContentList";
                let newType: FlowType = await SaveType(this.tenantId, this.token,this.pageType);
                this.flowTypes.add(newType);
                this.pageType = this.flowTypes.getByDeveloperName("$Page");
            }
            //check if all fields are there
            let needSave: boolean = false;
            if(!this.pageType.properties.byDeveloperName.has("Flow")) {
                let newProp: FlowTypeProperty = new FlowTypeProperty("Flow","ContentString","",null,null);
                this.pageType.properties.add(newProp);
                needSave = true;
            }
            if(needSave===true){
                let newType: FlowType = await SaveType(this.tenantId, this.token,this.pageType);
                this.flowTypes.add(newType);
                this.pageType = this.flowTypes.getByDeveloperName("$Page");
            }

            this.site = await GetValue(this.tenantId, this.token,"$Site",this.pageType);
            if(!this.site) {
                // $Site doesnt exist, create it
                this.site=new Page();
                this.site.valueDeveloperName = "$Site";
                this.site.valueDeveloperSummary = "The definition of this tenant's web site";
                this.site.typeDeveloperName = this.pageType.developerName;
                this.site.typeDeveloperSummary = this.pageType.developerSummary;
                this.site.typeId = this.pageType.id;
                this.site.children = new Map();

                let homePage: PageInstance = new PageInstance("HOME","Home","Home","Home",null);
                this.site.children.set(homePage.UID, homePage);
                await SaveValue(this.tenantId, this.token,this.site.toObjectData(this.pageType));

            }

        }
        this.forceUpdate();
    }

    async saveChanges() {
        let newVal = this.site.toObjectData(this.pageType);
        this.token = await GetTenantToken(this.getAttribute("user"), this.getAttribute("token"),this.tenantId);
        if(this.token) {
            await SaveValue(this.tenantId,this.token,newVal);
        }
        this.forceUpdate();
    }

    registerChild(key: string, child: SitePage) {
        if(child) {
            this.children.set(key,child);
        }
        else {
            this.children.delete(key);
        }
    }

    editPage(page: PageInstance) {
        console.log("Edit " + page.name);
        let form = (
            <PageEditForm  
                root={this}
                page={page}
                ref={(form: PageEditForm) => {this.form = form}}
            />
        );
        this.messageBox.showDialog(
            null,
            "Edit Page",
            form,
            [new FCMModalButton("Apply",this.pageEditied), new FCMModalButton("Cancel",this.messageBox.hideDialog)]
        );
        
    }

    pageEditied() {
        this.messageBox.hideDialog();
        this.forceUpdate();
    }

    addChild(page: PageInstance) {
        console.log("Add child to " + page.name);
        let newChild: PageInstance = new PageInstance("","New Page","","", page.UID);
        let form = (
            <PageEditForm  
                root={this}
                page={newChild}
                pageParent={page}
                ref={(form: PageEditForm) => {this.form = form}}
            />
        );
        this.messageBox.showDialog(
            null,
            "Add child page",
            form,
            [new FCMModalButton("Apply",this.childAdded), new FCMModalButton("Cancel",this.messageBox.hideDialog)]
        );
    }

    childAdded() {
        let form: PageEditForm = this.form;
        let parent: PageInstance = form.props.pageParent;
        let child: PageInstance = form.props.page;
        parent.children.set(child.UID,child);
        this.messageBox.hideDialog();
        this.forceUpdate();
    }

    reHome(page: PageInstance, newParent: PageInstance) {
        console.log("Add child to " + page.name);
        newParent.addChild(page);
        if(page.parent) {
            page.parent.removeChild(page);
        }
        this.forceUpdate();
    }

    dragStart(e: any, draggedItem: PageInstance) {
        e.stopPropagation();
        e.dataTransfer.effectAllowed = 'move';
        this.draggedItem = draggedItem;
    }

    dragEnter(e: any, enteredItem: PageInstance) {
        e.preventDefault();
        e.stopPropagation();
        if (this.draggedItem.UID === enteredItem.UID || this.draggedItem.parentId === enteredItem.UID) {
            //cant drop on self
            e.dataTransfer.dropEffect = 'none';
        } else {
            e.dataTransfer.dropEffect = 'move';
            e.currentTarget.classList.add('sitepage-item-dropable');
        }
    }

    dragOver(e: any, enteredItem: PageInstance) {
        e.preventDefault();
        e.stopPropagation();
        if (this.draggedItem.UID === enteredItem.UID || this.draggedItem.parentId === enteredItem.UID) {
            //cant drop on self
            e.dataTransfer.dropEffect = 'none';
        } else {
            e.dataTransfer.dropEffect = 'move';
            e.currentTarget.classList.add('sitepage-item-dropable');
        }
    }

    dragLeave(e: any, leftItem: PageInstance) {
        e.preventDefault();
        e.stopPropagation();
        e.currentTarget.classList.remove('sitepage-item-dropable');
    }

    drop(e: any, dropTarget: PageInstance) {
        e.preventDefault();
        e.stopPropagation();
        e.currentTarget.classList.remove('sitepage-item-dropable');
        if (this.draggedItem.UID === dropTarget.UID || this.draggedItem.parentId === dropTarget.UID) {
            console.log(" cant drop on self or own parent");
        }
        else {
            console.log(this.draggedItem.name + " moved from " + this.draggedItem.parentId + " to " + dropTarget.UID);
            this.reHome(this.draggedItem,dropTarget);
            //this.draggedHelpItem.setParent(dropTarget.id);
            //this.doOutcome("onRehome", this.draggedHelpItem)
        }
        this.draggedItem = undefined;
    }
   
    render() {
        manywho.log.info('Rendering Site: ' + this.props.id);

        if (this.props.isDesignTime) return null;
        
        let className = "sitedesigner";

        let componentStyle: React.CSSProperties = {};

        let content: any = [];
        if(this.site) {
            this.site.children.forEach((page: PageInstance) => {
                content.push(
                    <SitePage 
                        root={this}
                        page={page}
                        ref={(element: SitePage) =>{this.registerChild(page.id, element)}}
                    />
                );
            });
        }

        let buttons: any[] = [];
        buttons.push(
            <span 
                className="sitepage-header-button glyphicon glyphicon-floppy-disk"
                title="Save"
                onClick={this.saveChanges}
            />
        );

        return (
            <div 
                className={className} 
                style={componentStyle}
                id={this.props.id} 
                ref="container"
            >
                <FCMModal
                    parent={this}
                    ref={(element: FCMModal) => {this.messageBox = element; }}
                />
                <div
                    className='sitedesigner-header'
                >
                    {buttons}
                </div>
                <div
                    className='sitedesigner-scroller'
                >
                    <div
                        className='sitedesigner-canvas'
                    >
                        {content}
                    </div>
                </div>
                
            </div>
        );
    }
}

manywho.component.register("SiteDesigner", SiteDesigner); 

