import { APIError } from './errorTypes';
import { prop } from '@typegoose/typegoose';

export enum ComponentTypes {
    SUBMIT_BUTTON = `SubmitButton`,
    TEXT_BOX = `TextBox`,
    CARD = `Card`,
}

export class Component {
    @prop() type: string;

    @prop() data: unknown;
}

export class SubmitButtonComponent extends Component {
    @prop() type = ComponentTypes.SUBMIT_BUTTON;

    @prop() data: undefined;
}

export class TextBoxComponent extends Component {
    @prop() type = ComponentTypes.TEXT_BOX;

    @prop() data: string;
}

export class CardComponent extends Component {
    @prop() type = ComponentTypes.CARD;

    @prop() data: string;
}

export class PlayerView {
    @prop() playerId: string;
    @prop() state: string;
    @prop() view: Component[];
}

export class PlayerViewResponse {
    playerId: string;
    view: Component[];
}

export const getComponent = (input: any): Component => {
    if (!input.type) {
        throw new APIError(400, `invalid component type`);
    }

    switch (input.type) {
    case ComponentTypes.SUBMIT_BUTTON:
        return {
            type: input.type,
            data: undefined,
        };

    case ComponentTypes.TEXT_BOX:
    case ComponentTypes.CARD:
    default:
        return {
            type: input.type,
            data: input.data,
        };
    }
};
