import { eLoadingState, FlowComponent, FlowMessageBox, modalDialogButton } from "flow-component-model";
import React, { CSSProperties } from "react";
import { eAssetType, FlowAsset, FlowAssets } from "./FlowAssets";
import "./ColorPicker.css";
import { GetAssets, GetFlows, GetTenantToken } from "./FlowFunctions";
import FlowTenantToken from "./FlowTenantToken";
import { HexColorPicker } from "react-colorful";

declare var manywho: any;


export default class ColorPicker extends FlowComponent {
    token: FlowTenantToken;
    flowAssets: FlowAssets;
    selectedColor: string;
    temporaryColor: string;
    retries: number = 0;
    messageBox: FlowMessageBox;

    constructor(props: any) {
        super(props);

        this.flowMoved = this.flowMoved.bind(this);
        this.pickColor = this.pickColor.bind(this);
        this.colorSelected = this.colorSelected.bind(this);
        this.setColor = this.setColor.bind(this);
    }

    async componentDidMount(): Promise<void> {
        await super.componentDidMount();
        (manywho as any).eventManager.addDoneListener(this.flowMoved, this.componentId);
        this.loadState();        
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
                this.loadState();
            }
        }

    }

    async loadState() {
        this.selectedColor = this.getStateValue() as string || "None";
        this.forceUpdate();
    }

    async colorSelected() {
        this.messageBox.hideMessageBox();
        this.selectedColor = this.temporaryColor;
        this.setStateValue(this.selectedColor);
        if(this.outcomes["OnSelect"]){
            await this.triggerOutcome("OnSelect");
        }
        else {
            manywho.engine.sync(this.flowKey);
        }
    }

    setColor(e: any) {
        this.temporaryColor=e;
    }

    pickColor(e: any) {
        e.stopPropagation();
        this.messageBox.showMessageBox(
                "Select a Color",
                (<HexColorPicker color={this.selectedColor || "#999"} onChange={this.setColor} />),
                [new modalDialogButton("Select",this.colorSelected),new modalDialogButton("Cancel",this.messageBox.hideMessageBox)]
        )
    }

    render() {
        

        let iconStyle: CSSProperties = {display: "block", cursor:"pointer", objectFit: "contain"};
        iconStyle.width = (this.model.width > 1? this.model.width : 100) + "px"
        iconStyle.height = (this.model.height > 1? this.model.height : 100) + "px";
        iconStyle.backgroundColor=this.selectedColor;
        let classname: string = "form-group";
        if(this.model.visible===false) {
            classname += " hidden";
        }
        let img: any;
        iconStyle.display = "flex";
        img = (
            <span
                className={"fcp"}
                style={iconStyle}
                onClick={this.pickColor}
            >
                <span
                    className="fcp-label"
                >
                    {this.selectedColor} 
                </span>   
            </span>
        );
        
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
manywho.component.register("ColorPicker", ColorPicker); 