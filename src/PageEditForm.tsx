import React, { CSSProperties } from "react";
import { FlowFlow } from "./FLowFlow";
import SiteDesigner from "./SiteDesigner";


export default class PageEditForm extends React.Component<any,any> {
    
    

    render() {
        let root: SiteDesigner = this.props.root;
        let labelStyle: CSSProperties = {width:"10rem", fontSize: "1rem !important",textAlign: "right"};
        let inputStyle: CSSProperties = {width:"30rem", fontSize: "1rem !important"};

        if(!this.props.page.flow) {
            this.props.page.flow = root.flowFlows.getAscending().values().next().value.id;
        }

        let options: any[] = [];
        root.flowFlows.getAscending().forEach((flow: FlowFlow) => {
            options.push(
                <option
                    value={flow.id}
                    selected={this.props.page.flow === flow.id}
                >
                    {flow.developerName}
                </option>
            );
        });
        let flows = (
            <select
                className="modal-dialog-select"
                style={inputStyle}
                onChange={(e: any) => {this.props.page.flow = e.currentTarget.options[e.currentTarget.selectedIndex].value; this.forceUpdate()}}
            >
                {options}
            </select>
        );

        return (
            <div
                className="modal-dialog-body"
            >
                <div
                    className="modal-dialog-input-row"
                >
                    <span
                        className="modal-dialog-input-label"
                        style={labelStyle}
                    >
                        Id
                    </span>
                    <input 
                        className="modal-dialog-input"
                        style={inputStyle}
                        type="text"
                        required={true}
                        value={this.props.page.UID}
                        onChange={(e: any) => {this.props.page.UID = e.currentTarget.value; this.forceUpdate()}}
                    />
                </div>
                <div
                    className="modal-dialog-input-row"
                >
                    <span
                        className="modal-dialog-input-label"
                        style={labelStyle}
                    >
                        Name
                    </span>
                    <input 
                        className="modal-dialog-input"
                        style={inputStyle}
                        type="text"
                        required={true}
                        value={this.props.page.name}
                        onChange={(e: any) => {this.props.page.name = e.currentTarget.value; this.forceUpdate()}}
                    />
                </div>
                <div
                    className="modal-dialog-input-row"
                >
                    <span
                        className="modal-dialog-input-label"
                        style={labelStyle}
                    >
                        Title
                    </span>
                    <input 
                        className="modal-dialog-input"
                        style={inputStyle}
                        type="text"
                        required={true}
                        value={this.props.page.title}
                        onChange={(e: any) => {this.props.page.title = e.currentTarget.value; this.forceUpdate()}}
                    />
                </div>
                <div
                    className="modal-dialog-input-row"
                >
                    <span
                        className="modal-dialog-input-label"
                        style={labelStyle}
                    >
                        Breadcrumb Label
                    </span>
                    <input 
                        className="modal-dialog-input"
                        style={inputStyle}
                        type="text"
                        required={true}
                        value={this.props.page.breadcrumb}
                        onChange={(e: any) => {this.props.page.breadcrumb = e.currentTarget.value; this.forceUpdate()}}
                    />
                </div>
                <div
                    className="modal-dialog-input-row"
                >
                    <span
                        className="modal-dialog-input-label"
                        style={labelStyle}
                    >
                        Flow
                    </span>
                    {flows}
                </div>
            </div>
        );
    }
}