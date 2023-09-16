import gnews

articles = gnews.GNews(period='7d', max_results=100).get_top_news()
print(articles[-1])
# articles[-20:-10]