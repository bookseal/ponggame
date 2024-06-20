document.getElementById('nicknameForm').addEventListener('submit', function(event) {
		event.preventDefault();
		setPlayers();
});

function setPlayers() {
		const player1Nickname = document.getElementById('player1Nickname').value;
		const player2Nickname = document.getElementById('player2Nickname').value;

		fetch('/api/set_players/', {
				method: 'POST',
				headers: {
						'Content-Type': 'application/json'
				},
				body: JSON.stringify({
						player1: player1Nickname,
						player2: player2Nickname
				})
		})
		.then(response => response.json())
		.then(data => {
				console.log('Players set:', data);
				document.getElementById('nickname-form').style.display = 'none';
				document.getElementById('game-container').style.display = 'block';
				initGame(data.player1_id, data.player2_id);
		})
		.catch(error => {
				console.error('Error setting players:', error);
		});
}

function initGame(player1Id, player2Id) {
}
