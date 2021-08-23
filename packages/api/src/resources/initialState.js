/* eslint-disable quotes */
var lobby;

var players = lobby.players;
for (var i = 0; i < players.length; i++) {
    players[i] = {
        playerId: players[i]._id,
        view: [{ type: 'Card', data: 'hello' }],
        state: '',
    };
}
JSON.stringify({ playerViews: players });
