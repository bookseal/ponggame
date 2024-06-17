# game/serializers.py

from rest_framework import serializers
from .models import Player, GameRecord

class PlayerSerializer(serializers.ModelSerializer):
		class Meta:
				model = Player
				fields = '__all__'
				read_only_fields = ['score']

class GameRecordSerializer(serializers.ModelSerializer):
		class Meta:
				model = GameRecord
				fields = '__all__'
