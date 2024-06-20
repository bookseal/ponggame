# game/management/commands/create_initial_data.py

from django.core.management.base import BaseCommand
from game.models import Player, GameRecord

class Command(BaseCommand):
		help = 'Create initial data for testing'

		def handle(self, *args, **kwargs):
				player1 = Player.objects.create(username='player1', score=0)
				player2 = Player.objects.create(username='player2', score=0)

				GameRecord.objects.create(player1=player1, player2=player2, player1_score=10, player2_score=5)
				GameRecord.objects.create(player1=player1, player2=player2, player1_score=7, player2_score=10)

				self.stdout.write(self.style.SUCCESS('Successfully created initial data'))
