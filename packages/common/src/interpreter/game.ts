import { GamemodeVersion, Phase } from '../types/gamemodeTypes';

import { PlayerResponse } from '../types/playerTypes';
import { PlayerView } from '../types/componentTypes';
import { WebsocketMessage } from '../types/websocketTypes';
import { interpret } from './interpreter';

export interface InterpreterOutput {
    gameState: Record<string, unknown>;
    playerViews: PlayerView[];
    phaseName: string;
}

export enum ACTION {
    ON_INITIALISATION = `onInitialisation`,
    ON_SUBMIT = `onSubmit`,
    ON_TIMEOUT = `onTimeout`,
    ON_PLAYER_JOINED = `onPlayerJoined`,
    ON_PLAYER_LEFT = `onPlayerLeft`,
}

export class GameInstance {
    onPlayerViewsChanged: (playerViews: PlayerView[]) => void;

    gamemode: GamemodeVersion;
    resources: string;
    gameState: Record<string, unknown>;

    playerViews: PlayerView[];
    phaseName: string;

    constructor(
        players: PlayerResponse[],
        gamemode: GamemodeVersion,
        resources: string,
        onPlayerViewsChanged: (playerViews: PlayerView[]) => void,
    ) {
        this.onPlayerViewsChanged = onPlayerViewsChanged;
        this.playerViews = [];
        this.gameState = gamemode.initialGameState ?
            JSON.parse(gamemode.initialGameState)
            : {};
        this.gamemode = gamemode;
        this.resources = resources;
        this.setPhase(players, gamemode.initialPhaseName);
    }

    getPhase(phaseName: string): Phase | undefined {
        return this.gamemode.phases.find(
            (phase) => phase.phaseName === phaseName,
        );
    }

    getCurrentPhase(): Phase | undefined {
        return this.getPhase(this.phaseName);
    }

    execute(
        players: PlayerResponse[],
        phaseCode: string,
        action: ACTION,
        context?: WebsocketMessage,
    ): void {
        const code = `const resources = ${this.resources}
            ${this.gamemode.sharedCode}
            ${phaseCode}
            ${action}()`;

        console.log(`GAME CONTROLLER - Executing game code`, {
            phaseName: this.phaseName,
            gameState: this.gameState,

            players,
            playerViews: this.playerViews,

            context,
            code,
        });

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const result: InterpreterOutput | undefined = interpret(
            code,
            players,
            this.gameState,
            this.phaseName,
            context,
        );
        if (!result) return;

        console.log(`GAME CONTROLLER - Execution result`, { result: result });

        const editedPlayerViews = result.playerViews;
        const uneditedPlayerViews = this.playerViews.filter(
            (view) =>
                !editedPlayerViews.find(
                    (editedView) => view.player._id === editedView.player._id,
                ),
        );

        this.onPlayerViewsChanged(editedPlayerViews);
        this.playerViews = [...uneditedPlayerViews, ...editedPlayerViews];

        this.gameState = {
            ...this.gameState,
            ...result.gameState,
        };

        console.log(`GAME CONTROLLER - New game state`, {
            phaseName: this.phaseName,
            gameState: this.gameState,
            playerViews: this.playerViews,
        });

        const newPhaseName = result.phaseName;
        if (newPhaseName && this.phaseName !== newPhaseName) {
            this.setPhase(players, newPhaseName);
        }
    }

    setPhase(players: PlayerResponse[], newPhaseName: string): void {
        const newPhase = this.getPhase(newPhaseName);

        if (!newPhase) {
            throw new Error(`No phase found with name ${newPhaseName}`);
        }

        console.log(`GAME CONTROLLER - New phase`, { newPhase });
        this.phaseName = newPhaseName;

        this.execute(players, newPhase.code, ACTION.ON_INITIALISATION);
    }

    submit(players: PlayerResponse[], message: WebsocketMessage): void {
        console.log(`GAME CONTROLLER - Player submitted`, { message });
        const code = this.getCurrentPhase()?.code || ``;

        this.execute(players, code, ACTION.ON_SUBMIT, message);
    }

    playerJoined(players: PlayerResponse[], message: WebsocketMessage): void {
        const code = this.getCurrentPhase()?.code || ``;

        this.execute(players, code, ACTION.ON_PLAYER_JOINED, message);
    }

    playerLeft(players: PlayerResponse[], message: WebsocketMessage): void {
        const code = this.getCurrentPhase()?.code || ``;

        this.execute(players, code, ACTION.ON_PLAYER_LEFT, message);
    }

    request(message: WebsocketMessage): void {
        // return a player view for a player
    }
}
