import { Gamemode } from "@openbox/common";

export const TEST_STORY_POINTS: Gamemode = {
    _id: `TEST_STORY_POINTS`,
    name: `Story Points`,

    initialPhaseName: "VOTING",
    initialGameState: "",

    phases: [
        {
            phaseName: `VOTING`,
            onInitialisation: `
                gameState.storyPoints = [];

                const playerViews = [];
                players.forEach(player => {
                    playerViews.push({
                        playerId: player._id,
                        view: [
                            {
                                type: "TEXT_BOX"
                            },
                            {
                                type: "SUBMIT_BUTTON"
                            }
                        ]
                    })
                });

                return {gameState, playerViews};
            `,
            onSubmit: `
                gameState.storyPoints = gameState.storyPoints.filter(points => points.playerId !== player._id);
                gameState.storyPoints.push({playerId: context.playerView.playerId, points: context.playerView.view[0].data});

                const phaseEnd = gameState.storyPoints.length === players.length;

                return {
                    phaseName: phaseEnd ? "VIEW": undefined,
                    gameState: gameState
                };
            `,
            onTimeout: ``,
            onPlayerJoined: ``,
            onPlayerLeft: `
                gameState.prompts = gameState.prompts.filter(player => player._id !== context.action.player._id);
                return {
                    gameState
                }
            `,
        },
        {
            phaseName: `VIEW`,
            onInitialisation: `
                const playerViews = [];
                players.forEach(player => {
                    playerViews.push({
                        playerId: player._id,
                        view: [
                            {
                                type: "CARD_LIST",
                                data: gameState.storyPoints.map(points => points.playerId + ": " + points.points)
                            },
                            {
                                type: "SUBMIT_BUTTON",
                                data: "restart"
                            }
                        ]
                    })
                });

                return {gameState, playerViews};
            `,
            onSubmit: ``,
            onTimeout: ``,
            onPlayerJoined: ``,
            onPlayerLeft: ``,
        },
    ],
};
