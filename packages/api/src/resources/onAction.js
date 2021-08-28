/* eslint-disable quotes */
var playerViews;
var context;

var playerView;

for (var i = 0; i < playerViews.length; i++) {
    if (playerViews[i].playerId === context.playerId) {
        playerView = {
            type: 'Card',
            data: JSON.stringify(context),
            state: '',
        };
    }
}

JSON.stringify({ playerViews: [playerView] });
