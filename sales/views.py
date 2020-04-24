from django.shortcuts import render
from django.shortcuts import HttpResponse
import requests
import json
from .models import Items
from django.core import serializers
from rest_framework.decorators import api_view

# Create your views here.
def index(request):
    return render(request, 'index.html')

def vendhq_data(request, code):
    params = {
        'code': code,
        'client_id': 'dqM1aaPKaIjQSDtdHezyHzeZzB6MnVN3',
        'client_secret': 'EU9vvhmBZp1lEV9Kub16kAVn4eVEeKaX',
        'grant_type': 'authorization_code',
        'redirect_uri': 'http://127.0.0.1:8000'
    }

    req = requests.post('https://opaala.vendhq.com/api/1.0/token', data = params)

    obj = json.loads(req.text)
    request.session['ACCESS_TOKEN'] = obj['access_token']

    #print(obj['access_token'])

    items = Items.objects.all()

    json_converted = serializers.serialize("json", items)

    return HttpResponse(json_converted)

@api_view(["POST"])
def vendhq_place_order(request):

    print(request.data["prod_id"])

    payload = "{\n\t\"register_id\": \"b1e198a9-f019-11e3-a0f5-b8ca3a64f8f4\",\n\t\"user_id\": \"b1ed6158-f019-11e3-a0f5-b8ca3a64f8f4\",\n\t\"status\": \"SAVED\",\n\t\"register_sale_products\": [{\n\t\t\"product_id\": \""+request.data["prod_id"]+"\",\n\t\t\"quantity\": 1,\n\t\t\"price\": "+request.data["prod_price"]+",\n\t\t\"tax\": 1.8,\n\t\t\"tax_id\": \"b1d192bc-f019-11e3-a0f5-b8ca3a64f8f4\"\n\t}]\n}"

    #print(payload)

    ACCESS_TOKEN = request.session['ACCESS_TOKEN']

    headers = {
        'Authorization': 'Bearer '+ACCESS_TOKEN,
        'Content-Type': 'text/plain'
    }

    req = requests.post('https://opaala.vendhq.com/api/register_sales', headers=headers, data = payload)

    #print(req.text)

    return HttpResponse("Order has been registered on VendHQ successfully")