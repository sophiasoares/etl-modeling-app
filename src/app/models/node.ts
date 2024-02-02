export interface NodeItem {
    title: string;
    id: number;
    temp?: boolean;
    position?: { left: number, top: number };
    connections?: number[]; // IDs of connected nodes
}