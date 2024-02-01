export interface Node {
    id: string;
    name: string;
}

export interface NodeItem {
    title: string;
    id: number;
    temp?: boolean; // Optional property to indicate a temporary item
}