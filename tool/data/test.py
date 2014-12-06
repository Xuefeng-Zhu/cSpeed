import json

data = None
with open('speedtest-export.json') as f:
	data = json.load(f)

individuals = data['individuals']
result = []

for test in individuals.values():
	print json.dumps(test.keys())
	break
