# Overnight stays visualized across Switzerland 

## Description
This web Visualization is based on Hotel accommodation databases provided by the [Swiss Federal Statistical Office](https://www.bfs.admin.ch/bfs/en/home/statistics/tourism/tourist-accommodation/hotel-accommodation.html).

![Dashboard view](/prisma/Swiss1.png)


This Visualization is used to show all the overnight stays and their distribution across Switzerland and it's cantons since 2005  until February 2023. A variety of parameters can be displayed using the following Database : 
- The total number of overnight stays across Switzerland from 2005 to February 2023
- The evolution of overnight stays aross Switzerland and per canton from 2005 to February 2023
- The number of overnight stays in a canton for a given timeframe between 2005 and February 2023
- The number of overnight stays for the 100 communes that had the most stays for the chosen timeframe.

## Use 
This project is hosted on a server, reachable by using the following link on any web browser : [Project](https://misenta.ovh/dashboard).

**List of cantons** : The map features a scrollable list of cantons, which is used to visually display the chosen canton and the number of overnight stays by hovering over the map with the mouse. 

**Sliders** : It also features two sliders, which serve to determine the wanted time frame in years and months. Afterwards, the total number of stays for said period will be displayed on the side and the color of the map will change accordingly (the color will darken as the numbers increase). This allows us to see in a blink of an eye the evolution of overnight stays in Swizerland, the different trends, as well as establishing a comparison both geographically and temporally.

## Datasets used
This project uses data from the following datasets: [Overnight stays by 100 communes](https://www.bfs.admin.ch/bfs/en/home/statistics/tourism/tourist-accommodation/hotel-accommodation.assetdetail.27065618.html) and [Overnight stays by canton](https://www.bfs.admin.ch/bfs/en/home/statistics/tourism/tourist-accommodation/hotel-accommodation.assetdetail.24805214.html) 

Every few month, the data regarding the number of people staying overnight in a Hotel in Switzerland are reported and published. The first dataset concerns the stays spent in 100 communes that have the most overnight stays. Meanwhile, the second dataset is much broader and presents the data of stays in the hotel sector by canton since 2005.

For the different coat of arms used in the scrollable list of cantons, these are under public domain.

## Tools used
This work uses the following tools: 
- D3.js : D3.js is a JavaScript library for producing dynamic, interactive data visualizations in web browsers. D3.js allows to breath life in data by making use of HTML and CVG and CSS. The version used is ver.7.8.5. 
- ???

## Hosting 

## Authors
All work presented here was made by Pierre Bühler & Quentin Misenta regading the evaluation for "Visualisation de données", a course taught by the Professor Isaac Pante at the University of Lausanne. This project allowed us to give life to the different datas used, as well as better grasp to the different visualisation possible. 

## Acknowledgements
Mike Bostock for D3 and all the given examples.
Isaac Pante for the classes, ressources and advice.
The JS community for helping eachother.
