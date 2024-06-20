// static/js/game.js

function initGame(player1Id, player2Id, ballSpeed, practiceWithAI, STATIC_URL) {
		const scene = new THREE.Scene();
		const camera = new THREE.PerspectiveCamera(75, window.innerWidth / 400, 0.1, 1000);
		const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('gameCanvas') });
		renderer.setSize(window.innerWidth, 400);

		camera.position.z = 50;
		camera.position.y = 50;
		camera.rotation.x = -Math.PI / 4;

		const floor = createFloor(scene, STATIC_URL);
		const ball = createBall(scene, ballSpeed, STATIC_URL);
		const paddles = createPaddles(scene);

		function animate() {
				requestAnimationFrame(animate);
				updateBall(ball);
				updatePaddles(paddles, ball, practiceWithAI);
				checkCollisions(ball, paddles);
				checkWinLose(ball);
				renderer.render(scene, camera);
		}

		animate();
		if (practiceWithAI) {
				aiControlPaddle(paddles.rightPaddle, ball); // 비동기 AI 실행
		}
}

function createFloor(scene, STATIC_URL) {
		const textureLoader = new THREE.TextureLoader();
		const floorTexture = textureLoader.load(STATIC_URL + 'game_pong/images/floor_texture.png');
		floorTexture.wrapS = THREE.RepeatWrapping;
		floorTexture.wrapT = THREE.RepeatWrapping;
		floorTexture.repeat.set(10, 10);

		const floorGeometry = new THREE.PlaneGeometry(50, 50);
		const floorMaterial = new THREE.MeshBasicMaterial({ map: floorTexture });
		const floor = new THREE.Mesh(floorGeometry, floorMaterial);
		floor.rotation.x = -Math.PI / 2;
		scene.add(floor);
		return floor;
}

function createBall(scene, ballSpeed, STATIC_URL) {
		const textureLoader = new THREE.TextureLoader();
		const ballTexture = textureLoader.load(STATIC_URL + 'game_pong/images/bee_texture.png');
		const ballGeometry = new THREE.BoxGeometry(2, 2, 2);
		const ballMaterial = new THREE.MeshBasicMaterial({ map: ballTexture });
		const ball = new THREE.Mesh(ballGeometry, ballMaterial);
		ball.position.set(0, 1, 0);
		scene.add(ball);
		ball.velocity = new THREE.Vector3(ballSpeed, 0, ballSpeed);
		return ball;
}

function updateBall(ball) {
		ball.position.add(ball.velocity);
		if (ball.position.x > 25 || ball.position.x < -25) ball.velocity.x = -ball.velocity.x;
		if (ball.position.z > 25 || ball.position.z < -25) ball.velocity.z = -ball.velocity.z;
}

function createPaddles(scene) {
		const paddleGeometry = new THREE.BoxGeometry(1, 4, 10);

		const leftPaddleMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 }); // 빨간색
		const rightPaddleMaterial = new THREE.MeshBasicMaterial({ color: 0x0000ff }); // 파란색

		const leftPaddle = new THREE.Mesh(paddleGeometry, leftPaddleMaterial);
		leftPaddle.position.set(-24, 2, 0);
		scene.add(leftPaddle);

		const rightPaddle = new THREE.Mesh(paddleGeometry, rightPaddleMaterial);
		rightPaddle.position.set(24, 2, 0);
		scene.add(rightPaddle);

		return { leftPaddle, rightPaddle };
}

function updatePaddles(paddles, ball, practiceWithAI) {
		if (keyIsPressed['a']) paddles.leftPaddle.position.z -= 0.2;
		if (keyIsPressed['z']) paddles.leftPaddle.position.z += 0.2;
		if (!practiceWithAI) {
				if (keyIsPressed['\'']) paddles.rightPaddle.position.z -= 0.2;
				if (keyIsPressed['/']) paddles.rightPaddle.position.z += 0.2;
		}
}

async function aiControlPaddle(paddle, ball) {
		while (true) {
				const predictedZ = ball.position.z + ball.velocity.z;

				const keyEvent = new KeyboardEvent('keydown', { key: '' });

				if (predictedZ > paddle.position.z) {
						paddle.position.z += 0.5;
						keyEvent.key = '/';
				} else if (predictedZ < paddle.position.z) {
						paddle.position.z -= 0.5;
						keyEvent.key = '\''; 
				}

				window.dispatchEvent(keyEvent);

				await new Promise(resolve => setTimeout(resolve, 10)); 
		}
}

function checkCollisions(ball, paddles) {
		if (ball.position.distanceTo(paddles.leftPaddle.position) < 3) ball.velocity.x = -ball.velocity.x;
		if (ball.position.distanceTo(paddles.rightPaddle.position) < 3) ball.velocity.x = -ball.velocity.x;
}

function checkWinLose(ball) {
		if (ball.position.x > 25) {
				console.log('Player 1 wins!');
				sendResultToServer('player1');
		}
		if (ball.position.x < -25) {
				console.log('Player 2 wins!');
				sendResultToServer('player2');
		}
}

function sendResultToServer(winner) {
		fetch('/api/game_result/', {
				method: 'POST',
				headers: {
						'Content-Type': 'application/json'
				},
				body: JSON.stringify({ winner: winner })
		})
		.then(response => response.json())
		.then(data => {
				console.log('Result sent:', data);
		})
		.catch(error => {
				console.error('Error sending result:', error);
		});
}

const keyIsPressed = {};
window.addEventListener('keydown', (e) => { keyIsPressed[e.key] = true; });
window.addEventListener('keyup', (e) => { keyIsPressed[e.key] = false; });
