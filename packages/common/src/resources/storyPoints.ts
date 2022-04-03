import { Gamemode } from '@openbox/common';

export const TEST_STORY_POINTS: Gamemode = {
    _id: `TEST_STORY_POINTS`,
    name: `Story Points`,
    author: {
        _id: `open-box`,
        nickname: `open-box`,
    },

    latestVersion: {
        initialPhaseName: `VOTING`,
        initialGameState: ``,

        phases: [
            {
                phaseName: `VOTING`,
                onInitialisation: `
                gameState.storyPoints = []
                
                console.debug();

                playerViews = [];
                players.forEach(player => {
                    playerViews.push({
                        player,
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
            `,
                onSubmit: `
                gameState.storyPoints = gameState.storyPoints.filter(points => points.playerId !== player._id);
                gameState.storyPoints.push({playerId: context.playerId, points: context.playerView.view[0].data});
                
                console.debug();

                const phaseEnd = gameState.storyPoints.length === players.length;
                if (phaseEnd) {
                    phaseName = "VIEW"
                }
            `,
                onTimeout: ``,
                onPlayerJoined: ``,
                onPlayerLeft: `
                gameState.prompts = gameState.prompts.filter(player => player._id !== context.action.player._id);
            `,
            },
            {
                phaseName: `VIEW`,
                onInitialisation: `
                playerViews = [];
                players.forEach(player => {
                    playerViews.push({
                        player,
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
            `,
                onSubmit: ``,
                onTimeout: ``,
                onPlayerJoined: ``,
                onPlayerLeft: ``,
            },
        ],
    },
};
