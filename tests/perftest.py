import json

from locust import between, HttpUser, task
from random import randint, seed


class ApiLoadtest(HttpUser):
  min_wait = 1000
  max_wait = 1000
  host = 'http://0.0.0.0:8080'

  def on_start(self):
    with open('./viaplay_urls.json') as f:
      self.urls = json.loads(f.read())['viaplay_urls']
      self.urls_len = len(self.urls)
      seed(1)

  @task
  def get_trailers(self):
    movie_idx = randint(0, self.urls_len - 1)
    movie_url = self.urls[movie_idx]
    with self.client.post('/trailers', json={ 'viaplay_url': movie_url }, catch_response=True) as res:
      return res.status_code == 200
