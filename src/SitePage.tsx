import React from "react";
import { Line, Lines, Point } from "./Line";
import { PageInstance } from "./PageInstance";
import SiteDesigner from "./SiteDesigner";
import './SitePage.css';

export default class SitePage extends React.Component<any,any> {
    me: any;
    item: any;
    //children: Map<string,SitePage> = new Map();
    lines: Map<string,Lines> = new Map();
    canvas: HTMLCanvasElement;
    svg: SVGElement;
    resizeObserver: ResizeObserver;
    moveObserver: IntersectionObserver;

    constructor(props: any) {
        super(props);

        this.addChild=this.addChild.bind(this);
        this.editPage=this.editPage.bind(this);
        this.registerMe=this.registerMe.bind(this);
        this.addLine=this.addLine.bind(this);
        this.generateLines=this.generateLines.bind(this);
        this.drawLines=this.drawLines.bind(this);
        this.resized=this.resized.bind(this);
        this.moved=this.moved.bind(this);        
    }

    componentDidMount() {
        this.resizeObserver = new ResizeObserver(this.resized);
        this.moveObserver = new IntersectionObserver(this.moved);
    
        this.resizeObserver.observe(this.me);
        this.moveObserver.observe(this.me);
        console.log("mount");
        //force canvas coords to same dims as container
        this.canvas.height = this.canvas.clientHeight;
        this.canvas.width = this.canvas.clientWidth;
        this.generateLines();
        this.drawLines();
    }

    componentDidUpdate(prevProps: Readonly<any>, prevState: Readonly<any>, snapshot?: any): void {
        let name: string = this.props.page.UID;
        console.log("Update " + name);
        this.canvas.height = this.canvas.clientHeight;
        this.canvas.width = this.canvas.clientWidth;
        this.generateLines();
        this.drawLines();
    }

    componentWillUpdate(nextProps: Readonly<any>, nextState: Readonly<any>, nextContext: any): void {
        
    }

    componentWillUnmount() {
        if (this.resizeObserver) {
            this.resizeObserver.disconnect();
        }
        if (this.moveObserver) {
            this.moveObserver.disconnect();
        }
    }

    registerMe(me: any) {
        if(me){
            this.me = me;
        }
        else {
            //this.observer.observe(this.componentElement);
        }
    }

    registerItem(item: any) {
        if(item) {
            this.item = item;
        }
    }

    registerCanvas(item: HTMLCanvasElement) {
        if(item) {
            this.canvas = item;
        }
        else {
            this.canvas = undefined;
        }
    }

    resized(e: any) {
        let name: string = this.props.page.UID;
        console.log("resize " + name);
        this.generateLines();
    }

    moved(e: any) {
        let name: string = this.props.page.UID;
        console.log("move " + name);
        this.generateLines();
    }

    addChild(e: any){
        let root: SiteDesigner = this.props.root;
        root.addChild(this.props.page);
    }

    editPage(e: any){
        let root: SiteDesigner = this.props.root;
        root.editPage(this.props.page);
    }

    addLine(key: string, lines: Lines) {
        let name: string = this.props.page.UID;
        console.log("Adding lines for " + key + " to " + name);
        this.lines.set(key,lines);
        this.generateLines();
        this.drawLines();
    }


