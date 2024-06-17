# game/tests.py

from django.test import TestCase
from .models import Player, GameRecord
from rest_framework.test import APIClient
from django.urls import reverse

class PlayerModelTest(TestCase):
		def setUp(self):
				Player.objects.create(username="testplayer")

		def test_player_creation(self):
				player = Player.objects.get(username="testplayer")
				self.assertEqual(player.username, "testplayer")

class GameRecordModelTest(TestCase):
		def setUp(self):
				player1 = Player.objects.create(username="player1")
				player2 = Player.objects.create(username="player2")
				GameRecord.objects.create(player1=player1, player2=player2, player1_score=10, player2_score=5)

		def test_game_record_creation(self):
				game_record = GameRecord.objects.first()
				self.assertEqual(game_record.player1_score, 10)
				self.assertEqual(game_record.player2_score, 5)

class PlayerAPITest(TestCase):
		def setUp(self):
				self.client = APIClient()
				self.player_url = reverse('player-list')

		def test_get_players(self):
				response = self.client.get(self.player_url)
				self.assertEqual(response.status_code, 200)

class GameRecordAPITest(TestCase):
		def setUp(self):
				self.client = APIClient()
				self.gamerecord_url = reverse('gamerecord-list')

		def test_get_gamerecords(self):
				response = self.client.get(self.gamerecord_url)
				self.assertEqual(response.status_code, 200)
