import { eLoadingState, FlowComponent } from "flow-component-model";
import React, { CSSProperties } from "react";
import { FlowFlow, FlowFlows } from "./FLowFlow";
import { GetFlows, GetTenantToken } from "./FlowFunctions";
import FlowTenantToken from "./FlowTenantToken";

declare var manywho: any;


export default class FlowPicker extends FlowComponent {
    token: FlowTenantToken;
    flowFlows: FlowFlows;
    selectedFlow: string;
    retries: number = 0;

    constructor(props: any) {
        super(props);

        this.flowMoved = this.flowMoved.bind(this);
        this.flowSelected = this.flowSelected.bind(this);
        //this.saveChanges = this.saveChanges.bind(this);
    }

    async componentDidMount(): Promise<void> {
        await super.componentDidMount();
        (manywho as any).eventManager.addDoneListener(this.flowMoved, this.componentId);
        this.loadFlows();        
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
                this.loadFlows(); 
            }
        }

    }

    async loadFlows() {
        this.selectedFlow = this.getStateValue() as string;
        this.token = await GetTenantToken(this.getAttribute("user"), this.getAttribute("token"),this.tenantId);
        if(this.token) {
            this.flowFlows = await GetFlows(this.tenantId, this.token);
        }
        this.forceUpdate();
    }

    async flowSelected(e: any) {
        this.selectedFlow = e.currentTarget.options[e.currentTarget.selectedIndex].value; 
        this.setStateValue(this.selectedFlow);
        if(this.outcomes["OnSelect"]){
            await this.triggerOutcome("OnSelect");
        }
        else {
            manywho.engine.sync(this.flowKey);
        }
    }

    render() {
        let options: any[] = [];
        if(this.flowFlows){
            options.push(
                <option
                    value={undefined}
                    selected={this.selectedFlow === undefined}
                >
                    {"Please select"}
                </option>
            );
            this.flowFlows.getAscending().forEach((flow: FlowFlow) => {
                options.push(
                    <option
                        value={flow.id}
                        selected={this.selectedFlow === flow.id}
                    >
                        {flow.developerName}
                    </option>
                );
            });
        }

        let inputStyle: CSSProperties = {padding:"0.5rem", border:"1px solid #ccc", display: "block"};
        let classname: string = "mw-select form-group";
        if(this.model.visible===false) {
            classname += " hidden";
        }
        return(
            <div
                className={classname}
            >
                <div
                    id={this.componentId}
                >
                    <label>{this.model.label}</label>
                    <select
                        style={inputStyle}
                        onChange={this.flowSelected}
                    >
                        {options}
                    </select>
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
manywho.component.register("FlowPicker", FlowPicker); 