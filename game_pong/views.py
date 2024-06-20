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


# game/views.py

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import status


@api_view(['POST'])
@permission_classes([AllowAny])
def set_players(request):
		player1_name = request.data.get('player1')
		player2_name = request.data.get('player2')

		# 기존 플레이어 삭제 (게임 재시작 시)
		Player.objects.all().delete()

		player1 = Player.objects.create(username=player1_name)
		player2 = Player.objects.create(username=player2_name)

		return Response({"player1_id": player1.id, "player2_id": player2.id}, status=status.HTTP_201_CREATED)
