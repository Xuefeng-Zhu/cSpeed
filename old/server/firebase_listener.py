from firebasin import Firebase
import json
FIREBASE_URL = "https://speedtest.firebaseio.com/"

fb = Firebase(FIREBASE_URL)
total = {}
count = 0 

def on_child_added(snapshot):
	global total,count
	count += 1
	temp = json.loads(snapshot.val())
	for item in temp:
		total[item["name"]] = (total.get(item["name"], 0) + item["time"])
	total["count"] = count
	fb.child('total').set(total)

fb.child('individuals').on('child_added', on_child_added)
fb.waitForInterrupt()