import { Player } from './playerTypes';

export enum ComponentTypes {
    TITLE = `TITLE`,

    SUBMIT_BUTTON = `SUBMIT_BUTTON`,
    TEXT_BOX = `TEXT_BOX`,
    CARD = `CARD`,
    CARD_LIST = `CARD_LIST`,
}

export class Component {
    type: ComponentTypes;

    data?: unknown;
    settings?: unknown;

    child?: Component;
}

export class TitleComponent extends Component {
    type = ComponentTypes.TITLE;

    data: {
        title?: string;
        description?: string;
    };

    child: Component;
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

    data: {
        text: string;
        selected?: boolean;
    };
}

export class CardListComponent extends Component {
    type = ComponentTypes.CARD_LIST;

    data: {
        text: string;
        selected?: boolean;
    }[];
    settings?: {
        maxSelectable?: number;
    };
}

export class PlayerView {
    player: Player;
    view: Component[];
}
