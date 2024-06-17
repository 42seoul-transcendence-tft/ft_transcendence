# from django.shortcuts import render
# from django.core.cache import cache
# from django.http import JsonResponse

from rest_framework.response import Response
from rest_framework import viewsets, status
from rest_framework.renderers import JSONRenderer
from .authentication import CustomPermission
from .models import Room, RoomSerializer

from django.shortcuts import render

class RoomViewset(viewsets.ViewSet):
	renderer_classes = [JSONRenderer]
	# permission_classes = [CustomPermission]
 
	def list(self, request):
		queryset = Room.objects.all()
		serializer = RoomSerializer(queryset, many=True)
		return Response(serializer.data)

	def create(self, request):
		serializer = RoomSerializer(data=request.data)
		if serializer.is_valid():
			serializer.save()
			return Response(serializer.data, status=status.HTTP_201_CREATED)
		else:
			return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

def index(request):
	return render(request, "index.html")

def room(request, room_name):
	return render(request, "room.html", {"room_name": room_name})

# Create your views here.
