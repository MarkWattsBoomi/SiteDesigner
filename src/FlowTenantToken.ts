export default class FlowTenantToken {
    token: string;
    
    public static parse(src: any) : FlowTenantToken {
        let token: FlowTenantToken = new FlowTenantToken();
        token.token=src;
        return token;
    }
}