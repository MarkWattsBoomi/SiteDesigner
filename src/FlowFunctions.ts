import { FlowAssets } from "./FlowAssets";
import { FlowFlows } from "./FLowFlow";
import FlowTenantToken from "./FlowTenantToken";
import { FlowType, FlowTypes } from "./FlowType";
import {Page} from "./Page";

export async function GetTenantToken(userId: string, apiKey: string, tenantId : string): Promise<any> {

    const request: RequestInit = {};
    
    request.method = "GET";  
    request.headers = {
        "Content-Type": "application/json",
        "x-boomi-flow-api-key": apiKey,
        "ManyWhoTenant": tenantId
    };
    
    
    request.credentials= "same-origin";

    let url: string = window.location.origin || 'https://flow.manywho.com';
    url += "/api/draw/1/authentication/" + tenantId;      

    let response = await fetch(url, request);
    if(response.status === 200) {
        let results: any = await response.json();
        let token: FlowTenantToken= FlowTenantToken.parse(results);
        return Promise.resolve(token);
    }
    else {
        let error: string = await response.text();
        return Promise.resolve(error);
    }
}

export async function GetFlows(tenantId: string, token: FlowTenantToken) : Promise<FlowFlows> {

    let flows: FlowFlows;
    
    const request: RequestInit = {};

    request.method = "GET";  
    request.headers = {
        "Content-Type": "application/json",
        "ManyWhoTenant": tenantId
    };

    if(token) {
        request.headers.Authorization = token.token;
    }
        
    request.credentials= "same-origin";

    let url: string = window.location.origin || 'https://flow.manywho.com';
    url += "/api/draw/1/flow";
    

    let response = await fetch(url, request);
    if(response.status === 200) {
        let flowArray: any[] = await response.json();
        flows = FlowFlows.parse(flowArray);
    }
    else {
        //error
        const errorText = await response.text();
        console.log("Fetching types failed - " + errorText);
        
    }

    return flows;
}

export async function GetTypes(tenantId: string, token: FlowTenantToken) : Promise<FlowTypes> {

    let types: FlowTypes;
    
    const request: RequestInit = {};

    request.method = "GET";  
    request.headers = {
        "Content-Type": "application/json",
        "ManyWhoTenant": tenantId
    };

    if(token) {
        request.headers.Authorization = token.token;
    }
        
    request.credentials= "same-origin";

    let url: string = window.location.origin || 'https://flow.manywho.com';
    url += "/api/draw/1/element/type";
    

    let response = await fetch(url, request);
    if(response.status === 200) {
        let typearray: any[] = await response.json();
        types = FlowTypes.parse(typearray);
    }
    else {
        //error
        const errorText = await response.text();
        console.log("Fetching types failed - " + errorText);
        
    }

    return types;
}

export async function SaveType(tenantId: string, token: FlowTenantToken, type: FlowType) : Promise<FlowType> {
    const request: RequestInit = {};

    request.method = "POST";  
    request.headers = {
        "Content-Type": "application/json",
        "ManyWhoTenant": tenantId
    };

    if(token) {
        request.headers.Authorization = token.token;
    }
        
    request.credentials= "same-origin";
    request.body=JSON.stringify(type.toObjectData());

    let url: string = window.location.origin || 'https://flow.manywho.com';
    url += "/api/draw/1/element/type";
    

    let response = await fetch(url, request);
    if(response.status === 200) {
        let newType = await response.json();
        return FlowType.parse(newType);
    }
    else {
        //error
        const errorText = await response.text();
        console.log("Creating type failed - " + errorText);
        return null;
    }
}

export async function GetValue(tenantId: string, token: FlowTenantToken, name: string, type: FlowType) : Promise<Page> {

    let site: Page
    const request: RequestInit = {};

    request.method = "GET";  
    request.headers = {
        "Content-Type": "application/json",
        "ManyWhoTenant": tenantId
    };

    if(token) {
        request.headers.Authorization = token.token;
    }
        
    request.credentials= "same-origin";

    let url: string = window.location.origin || 'https://flow.manywho.com';
    url += "/api/draw/1/element/value";
    

    let response = await fetch(url, request);
    if(response.status === 200) {
        let values: any[] = await response.json();
        let baseVal: any = values.filter((type: any) => { return type.developerName === name})[0];
        if(baseVal) {
            let id: string = baseVal.id;
            url += "/" + id;
            response = await fetch(url, request);
            if(response.status === 200) {
                let val: any = await response.json();
                site = Page.parseValue(val, type);
            }
            else {
                const errorText = await response.text();
                console.log("Fetching value " + name + " failed - " + errorText); 
            }
            
        }
        else {
            console.log("Value " + name + " not found"); 
        }
    }
    else {
        //error
        const errorText = await response.text();
        console.log("Fetching types failed - " + errorText);
        
    }

    return site;
}

export async function SaveValue(tenantId: string, token: FlowTenantToken, value: any) : Promise<any> {

    let site: Page
    const request: RequestInit = {};

    request.method = "POST";  
    request.headers = {
        "Content-Type": "application/json",
        "ManyWhoTenant": tenantId
    };

    if(token) {
        request.headers.Authorization = token.token;
    }
        
    request.credentials= "same-origin";
    request.body=JSON.stringify(value);

    let url: string = window.location.origin || 'https://flow.manywho.com';
    url += "/api/draw/1/element/value";   

    let response = await fetch(url, request);
    if(response.status === 200) {
            console.log("Value updated");
    }
    else {
        //error
        const errorText = await response.text();
        console.log("Updating value failed - " + errorText);
        
    }

    return true;
}

export async function GetAssets(tenantId: string, token: FlowTenantToken) : Promise<FlowAssets> {

    let assets: FlowAssets;
    
    const request: RequestInit = {};

    request.method = "GET";  
    request.headers = {
        "Content-Type": "application/json",
        "ManyWhoTenant": tenantId
    };

    if(token) {
        request.headers.Authorization = token.token;
    }
        
    request.credentials= "same-origin";

    let url: string = window.location.origin || 'https://flow.manywho.com';
    url += "/api/draw/1/assets";
    

    let response = await fetch(url, request);
    if(response.status === 200) {
        let assetArray: any[] = await response.json();
        assets = FlowAssets.parse(assetArray);
    }
    else {
        //error
        const errorText = await response.text();
        console.log("Fetching assets failed - " + errorText);
        
    }

    return assets;
}