    generateLines() {
        let parent: SitePage = this.props.parent;
        if(parent && parent.me) {
            let name: string = this.props.page.UID;
            console.log(name + " lines");
            if(name.startsWith("REGISTER_")) {
                console.log("debug");
            }
            //force canvas to same dims as parent
            //parent.canvas.height = parent.canvas.clientHeight;
            //parent.canvas.width = parent.canvas.clientWidth;
            let ctx: CanvasRenderingContext2D = parent.canvas.getContext("2d");
            //ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            let parentRec : DOMRect = parent.me.getBoundingClientRect();
            
            let parentItemRec : DOMRect = parent.item.getBoundingClientRect();
            let parentItemRecStyle: CSSStyleDeclaration = window.getComputedStyle(parent.item);
            let parentItemRecBottomMargin: number = parseInt(parentItemRecStyle.marginBottom.substring(0,parentItemRecStyle.marginBottom.length-2));
            //let parentItemRecLeftMargin: number = parseInt(parentItemRecStyle.marginLeft.substring(0,parentItemRecStyle.marginLeft.length-2));
            let parentBot: number = parentItemRec.height;// - parentItemRecBottomMargin;
            let parentCtr: number = parentRec.width / 2;
            let vCenter: number = parentBot + (parentItemRecBottomMargin / 2);
            let meTop: number = parentBot + parentItemRecBottomMargin;

            let meRec : DOMRect = this.me.getBoundingClientRect();

            let meCenter: number = (meRec.left - parentRec.left) + (meRec.width / 2);
            ctx.lineWidth = 1;
            ctx.strokeStyle = "#FF0000";

            let lines: Lines = new Lines([]);
            lines.addLine(new Line(new Point(parentCtr, parentBot),new Point(parentCtr,vCenter)));
            lines.addLine(new Line(new Point(meCenter, vCenter),new Point(parentCtr,vCenter)));
            lines.addLine(new Line(new Point(meCenter, vCenter),new Point(meCenter,meTop)));

            parent.addLine(name, lines);

        }
    }

    drawLines() {
        let name: string = this.props.page.UID;
        console.log("Draw " + this.lines.size + " lines " + name);
        let ctx: CanvasRenderingContext2D = this.canvas.getContext("2d");
        ctx.clearRect(0,0,this.canvas.width,this.canvas.height);
        ctx.lineWidth = 1;
        ctx.strokeStyle = "#FF0000";

        this.lines.forEach((lines: Lines) => {
            lines.lines.forEach((line: Line) =>{
                ctx.beginPath();
                ctx.moveTo(line.start.x, line.start.y);
                ctx.lineTo(line.end.x, line.end.y);
                ctx.closePath(); 
                ctx.stroke();
            });
            
        });
    }

    render() {
        let root: SiteDesigner = this.props.root;
        let page: PageInstance = this.props.page;
        let children: any[] = [];

        page.children.forEach((child: PageInstance) => {
            children.push(
                <SitePage 
                    key={page.UID}
                    root={this.props.root}
                    parent= {this}
                    page={child}
                />
            );
        })

        let crumbs: string[] = [];
        let node: SitePage = this;
        while (node) {
            let pg: PageInstance = node.props.page;
            crumbs.push(pg.breadcrumb);
            node = node.props.parent;
        }
        
        let breadcrumb: string = crumbs.reverse().join("->");

        let buttons: any[] = [];
        buttons.push(
            <span 
                className="sitepage-header-button glyphicon glyphicon-plus"
                title="Add child page"
                onClick={this.addChild}
            />,
            <span 
                className="sitepage-header-button glyphicon glyphicon-edit"
                title="Edit page"
                onClick={this.editPage}
            />
        )
        
        return (
            <div
                className="sitepage"
                ref={(element: any) => {this.registerMe(element)}}
            >
                <canvas 
                    className="sitepage-canvas"
                    ref={(element: HTMLCanvasElement) => {this.canvas = element}}
                />
                <div
                    className="sitepage-item"
                    ref={(element: any) => {this.registerItem(element)}}
                    draggable={true}
                    onDragStart={(e: any) => {root.dragStart(e,this.props.page)}}
                    onDragEnter={(e: any) => {root.dragEnter(e,this.props.page)}}
                    onDragOver={(e: any) => {root.dragOver(e,this.props.page)}}
                    onDragLeave={(e: any) => {root.dragLeave(e,this.props.page)}}
                    onDrop={(e: any) => {root.drop(e,this.props.page)}}
                >
                    <div
                        className="sitepage-header"
                    >
                        <div
                            className="sitepage-header-title"
                        >
                            {page.UID}
                        </div>
                        <div
                            className="sitepage-header-buttons"
                        >
                            {buttons}
                        </div>
                    </div>
                    <div
                        className="sitepage-body"
                    >
                        <div
                            className="sitepage-body-row"
                        >
                            <span
                                className="sitepage-body-row-value"
                            >
                                {page.name}
                            </span>                            
                        </div>
                    </div>
                </div>
                {this.lines}
                <div
                    className="sitepage-children"
                >
                    {children}
                </div>
            </div>
        );
    }
}