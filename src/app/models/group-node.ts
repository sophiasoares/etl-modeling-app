import { GroupNodeSettingsComponent } from '../components/node-settings/group-node-settings/group-node-settings.component';
import { NodeBase } from './node';

export class GroupNode extends NodeBase {
    // TODO: Add properties for GroupNode

    constructor() {
        super('Group', 1, 1);
    }

    getSettingsComponent() {
        return GroupNodeSettingsComponent;
    }
}