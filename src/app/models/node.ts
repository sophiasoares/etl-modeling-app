export interface NodeItem {
    title: string;
    id: number;
    temp?: boolean;
    position?: { left: number, top: number };
    isBeingDragged?: boolean;
}