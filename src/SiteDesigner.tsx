import { eLoadingState, FlowComponent,FlowMessageBox, FlowObjectData, FlowObjectDataArray, modalDialogButton} from 'flow-component-model';
import * as React from 'react';
import "./SiteDesigner.css";
import { GetTenantToken, GetPageType, GetSiteValue, SetSiteValue } from './FlowFunctions';
import FlowTenantToken from './FlowTenantToken';
import { Page } from './Page';
import SitePage from './SitePage';
import PageEditForm from './PageEditForm';
import { PageInstance } from './PageInstance';


declare var manywho: any;

export default class SiteDesigner extends FlowComponent {
    token: FlowTenantToken;
    pageType: Page;
    site: Page;
    children: Map<string,SitePage> = new Map();
    messageBox: FlowMessageBox;
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
            this.pageType = await GetPageType(this.tenantId, this.token);
            this.site = await GetSiteValue(this.tenantId, this.token);
        }
        this.forceUpdate();
    }

    async saveChanges() {
        let newVal = this.site.toObjectData();
        this.token = await GetTenantToken(this.getAttribute("user"), this.getAttribute("token"),this.tenantId);
        if(this.token) {
            await SetSiteValue(this.tenantId,this.token,newVal);
        }
        
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
        this.messageBox.showMessageBox(
            "Edit Page",
            form,
            [new modalDialogButton("Apply",this.pageEditied), new modalDialogButton("Cancel",this.messageBox.hideMessageBox)]
        );
        
    }

    pageEditied() {
        this.messageBox.hideMessageBox();
        this.forceUpdate();
    }

    addChild(page: PageInstance) {
        console.log("Add child to " + page.name);
        let newChild: PageInstance = PageInstance.newInstance("New Page", page.UID);
        let form = (
            <PageEditForm  
                root={this}
                page={newChild}
                pageParent={page}
                ref={(form: PageEditForm) => {this.form = form}}
            />
        );
        this.messageBox.showMessageBox(
            "Add child page",
            form,
            [new modalDialogButton("Apply",this.childAdded), new modalDialogButton("Cancel",this.messageBox.hideMessageBox)]
        );
    }

    childAdded() {
        let form: PageEditForm = this.form;
        let parent: PageInstance = form.props.pageParent;
        let child: PageInstance = form.props.page;
        parent.children.set(child.UID,child);
        this.messageBox.hideMessageBox();
        this.forceUpdate();
    }

    reHome(page: PageInstance, newParent: PageInstance) {
        console.log("Add child to " + page.name)
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
                <FlowMessageBox
                    parent={this}
                    ref={(element: FlowMessageBox) => {this.messageBox = element; }}
                />
                <div
                    className='sitedesigner-header'
                >
                    {buttons}
                </div>
                <div
                    className='sitedesigner-canvas'
                >
                    {content}
                </div>
                
            </div>
        );
    }
}

manywho.component.register("SiteDesigner", SiteDesigner); 

