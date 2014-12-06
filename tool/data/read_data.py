import json

data = None
with open('speedtest-export.json') as f:
	data = json.load(f)

individuals = data['individuals']
google = []

for test in individuals.values():
	google_time = test['google']['time']
	google.append(google_time['loadEventEnd'] - google_time['navigationStart'])

print sorted(google)
print sum(google) / len(google)
