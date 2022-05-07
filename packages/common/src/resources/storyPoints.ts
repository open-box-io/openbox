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

        sharedCode: `
            const options = ["hidden", 1, 2, 3, 5, 8, 13];

            const recalculateAllViews = (voting) => {
                playerViews = players.map(player => ({
                    player,
                    view: [
                        {
                            type: "CARD_LIST",
                            data: gameState.storyPoints
                                .filter(points => points.points !== "hidden")
                                .map(points => ({
                                    text: (voting? "?": points.points) + "\\n" + points.player.name,
                                    selected: !points.points
                                }))
                        },
                        {
                            type: "CARD_LIST",
                            data: options.map(option => {
                                const points = gameState.storyPoints.find(points => points.player._id === player._id)
                                const isSelected = points && points.points === option

                                return {
                                    text: option,
                                    selected: isSelected,
                                }
                            }),
                            settings: {
                                maxSelectable: 1
                            }
                        },
                        {
                            type: "SUBMIT_BUTTON",
                            data: "view"
                        }
                    ]
                }));
            }
        `,

        phases: [
            {
                phaseName: `VOTING`,
                onInitialisation: `
                    gameState.storyPoints = players.map(player => ({
                        player
                    }))

                    recalculateAllViews(true);
                `,
                onSubmit: `
                    if (context.component === 2) {
                        phaseName = "VIEW"
                    } else {
                        gameState.storyPoints = gameState.storyPoints.filter(points => points.player._id !== context.playerView.player._id);
                    
                        const newPoints = context.playerView.view[1].data.find(card => card.selected);

                        if (newPoints) {
                            gameState.storyPoints.push({player: context.action.sender, points: newPoints.text});
                        }

                        recalculateAllViews(true);
                    }
                `,
                onTimeout: ``,
                onPlayerJoined: ``,
                onPlayerLeft: ``,
            },
            {
                phaseName: `VIEW`,
                onInitialisation: `
                    recalculateAllViews(false);
                `,
                onSubmit: `
                    if (context.component === 2) {
                        phaseName = "VOTING"
                    } else {
                        gameState.storyPoints = gameState.storyPoints.filter(points => points.player._id !== context.playerView.player._id);
                    
                        const newPoints = context.playerView.view[1].data.find(card => card.selected);

                        if (newPoints) {
                            gameState.storyPoints.push({player: context.action.sender, points: newPoints.text});
                        }
                        
                        recalculateAllViews(false);
                    }
                `,
                onTimeout: ``,
                onPlayerJoined: ``,
                onPlayerLeft: ``,
            },
        ],
    },
};
