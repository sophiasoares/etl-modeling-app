import { Type } from '@angular/core';

export interface NodeItem {
    title: string;
    id: number;
    temp?: boolean;
    position?: { left: number, top: number };
    connections?: number[]; // IDs of connected nodes
}

export interface MyNode {
    title: string;
    id: string;
    position?: { left: number, top: number };
}

export abstract class NodeBase {
    private title: string;
    private subtitle: string;
    private id: string;
    private numInputs: number;
    private numOutputs: number;
    private position?: { left: number, top: number };
    private predecessor_ids: string[]; 
    private successor_ids: string[]; 

    constructor(title: string, numInputs: number, numOutputs: number) {
        this.title = title; // Display name
        this.subtitle = ''; // Short description below the title
        this.id = this.generateId(); // Unique identifier
        this.numInputs = numInputs; // Number of input endpoints
        this.numOutputs = numOutputs; // Number of output endpoints
        this.predecessor_ids = [];
        this.successor_ids = [];
    }
    
    generateId() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

    abstract getSettingsComponent(): Type<any>;

    // Getters and setters
    get Title() {
        return this.title;
    }

    get Subtitle() {
        return this.subtitle;
    }

    set Subtitle(value: string) {
        this.subtitle = value;
    }

    get Id() {
        return this.id;
    }

    get NumInputs() {
        return this.numInputs;
    }

    get NumOutputs() {
        return this.numOutputs;
    }

    get Position() {
        return this.position? this.position : { left: 0, top: 0 };
    }

    set Position(value: { left: number, top: number }) {
        this.position = value;
    }

    get PredecessorIds() {
        return this.predecessor_ids;
    }

    set PredecessorIds(value: string[]) {
        this.predecessor_ids = value;
    }

    get SuccessorIds() {
        return this.successor_ids;
    }

    set SuccessorIds(value: string[]) {
        this.successor_ids = value;
    }
}

