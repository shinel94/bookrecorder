import os
import sys
import urllib.request
import json
import requests

book_category_tag = 'a:bok.category,r:1'



def extract_book_category(a_url):
    s_response = requests.get(a_url)
    if s_response.status_code == 200:
        try:
            s_category = s_response.content.decode('utf-8').split(book_category_tag)[1].split('>')[1].split('<')[0]
        except:
            s_category = 'unknown'
    else:
        s_category  = 'unknown'
    return s_category


client_id = "NVKD3EdPrr0T2MHG0aFH"  # 개발자센터에서 발급받은 Client ID 값
client_secret = "V6625qs8BD"  # 개발자센터에서 발급받은 Client Secret 값
encText = urllib.parse.quote("고구려")
url = "https://openapi.naver.com/v1/search/book.json?query=" + encText
request = urllib.request.Request(url)
request.add_header("X-Naver-Client-Id", client_id)
request.add_header("X-Naver-Client-Secret", client_secret)
response = urllib.request.urlopen(request)
rescode = response.getcode()
if (rescode == 200):
    response_body = response.read()
    body_text = response_body.decode('utf-8')
    body_json = json.loads(body_text)
    book_list = body_json['items']
    book_list = [[book['title'], book['author'], extract_book_category(book['link'])] for book in book_list]
    print(book_list)

else:
    print("Error Code:" + rescode)