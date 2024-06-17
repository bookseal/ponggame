# game/views.py

from rest_framework import viewsets
from .models import Player, GameRecord
from .serializers import PlayerSerializer, GameRecordSerializer

class PlayerViewSet(viewsets.ModelViewSet):
		queryset = Player.objects.all()
		serializer_class = PlayerSerializer

class GameRecordViewSet(viewsets.ModelViewSet):
		queryset = GameRecord.objects.all()
		serializer_class = GameRecordSerializer
