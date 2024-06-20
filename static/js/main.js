					// static/js/main.js

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
									console.log('Players set:', data);
									document.getElementById('nickname-form').style.display = 'none';
									document.getElementById('game-container').style.display = 'block';
									initGame(data.player1_id, data.player2_id, ballSpeed, practiceWithAI);
							})
							.catch(error => {
									console.error('Error setting players:', error);
							});
					}

					function initGame(player1Id, player2Id, ballSpeed, practiceWithAI) {
							// Three.js 초기 설정
							const scene = new THREE.Scene();
							const camera = new THREE.PerspectiveCamera(75, window.innerWidth / 400, 0.1, 1000);
							const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('gameCanvas') });
							renderer.setSize(window.innerWidth, 400);

							camera.position.z = 50;
							camera.position.y = 50;
							camera.rotation.x = -Math.PI / 4;

							const floor = createFloor(scene);
							const ball = createBall(scene, ballSpeed);
							const paddles = createPaddles(scene);

							function animate() {
									requestAnimationFrame(animate);
									updateBall(ball);
									updatePaddles(paddles, practiceWithAI);
									checkCollisions(ball, paddles);
									checkWinLose(ball);
									renderer.render(scene, camera);
							}

							animate();
					}

					function createFloor(scene) {
							const textureLoader = new THREE.TextureLoader();
							const floorTexture = textureLoader.load('/static/images/floor_texture.png');
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

					function createBall(scene, ballSpeed) {
							const textureLoader = new THREE.TextureLoader();
							const ballTexture = textureLoader.load('/static/images/bee_texture.png');  // 텍스처 파일 이름 수정

							// 정육면체를 생성
							const ballGeometry = new THREE.BoxGeometry(2, 2, 2);  // 크기를 2x2x2로 설정하여 정육면체로 만듦
							const ballMaterial = new THREE.MeshBasicMaterial({ map: ballTexture });
							const ball = new THREE.Mesh(ballGeometry, ballMaterial);
							ball.position.set(0, 1, 0);  // 공의 위치를 설정할 때, y 좌표를 정육면체의 절반 크기인 1로 조정
							scene.add(ball);
							ball.velocity = new THREE.Vector3(ballSpeed, 0, ballSpeed);  // 공의 속도를 설정
							return ball;
					}

					function updateBall(ball) {
							ball.position.add(ball.velocity);
							if (ball.position.x > 25 || ball.position.x < -25) ball.velocity.x = -ball.velocity.x;
							if (ball.position.z > 25 || ball.position.z < -25) ball.velocity.z = -ball.velocity.z;
					}

					function createPaddles(scene) {
							const paddleGeometry = new THREE.BoxGeometry(1, 4, 10);
							const paddleMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });

							const leftPaddle = new THREE.Mesh(paddleGeometry, paddleMaterial);
							leftPaddle.position.set(-24, 2, 0);
							scene.add(leftPaddle);

							const rightPaddle = new THREE.Mesh(paddleGeometry, paddleMaterial);
							rightPaddle.position.set(24, 2, 0);
							scene.add(rightPaddle);

							return { leftPaddle, rightPaddle };
					}

					function updatePaddles(paddles, practiceWithAI) {
							if (keyIsPressed['a']) paddles.leftPaddle.position.z -= 0.2;
							if (keyIsPressed['z']) paddles.leftPaddle.position.z += 0.2;
							if (!practiceWithAI) {
									if (keyIsPressed['\'']) paddles.rightPaddle.position.z -= 0.2;
									if (keyIsPressed['/']) paddles.rightPaddle.position.z += 0.2;
							} else {
									// AI 움직임 로직 추가
									if (ball.position.z > paddles.rightPaddle.position.z) paddles.rightPaddle.position.z += 0.1;
									if (ball.position.z < paddles.rightPaddle.position.z) paddles.rightPaddle.position.z -= 0.1;
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
