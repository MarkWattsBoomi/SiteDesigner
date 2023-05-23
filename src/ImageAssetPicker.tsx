import { eLoadingState, FlowComponent} from "flow-component-model";
import React, { CSSProperties } from "react";
import { eAssetType, FlowAsset, FlowAssets } from "./FlowAssets";
import "./ImageAssetPicker.css";
import { GetAssets, GetFlows, GetTenantToken, UpsertAsset } from "./FlowFunctions";
import FlowTenantToken from "./FlowTenantToken";
import { FCMModal } from "fcmkit";
import { FCMModalButton } from "fcmkit/lib/ModalDialog/FCMModalButton";

declare var manywho: any;


export default class ImageAssetPicker extends FlowComponent {
    token: FlowTenantToken;
    flowAssets: FlowAssets;
    selectedAsset: string;
    retries: number = 0;
    messageBox: FCMModal;

    constructor(props: any) {
        super(props);

        this.flowMoved = this.flowMoved.bind(this);
        this.pickAsset = this.pickAsset.bind(this);
        this.assetSelected = this.assetSelected.bind(this);
        this.chooseFile = this.chooseFile.bind(this);
        this.fileReadAsDataURL = this.fileReadAsDataURL.bind(this);
        this.fileReadAsArrayBuffer = this.fileReadAsArrayBuffer.bind(this);
    }

    async componentDidMount(): Promise<void> {
        await super.componentDidMount();
        (manywho as any).eventManager.addDoneListener(this.flowMoved, this.componentId);
        await this.loadAssets();        
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
        this.messageBox.hideDialog();
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

    async fileReadAsDataURL(file: any): Promise<any> {
        const reader = new FileReader();

        return new Promise((resolve, reject) => {
            reader.onerror = () => {
                reader.abort();
                reject(new DOMException('Problem reading file'));
            };
            reader.onload = () => {
                resolve(reader.result);
            };
            reader.readAsDataURL(file);
        });
    }

    async fileReadAsArrayBuffer(file: any): Promise<any> {
        const reader = new FileReader();

        return new Promise((resolve, reject) => {
            reader.onerror = () => {
                reader.abort();
                reject(new DOMException('Problem reading file'));
            };
            reader.onload = () => {
                resolve(reader.result);
            };
            reader.readAsArrayBuffer(file);
        });
    }

    async chooseFile(e: any) {

        let pickerOpts: any = {
            types: [
                {
                    description: 'Image files',
                    accept: {
                        'image/*': ['.png', '.gif', '.jpeg', '.jpg']
                    },
                },
            ],
            excludeAcceptAllOption: true,
            multiple: false,
          };
        
        try{
            let handle: any[] = await (window as any).showOpenFilePicker(pickerOpts);
            if(handle[0].kind === 'file') {
                let file = await handle[0].getFile();
                let data = await this.fileReadAsArrayBuffer(file);
                await UpsertAsset(this.tenantId, this.token, file, data);
                this.loadAssets();
                //this.messageBox.hideMessageBox();
                this.pickAsset(null);
            }
        }
        catch(e) {
            console.log(e);
        }
        finally{
            console.log("done");
        }
    }

    async pickAsset(e: any) {
        e?.stopPropagation();
        await this.loadAssets();     
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

        this.messageBox.showDialog(
                null,
                "Select an Image",
                imgArray,
                [new FCMModalButton("Cancel",this.messageBox.hideDialog),new FCMModalButton("Upload",this.chooseFile)]
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
                <FCMModal 
                    ref={(element: FCMModal) => {this.messageBox = element}}
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