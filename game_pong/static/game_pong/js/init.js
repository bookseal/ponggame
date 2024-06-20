// init.js
document.getElementById('nicknameForm').addEventListener('submit', function(event) {
		event.preventDefault();
		setPlayers();
});

document.getElementById('practiceWithAI').addEventListener('click', function(event) {
		setPlayers(true);
});

function setPlayers(practiceWithAI = false) {
		const player1Nickname = document.getElementById('player1Nickname').value;
		const player2Nickname = document.getElementById('player2Nickname').value;
		const ballSpeed = parseFloat(document.getElementById('ballSpeed').value);

		fetch('/api/set_players/', {
				method: 'POST',
				headers: {
						'Content-Type': 'application/json'
				},
				body: JSON.stringify({
						player1: player1Nickname,
						player2: practiceWithAI ? 'AI' : player2Nickname
				})
		})
		.then(response => response.json())
		.then(data => {
				console.log("STATIC_URL =", STATIC_URL);
				console.log('2Players set:', data);
				document.getElementById('nickname-form').style.display = 'none';
				document.getElementById('game-container').style.display = 'block';
				initGame(data.player1_id, data.player2_id, ballSpeed, practiceWithAI, STATIC_URL);
		})
		.catch(error => {
				console.error('Error setting players:', error);
		});
}
