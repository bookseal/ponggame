// static/js/main.js

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
				// 게임 화면으로 전환
				document.getElementById('nickname-form').style.display = 'none';
				document.getElementById('game-container').style.display = 'block';
				initGame(data.player1_id, data.player2_id);
		})
		.catch(error => {
				console.error('Error setting players:', error);
		});
}

function initGame(player1Id, player2Id) {
		// Three.js 초기 설정 및 게임 시작
		// player1Id와 player2Id를 사용하여 게임 상태 초기화
}
