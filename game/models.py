# game/models.py

from django.db import models

class Player(models.Model):
		username = models.CharField(max_length=100, verbose_name="Username", help_text="The player's username")
		score = models.IntegerField(default=0, verbose_name="Score", help_text="The player's score")

		def __str__(self):
				return self.username

class GameRecord(models.Model):
		player1 = models.ForeignKey(Player, on_delete=models.CASCADE, related_name='player1_games', verbose_name="Player 1")
		player2 = models.ForeignKey(Player, on_delete=models.CASCADE, related_name='player2_games', verbose_name="Player 2")
		player1_score = models.IntegerField(verbose_name="Player 1 Score")
		player2_score = models.IntegerField(verbose_name="Player 2 Score")
		date_played = models.DateTimeField(auto_now_add=True, verbose_name="Date Played")

		def __str__(self):
				return f"{self.player1} vs {self.player2} on {self.date_played}"
