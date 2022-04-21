import React, { CSSProperties } from "react";


export default class PageEditForm extends React.Component<any,any> {
    
    

    render() {

        let labelStyle: CSSProperties = {width:"10rem", fontSize: "1rem !important"};
        let inputStyle: CSSProperties = {width:"30rem", fontSize: "1rem !important"};
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
            </div>
        );
    }
}