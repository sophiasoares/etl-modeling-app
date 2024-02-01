export interface Node {
    id: string;
    name: string;
}

export interface NodeItem {
    title: string;
    id: number;
    temp?: boolean;
    position?: { left: number, top: number };
}