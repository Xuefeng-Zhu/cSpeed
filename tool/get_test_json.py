if __name__ == '__main__':
	f = open("list sites.txt")
	for i in f:
		print {"name": i.split('.')[1].capitalize(),
				"link": i.strip('\n')} , ","