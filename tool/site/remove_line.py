if __name__ == '__main__':
	f = open("list sites.txt")
	lines = f.readlines()
	lines.sort()
	for i in lines:
		if len(i)>1:
			print i,