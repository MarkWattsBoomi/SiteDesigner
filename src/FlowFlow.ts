export class FlowFlows {
    byId: Map<string,FlowFlow> = new Map();
    byDeveloperName: Map<string,string> = new Map();

    public static parse(src: any[]) : FlowFlows {
        let flows: FlowFlows = new FlowFlows();
        for(let pos = 0 ; pos < src.length ; pos++) {
            let flow: FlowFlow = FlowFlow.parse(src[pos]);
            flows.add(flow);
        }
        return flows;
    }

    public getAscending() : Map<string,FlowFlow> {
        const flows: Map<string, FlowFlow> = new Map(Array.from(this.byId).sort((item1, item2) => {
            return item1[1].developerName.localeCompare(item2[1].developerName)
        }));
        return flows;
    }

    public get(id: string) {
        return this.byId.get(id);
    }

    public getByDeveloperName(name: string) {
        return this.byId.get(this.byDeveloperName.get(name));
    }

    public add(newFlow: FlowFlow) {
        this.byId.set(newFlow.id, newFlow);
        this.byDeveloperName.set(newFlow.developerName, newFlow.id);
    }
}

export class FlowFlow {
    id: string;
    developerName: string;
    developerSummary: string;

    public static parse(src: any) : FlowFlow {
        let flow: FlowFlow = new FlowFlow();
        flow.id = src.id.id;
        flow.developerName=src.developerName;
        flow.developerSummary=src.developerSummary;
        return flow;
    }
}