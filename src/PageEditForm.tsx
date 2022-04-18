import React from "react";


export default class PageEditForm extends React.Component<any,any> {
    

    render() {

        return (
            <div
                className="modal-dialog-body"
            >
                <div
                    className="modal-dialog-input-row"
                >
                    <span
                        className="modal-dialog-input-label"
                    >
                        Id
                    </span>
                    <input 
                        className="modal-dialog-input"
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
                    >
                        Name
                    </span>
                    <input 
                        className="modal-dialog-input"
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
                    >
                        Title
                    </span>
                    <input 
                        className="modal-dialog-input"
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
                    >
                        Breadcrumb Label
                    </span>
                    <input 
                        className="modal-dialog-input"
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