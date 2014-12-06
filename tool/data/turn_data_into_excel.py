# This scrip will turn firebase json onject into csv file. 
# It will print out key id of test, which has some issues 
# Author: Xuefeng Zhu
# Date: Dec. 6th, 2014 

import json
import csv

fieldnames = ["city" ,"adcash", "stumbleupon", "google", "adobe", "instagram", "netflix", "outbrain", "vimeo", "mozilla", "salesforce", "addthis", "mailchimp", "adf", "godaddy", "wordpress", "coccoc", "hostgator", "microsoft", "badoo", "wikipedia", "total", "hadTimeouts", "isp"]

def process_test(key, test, writer):
	timeout_flag = False 
	total_time = 0
	data_row = {}
	for field in fieldnames:
		if field == "city":
			try:
				data_row[field] = test["user_info"]["ip"]["city"]
			except:
				print key
		elif field == "total":
			data_row[field] = total_time
		elif field == "hadTimeouts":
			data_row[field] = timeout_flag
		elif field == "isp":
			try:
				data_row[field] = test["user_info"]["ip"]["isp"]
			except:
				print key
		else:
			time_data = test[field]["time"]
			if time_data.get("status") == "timeout":
				timeout_flag = True
			load_time = time_data['loadEventEnd'] - time_data['navigationStart']
			data_row[field] = load_time
			total_time += load_time
	writer.writerow(data_row)


if __name__ == '__main__':
	with open('speedtest-export.json') as f:
		data = json.load(f)
	
	with open('data_matrix.csv', 'w') as f:
		writer = csv.DictWriter(f, fieldnames)

		individuals = data['individuals']
		for (key, test) in individuals.items():
			process_test(key, test, writer)