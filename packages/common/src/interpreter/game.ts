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

export class GameInstance {
    onPlayerViewsChanged: (playerViews: PlayerView[]) => void;

    gamemode: GamemodeVersion;
    gameState: Record<string, unknown>;

    playerViews: PlayerView[];
    phaseName: string;

    constructor(
        players: PlayerResponse[],
        gamemode: GamemodeVersion,
        onPlayerViewsChanged: (playerViews: PlayerView[]) => void,
    ) {
        this.onPlayerViewsChanged = onPlayerViewsChanged;
        this.playerViews = [];
        this.gameState = gamemode.initialGameState ?
            JSON.parse(gamemode.initialGameState)
            : {};
        this.gamemode = gamemode;
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
        code: string,
        context?: WebsocketMessage,
    ): void {
        console.log(`executing game code`, {
            phaseName: this.phaseName,
            gameState: this.gameState,

            players,
            playerViews: this.playerViews,

            context,
            code,
        });

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const result: InterpreterOutput = interpret(
            code,
            players,
            this.gameState,
            this.phaseName,
            context,
        );

        console.log(`execution result`, { result: result });

        const editedPlayerViews = result.playerViews;
        const uneditedPlayerViews = this.playerViews.filter(
            (view) =>
                !editedPlayerViews.find(
                    (editedView) => view.player._id === editedView.player._id,
                ),
        );

        this.onPlayerViewsChanged(editedPlayerViews);
        this.playerViews = [...uneditedPlayerViews, ...editedPlayerViews];

        const newPhaseName = result.phaseName;
        if (newPhaseName && this.phaseName !== newPhaseName) {
            this.setPhase(players, newPhaseName);
        }

        this.gameState = {
            ...result.gameState,
            ...this.gameState,
        };

        console.log(`new game state`, {
            phaseName: this.phaseName,
            gameState: this.gameState,
            playerViews: this.playerViews,
        });
    }

    setPhase(players: PlayerResponse[], newPhaseName: string): void {
        const newPhase = this.getPhase(newPhaseName);

        if (!newPhase) {
            throw new Error(`No phase found with name ${newPhaseName}`);
        }

        this.phaseName = newPhaseName;

        this.execute(players, newPhase.onInitialisation);
    }

    submit(players: PlayerResponse[], message: WebsocketMessage): void {
        const code = this.getCurrentPhase()?.onSubmit || ``;

        this.execute(players, code, message);
    }

    playerJoined(players: PlayerResponse[], message: WebsocketMessage): void {
        const code = this.getCurrentPhase()?.onPlayerJoined || ``;

        this.execute(players, code, message);
    }

    playerLeft(players: PlayerResponse[], message: WebsocketMessage): void {
        const code = this.getCurrentPhase()?.onPlayerLeft || ``;

        this.execute(players, code, message);
    }

    request(message: WebsocketMessage): void {
        // return a player view for a player
    }
}
