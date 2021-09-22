import {
    Gamemode,
    Phase,
    PlayerResponse,
    PlayerView,
    WebsocketMessage,
} from '@openbox/common';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const Interpreter = require(`js-interpreter`);

export interface InterpreterOutput {
    gameState: Record<string, unknown>;
    playerViews: PlayerView[];
    phaseName: string;
}

export class GameInstance {
    gamemode: Gamemode;
    gameState: Record<string, unknown>;
    playerViews: PlayerView[];
    phaseName: string;

    getPhase(phaseName: string): Phase | undefined {
        return this.gamemode.phases.find(
            (phase) => phase.phaseName === phaseName,
        );
    }

    getCurrentPhase(): Phase | undefined {
        return this.getPhase(this.phaseName);
    }

    execute(players: PlayerResponse[], code: string, context?: string): void {
        const executable
            // eslint-disable-next-line prefer-template
            = `var players = ${JSON.stringify(players)}; `
            + `var gamestate = ${JSON.stringify(this.gameState)}; `
            + `var context = ${context};`
            + code;

        console.log(`executing game code: `, {
            players,
            gameState: this.gameState,
            context,
            code,
        });

        const interpreter = new Interpreter(executable);
        interpreter.run();
        const result: InterpreterOutput = JSON.parse(interpreter.value);

        console.log(`execution result`, { result: result });

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
        if (newPhaseName && this.phaseName !== newPhaseName) {
            this.setPhase(players, newPhaseName);
        }

        this.gameState = {
            ...result.gameState,
            ...this.gameState,
        };
    }

    constructor(players: PlayerResponse[], gamemode: Gamemode) {
        this.setPhase(players, gamemode.initialPhaseName);
        this.gameState = JSON.parse(gamemode.initialGameState);
        this.gamemode = gamemode;
    }

    setPhase(players: PlayerResponse[], newPhaseName: string): void {
        const newPhase = this.getPhase(newPhaseName);

        if (!newPhase) {
            throw new Error(`No phase found with name ${newPhaseName}`);
        }

        this.execute(players, newPhase.onInitialisation);

        this.phaseName = newPhaseName;
    }

    submit(players: PlayerResponse[], message: WebsocketMessage): void {
        const code = this.getCurrentPhase()?.onSubmit || ``;

        this.execute(players, code, JSON.stringify(message));
    }

    playerJoined(players: PlayerResponse[], message: WebsocketMessage): void {
        const code = this.getCurrentPhase()?.onPlayerJoined || ``;

        this.execute(players, code, JSON.stringify(message));
    }

    playerLeft(players: PlayerResponse[], message: WebsocketMessage): void {
        const code = this.getCurrentPhase()?.onPlayerLeft || ``;

        this.execute(players, code, JSON.stringify(message));
    }

    request(message: WebsocketMessage): void {
        // return a player view for a player
    }
}
