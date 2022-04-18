import FlowTenantToken from "./FlowTenantToken";
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

export async function GetPageType(tenantId: string, token: FlowTenantToken) : Promise<Page> {

    let page: Page
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
        let types: any[] = await response.json();
        let baseDef: any = types.filter((type: any) => { return type.developerName === "Page"})[0];
        if(baseDef) {
            let id: string = baseDef.id;
            url += "/" + id;
            response = await fetch(url, request);
            if(response.status === 200) {
                let type: any = await response.json();
                page = Page.parseType(type);
            }
            else {
                const errorText = await response.text();
                console.log("Fetching type " + id + " failed - " + errorText); 
            }
            
        }
        else {
            console.log("Type Page not found"); 
        }
    }
    else {
        //error
        const errorText = await response.text();
        console.log("Fetching types failed - " + errorText);
        
    }

    return page;
}

export async function GetSiteValue(tenantId: string, token: FlowTenantToken) : Promise<Page> {

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
        let baseVal: any = values.filter((type: any) => { return type.developerName === "Site"})[0];
        if(baseVal) {
            let id: string = baseVal.id;
            url += "/" + id;
            response = await fetch(url, request);
            if(response.status === 200) {
                let val: any = await response.json();
                site = Page.parseValue(val);
            }
            else {
                const errorText = await response.text();
                console.log("Fetching type " + id + " failed - " + errorText); 
            }
            
        }
        else {
            console.log("Type Page not found"); 
        }
    }
    else {
        //error
        const errorText = await response.text();
        console.log("Fetching types failed - " + errorText);
        
    }

    return site;
}

export async function SetSiteValue(tenantId: string, token: FlowTenantToken, value: any) : Promise<any> {

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