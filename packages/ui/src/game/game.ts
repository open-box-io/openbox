import { Game, Player, PlayerView, WebsocketMessage } from '@openbox/common';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const Interpreter = require(`js-interpreter`);

export interface InterpreterOutput {
    context: string;
    playerViews: PlayerView[];
    phaseName: string;
}

export class GameInstance {
    game: Game;
    context: string;
    playerViews: PlayerView[];
    phaseName: string;

    execute(players: Player[], code: string) {
        const executable
            // eslint-disable-next-line prefer-template
            = `var players = ${JSON.stringify(players)}; `
            + `var context = ${this.context}; `
            + code;

        const interpreter = new Interpreter(executable);
        interpreter.run();
        const result: InterpreterOutput = JSON.parse(interpreter.value);

        const editedPlayerViews = result.playerViews;
        const uneditedPlayerViews = this.playerViews.filter(
            (view) =>
                !editedPlayerViews.find(
                    (editedView) => view.playerId === editedView.playerId,
                ),
        );

        // TODO send updates to players with new views
        this.playerViews = [...uneditedPlayerViews, ...editedPlayerViews];

        const newPhaseName = result.phaseName;
        if (this.phaseName !== newPhaseName) {
            this.setPhase(newPhaseName);
        }
    }

    constructor() {
        // create game state
        // excecute first state
    }

    setPhase(newPhaseName: string) {}

    submit(message: WebsocketMessage) {
        // check valid?
        // excecute game code
        // update state
    }

    request() {
        // return a player view for a player
    }
}
