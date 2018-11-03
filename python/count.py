import csv


for i in range(2014,2019):
	count = {}
	fw = open('./project/data/' + str(i) + '.csv', 'r')
	data = list(csv.reader(fw, delimiter = ','))
	

	for item in data[1:]:
		if item[1] in count:
			count[item[1]]['issue']+=1
			count[item[1]]['killed']+=item[4]
			count[item[1]]['injured']+=item[5]
		else:
			count[item[1]]=1
			count[item[1]]['killed']=item[4]
			count[item[1]]['injured']=item[5]

	fw.close()
	fw1 = open('./project/data/count_' + str(i) + ".csv", 'w')
	fw1.write('name,issue,killed,injured\n')
	for key in count:
		fw1.write(key + ',' + str(count[key]['issue']) + ',' + str(count[key]['killed']) + ',' + str(count[key]['injured']) + '\n')
	fw1.close()