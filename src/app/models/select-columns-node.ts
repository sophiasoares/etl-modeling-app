import { NodeBase } from './node';
import { SelectColumnsNodeSettingsComponent } from '../components/node-settings/select-columns-node-settings/select-columns-node-settings.component';

export class SelectColumnsNode extends NodeBase {
    private selected_columns: string[] = [];

    constructor() {
        super('Select Columns', 1, 1);
    }

    getSettingsComponent() {
        return SelectColumnsNodeSettingsComponent;
    }

    // Getters and setters 
    get selectedColumns() {
        return this.selected_columns;
    }

    set selectedColumns(value: string[]) {
        this.selected_columns = value;
    }
}