import json
import time

from locust import between, HttpUser, task
from random import randint, seed

with open('./viaplay_urls.json') as f:
  urls = json.loads(f.read())['viaplay_urls']
  urls_len = len(urls)

seed(round(time.time() * 1000))

class ApiLoadtest(HttpUser):
  min_wait = 100
  max_wait = 1000
  host = 'http://0.0.0.0:8080'

  @task
  def get_trailers(self):
    movie_idx = randint(0, urls_len - 1)
    movie_url = urls[movie_idx]
    with self.client.get(f'/trailers?viaplay_url={movie_url}', catch_response=True) as res:
      return res.status_code == 200
