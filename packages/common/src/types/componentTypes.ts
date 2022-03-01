import { Player } from './playerTypes';

export enum ComponentTypes {
    SUBMIT_BUTTON = `SUBMIT_BUTTON`,
    TEXT_BOX = `TEXT_BOX`,
    CARD = `CARD`,
    CARD_LIST = `CARD_LIST`,
}

export class Component {
    type: ComponentTypes;

    data?: unknown;
}

export class SubmitButtonComponent extends Component {
    type = ComponentTypes.SUBMIT_BUTTON;

    data?: string;
}

export class TextBoxComponent extends Component {
    type = ComponentTypes.TEXT_BOX;

    data?: string;
}

export class CardComponent extends Component {
    type = ComponentTypes.CARD;

    data?: string;
}

export class CardListComponent extends Component {
    type = ComponentTypes.CARD_LIST;

    data?: string[];
}

export class PlayerView {
    player: Player;
    view: Component[];
}
