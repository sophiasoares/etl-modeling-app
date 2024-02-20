import { NodeBase } from './node';
import { SimpleCleanNodeSettingsComponent } from '../components/node-settings/simple-clean-node-settings/simple-clean-node-settings.component';

export class SimpleCleanNode extends NodeBase {
    private remove_whitespaces: boolean = false;
    private replace_backslashes_with_slashes: boolean = false;
    private remove_apostrophes_and_double_quotes: boolean = false;
    private stop_if_invalid_lines: boolean = false;

    constructor() {
        super('Simple Clean', 1, 2);
    }

    getSettingsComponent() {
        return SimpleCleanNodeSettingsComponent;
    }

    // Getters and setters 
    get removeWhitespaces() {
        return this.remove_whitespaces;
    }

    set removeWhitespaces(value: boolean) {
        this.remove_whitespaces = value;
    }

    get replaceBackslashesWithSlashes() {
        return this.replace_backslashes_with_slashes;
    }

    set replaceBackslashesWithSlashes(value: boolean) {
        this.replace_backslashes_with_slashes = value;
    }

    get removeApostrophesAndDoubleQuotes() {
        return this.remove_apostrophes_and_double_quotes;
    }

    set removeApostrophesAndDoubleQuotes(value: boolean) {
        this.remove_apostrophes_and_double_quotes = value;
    }

    get stopIfInvalidLines() {
        return this.stop_if_invalid_lines;
    }

    set stopIfInvalidLines(value: boolean) {
        this.stop_if_invalid_lines = value;
    }
}
  