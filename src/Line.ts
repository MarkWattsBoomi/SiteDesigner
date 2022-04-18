export class Lines {
    lines: Line[];
    constructor(lines: Line[]) {
        this.lines=[];
        this.lines.concat(lines);
    }

    addLine(line: Line) {
        this.lines.push(line)
    }
}
export class Line {
    start: Point;
    end: Point;
    constructor(start: Point, end: Point) {
        this.start=start;
        this.end=end;
    }
}

export class Point {
    x: number;
    y: number;

    constructor(x: number, y: number) {
        this.x=x;
        this.y=y;
    }
}