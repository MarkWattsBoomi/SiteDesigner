import { eLoadingState, FlowComponent, FlowMessageBox, modalDialogButton } from "flow-component-model";
import React, { CSSProperties } from "react";
import { eAssetType, FlowAsset, FlowAssets } from "./FlowAssets";
import "./ImageAssetPicker.css";
import { GetAssets, GetFlows, GetTenantToken } from "./FlowFunctions";
import FlowTenantToken from "./FlowTenantToken";

declare var manywho: any;


export default class ImageAssetPicker extends FlowComponent {
    token: FlowTenantToken;
    flowAssets: FlowAssets;
    selectedAsset: string;
    retries: number = 0;
    messageBox: FlowMessageBox;

    constructor(props: any) {
        super(props);

        this.flowMoved = this.flowMoved.bind(this);
        this.pickAsset = this.pickAsset.bind(this);
        this.assetSelected = this.assetSelected.bind(this);
        //this.saveChanges = this.saveChanges.bind(this);
    }

    async componentDidMount(): Promise<void> {
        await super.componentDidMount();
        (manywho as any).eventManager.addDoneListener(this.flowMoved, this.componentId);
        this.loadAssets();        
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
                this.loadAssets();
            }
        }

    }

    async loadAssets() {
        this.selectedAsset = this.getStateValue() as string;
        this.token = FlowTenantToken.parse(this.getAttribute("token")); //await GetTenantToken(this.getAttribute("user"), this.getAttribute("token"),this.tenantId);
        if(this.token) {
            this.flowAssets = await GetAssets(this.tenantId, this.token);
        }
        this.forceUpdate();
    }

    async assetSelected(key: any) {
        this.messageBox.hideMessageBox();
        if(key) {
            this.selectedAsset = this.flowAssets.get(key).publicUrl;
        }
        else {
            this.selectedAsset = undefined;
        }
        this.setStateValue(this.selectedAsset);
        if(this.outcomes["OnSelect"]){
            await this.triggerOutcome("OnSelect");
        }
        else {
            manywho.engine.sync(this.flowKey);
        }
    }

    pickAsset(e: any) {
        e.stopPropagation();
        if(!this.flowAssets)return;
        let options: any[] = [];
        let imgStyle: CSSProperties = {maxWidth: "100px",height: "100px", objectFit: "contain", cursor: "pointer"}
        if(this.flowAssets){
            options.push(
                <span
                    className={"aip aip-none" + (this.selectedAsset===undefined ? " aip-selected" : "")}
                    key={undefined}
                    onClick={(e: any) => {this.assetSelected(undefined)}}
                >
                    <span
                        className="aip-none-label"
                    >
                        None 
                    </span>   
                </span>
            );
            this.flowAssets.getAscending(eAssetType.image).forEach((asset: FlowAsset) => {
                options.push(
                    <img
                        className={"aip"  + (this.selectedAsset===asset.publicUrl ? " aip-selected" : "")}
                        key={asset.key}
                        src={asset.publicUrl}
                        onClick={(e: any) => {this.assetSelected(asset.key)}}
                    />
                );
            });
        }

        let imgArray = (
            <div
                style={{display: "flex", flexDirection: "row", flexWrap: "wrap", maxWidth: "50vw"}}
            >
                {options}
            </div>
        );

        this.messageBox.showMessageBox(
                "Select an Image",
                imgArray,
                [new modalDialogButton("Cancel",this.messageBox.hideMessageBox)]
        )
    }

    render() {
        

        let iconStyle: CSSProperties = {display: "block", cursor:"pointer", objectFit: "contain"};
        iconStyle.width = (this.model.width > 1? this.model.width : 100) + "px"
        iconStyle.height = (this.model.height > 1? this.model.height : 100) + "px";
        let classname: string = "form-group";
        if(this.model.visible===false) {
            classname += " hidden";
        }

        let img: any;
        if(this.selectedAsset) {
            img = (
                <img
                    src={this.getStateValue() as string}
                    style={iconStyle}
                    onClick={this.pickAsset}
                />
            );
        } 
        else {
            iconStyle.display = "flex";
            img = (
                <span
                    className={"aip aip-none"}
                    style={iconStyle}
                    onClick={this.pickAsset}
                >
                    <span
                        className="aip-none-label"
                    >
                        None 
                    </span>   
                </span>
            );
        }
        return(
            <div
                className={classname}
            >
                <FlowMessageBox 
                    ref={(element: FlowMessageBox) => {this.messageBox = element}}
                />
                <div
                    id={this.componentId}
                >
                    <label>{this.model.label}</label>
                    {img}
                    <span
                        className="help-block"
                    >
                        {this.model.helpInfo}
                    </span>
                </div>
            </div>
                
        );
    }
}
manywho.component.register("ImageAssetPicker", ImageAssetPicker); 