var dinamycColorsOfStates = [];//Массив для хранения  цветов состояний
var orderOfMDFAInput = 0;

var arrColStates = {};//Объект, у которого ключом яв-ся цвет, а значения состояния
var arrKeyMin = {};
var activeColorToFill;
var arrKeyColDuplicate = {};//Хранит в себе предыдущие параметры arrColStates

var numOfSplits = 1;//Переменная для хранения количеств разбиений

var statesOfMDFA = [];// Массив для ввода пользователем минимального автомата

var isLastSplit = false;//Булева переменная, для хранении информации о последнем разбиении
var confirmLastAction;
var confirmAction;

var DFAstateColors = {};//объект с ключом состояние, а в значениях хранятся цвета переходов по каждому символу

var infotmationHowToMakeP1 = 'Постройте разбиение P1, т.е раскрасьте 1-эквивалентные состояния. Нажмите "Подтвердить", чтобы убедиться, что ваше разбиение верно.';
var infotmationHowToMakeP2 = 'В дальнейшем вам необходимо перекрашивать лишь те состояния, которые образовали отдельный класс. Постройте разбиение P2. Если вы считаете, что текущее разбиение совпадает с предыдущим, то нажмите "Завершить"';
var infoAboutSplitP = 'Внимание! Состояния не перенумеровывайте, а выбирайте по одному из разбиения!';
//var info = 'Обратите внимание: при раскраске состояний, когда наводите курсор мыши на любой цвет — он подсвечивается голубым. Но раскрашено состояние будет в исходный цвет (тот, что до подсветки).'

//Массив цветов для заполнения выпадающего списка
const COLORS = ['#FFFFFF','#FF9999', '#FF0066', '#CC00CC', '#FF9900', '#6699CC', '#CCCC00', '#00CC66', '#FF3300'];
const USING_COLORS = [];
//Хранение автомата в виде ассоциативного массива
const DFA0 = {
	'I/S': ['1', '2', '3', '4', '5', '6', '7', '8'],
	'a': ['7/0', '4/1', '7/0', '2/1', '4/1', '6/1', '8/0', '7/1'],
	'b': ['2/0', '4/1', '2/0', '2/1', '2/1', '7/1', '2/0', '4/1'],
	'c': ['2/1', '1/0', '2/1', '3/0', '7/0', '8/0', '6/1', '3/1']
};
const DFA1 = {
	'I/S': ['1', '2', '3', '4', '5', '6', '7', '8'],
	'a': ['1/0', '1/0', '1/1', '5/1', '5/0', '6/1', '5/0', '8/1'],
	'b': ['6/1', '8/1', '7/0', '2/0', '1/1', '5/0', '2/1', '5/0'],
};
const DFA2 = {
	'I/S': ['1', '2', '3', '4', '5', '6', '7'],
	'a': ['3/0', '4/0', '1/0', '3/0', '4/1', '6/0', '7/0'],
	'b': ['4/1', '6/1', '2/1', '1/1', '1/1', '7/1', '5/1'],
	'c': ['1/1', '6/1', '4/1', '4/1', '7/0', '1/1', '3/1']
};
const DFA3 = {
	'I/S': ['1', '2', '3', '4', '5', '6'],
	'a': ['2/0', '1/1', '1/0', '1/0', '2/1', '1/1',],
	'b': ['3/0', '2/0', '3/0', '5/0', '5/0', '6/0',],
};

let VAlueOfClass = []

// const SET_OF_DFA = [DFA0, DFA1, DFA2, DFA3];
// const RANDOM_DFA_FROM_SET = SET_OF_DFA[Math.floor(Math.random() * SET_OF_DFA.length)];

// const DFAofIntputsOutputs = RANDOM_DFA_FROM_SET;
const DFAofIntputsOutputs = {
	'I/S': ['1', '2', '3', '4'],
	'a': ['3/0', '2/1', '3/0', '2/1'],
	'b': ['2/0', '2/1', '2/0', '2/1']
};

for (let i = 0; i < DFAofIntputsOutputs['I/S'].length; i++) {
	USING_COLORS.push(COLORS[i]);
}

//Копия автомата без выходов
var DFAofInputs = {};
var DFAofOutputs = {};

let oldMDFA = {};
let MDFA = {};
for (const key in DFAofIntputsOutputs) {
	if (Object.hasOwnProperty.call(DFAofIntputsOutputs, key)) {
		if (key == 'I/S') {
			DFAofInputs[key] = [];
			DFAofOutputs[key] = [];
			for (let i = 0; i < DFAofIntputsOutputs[key].length; i++) {
				DFAofInputs[key].push(DFAofIntputsOutputs[key][i]);
				DFAofOutputs[key].push(DFAofIntputsOutputs[key][i]);
			}
		}
		else {
			DFAofInputs[key] = [];
			DFAofOutputs[key] = [];
			for (let i = 0; i < DFAofIntputsOutputs[key].length; i++) {
				DFAofInputs[key].push(DFAofIntputsOutputs[key][i].split('/')[0]);
				DFAofOutputs[key].push(DFAofIntputsOutputs[key][i].split('/')[1]);
			}
		}
	}
}

//Массив, у которого ключом яв-ся состояние автомата, а значения его выходы по каждому символу
var StatesOutputsOfDFA = {};
var StatesTransOfDFA = {};
var StatesTransOfMDFA = {};
for (const key in DFAofIntputsOutputs) {
	if (Object.hasOwnProperty.call(DFAofIntputsOutputs, key)) {
		for (let i = 0; i < DFAofIntputsOutputs[key].length; i++) {
			if ('I/S' == key) {
				StatesOutputsOfDFA[DFAofIntputsOutputs[key][i]] = [];
				StatesTransOfDFA[DFAofIntputsOutputs[key][i]] = [];
			} else {
				StatesOutputsOfDFA[i + 1].push(DFAofIntputsOutputs[key][i].split('/')[1]);
				StatesTransOfDFA[i + 1].push(DFAofIntputsOutputs[key][i]);
			}
		}
	}
}

//Проверка правильности очередного разбиения
function checkingOuts(localArr) {
	let VAlueOfClassLoc = []
	const keys = Object.keys(arrColStates);
	for (const key in arrColStates) {
		if (Object.hasOwnProperty.call(arrColStates, key)) {
			for (let i = 0; i < arrColStates[key].length; i++) {
				if ((i + 1) == arrColStates[key].length) break;
				for (let j = 0; j < localArr[arrColStates[key][i]].length; j++) {
					if (localArr[arrColStates[key][i]][j] != localArr[arrColStates[key][i + 1]][j]) {
						console.log('False', arrColStates[key][i], arrColStates[key][i + 1]);
						return false;
					}
					else {
						console.log('True', arrColStates[key][i], arrColStates[key][i + 1])
					}
				}
			}
			VAlueOfClassLoc.push(arrColStates[key][0])
			//console.log('VAlueOfClassLoc ' + VAlueOfClassLoc)
			//console.log('VAlueOfClass ' + VAlueOfClass)
		}
	}
	if (keys.length > 1 && numOfSplits == 1) {
		for (let i = 0; i < keys.length - 1; i++) {
			for (let j = i + 1; j < keys.length; j++) {
				var Index = 0;
				for (let k = 0; k < localArr[arrColStates[keys[0]][0]].length; k++) {
					if (localArr[arrColStates[keys[i]][0]][k] == localArr[arrColStates[keys[j]][0]][k]) Index++;
				}
				if (Index == localArr[arrColStates[keys[0]][0]].length) {
					console.log('Элементы разного цвета с одинаковыми выходами', arrColStates[keys[i]][0], ' и ', arrColStates[keys[j]][0]);
					return false;
				} else console.log('Нет элементов разного цвета с одинаковыми выходами');

			}

		}
	}
	VAlueOfClass = VAlueOfClassLoc;
	//console.log('VAlueOfClass ' + VAlueOfClass)
	return true;
}

//Проверяем новая раскраска у автомата или нет
function chekingSimilarP() {
	var similarP = true;
	for (const key in arrColStates) {
		if (Object.hasOwnProperty.call(arrColStates, key) && Object.hasOwnProperty.call(arrKeyColDuplicate, key)) {
			if (arrKeyColDuplicate[key].length == arrColStates[key].length)
				for (let i = 0; i < arrColStates[key].length; i++) {
					if (arrKeyColDuplicate[key][i] != arrColStates[key][i]) similarP = false;
				}
			else similarP = false;
		}
		else similarP = false;
	}

	if (similarP == false) {
		arrKeyColDuplicate = {};
		for (const key in arrColStates) {
			if (Object.hasOwnProperty.call(arrColStates, key)) {
				arrKeyColDuplicate[key] = [];
				for (let i = 0; i < arrColStates[key].length; i++) {
					arrKeyColDuplicate[key].push(arrColStates[key][i]);
				}
			}
		}
		return false;
	}
	else {
		return true;
	}
}

//Функция окрашивания ячеек
function colorizing(arr, value, td) {
	for (const key in arr) {
		if (Object.hasOwnProperty.call(arr, key)) {
			for (let i = 0; i < arr[key].length; i++) {
				if (value == arr[key][i]) {
					td.style.backgroundColor = key;
				}

			}

		}
	}
}

//Таблица из двух ячеек, используемая для удобства расположения двух кнопок рядом
function twoButtons() {
	var body = document.getElementsByTagName('body')[0];
	var tbl = document.createElement('table');
	tbl.id = 'tableB' + numOfSplits;
	tbl.className = 'flex';
	var tbdy = document.createElement('tbody');
	var tr = document.createElement('tr');
	tr.className = 'flex';
	var td = document.createElement('td');
	td.className = 'flex';
	createButton(1, td);
	tr.appendChild(td);
	var td = document.createElement('td');
	td.className = 'flex';
	createEndButton(td);
	tr.appendChild(td);
	tbdy.appendChild(tr);
	tbl.appendChild(tbdy);
	body.appendChild(tbl);
}


//Функция вывод образовавшегося разбиения
function writeInfoAboutPsplit(obj) {
	var Pstring = '';
	var div = document.createElement('div');
	div.className = 'Mydiv';
	if (!isLastSplit) {
		Pstring = 'Разбиение P' + numOfSplits + '= {';
	} else {
		Pstring = 'Разбиение P' + '= {';
	}
	let indexKey = 0;
	for (const key in obj) {
		indexKey++;
		if (Object.hasOwnProperty.call(obj, key)) {
			Pstring = Pstring + '{';
			for (let i = 0; i < obj[key].length; i++) {
				Pstring = Pstring + obj[key][i];
				if ((i + 1) != obj[key].length) Pstring = Pstring + ', ';
			}
			Pstring = Pstring + '}';
			if (indexKey != Object.keys(obj).length) Pstring = Pstring + ', ';
		}
	}
	Pstring = Pstring + '}';
	div.innerHTML = Pstring;
	document.body.appendChild(div);
	numOfSplits++;
}

//Кнопка подтверждения
function cofirmtAction(buttonId) {
	getInfoFromMDFAtable();
	
	if (buttonId == 'buttonP' + numOfSplits) {
		if (confirmAction == true) {
			getColorsOfStates();
			fillArrColStates();
			if ((numOfSplits == 1) && (checkingOuts(StatesOutputsOfDFA) == true) && chekingSimilarP() == false) {
				disableButton(buttonId);
				createHrEl();
				writeInfoAboutPsplit(arrColStates);
				informationBlock(infotmationHowToMakeP2);
				createTable(DFAofInputs, arrColStates);
				twoButtons();
				fillAutomColor();

			}
			else if ((numOfSplits > 1) && (checkingOuts(DFAstateColors) == true) && chekingSimilarP() == false) {
				disableButton(buttonId);
				disableButton('EndbuttonP' + numOfSplits);
				disableButton('tableB' + numOfSplits);
				createHrEl();
				writeInfoAboutPsplit(arrColStates);
				informationBlock('Постройте разбиение P' + numOfSplits + '. Если вы считаете, что текущее разбиение совпадает с предыдущим, то нажмите "Завершить"');
				createTable(DFAofInputs, arrColStates);
				twoButtons();
				fillAutomColor();
			}
			else myAlert("Неправильное разбиение");
			return (true);
		} else {
			myAlert("Подождем");
			return (false);
		}
	}
	else if (buttonId == 'beforeLastButton') {
		if (confirmAction == true) {
			if (isCountStatesOfMDFA() == true) {
				isLastSplit = true;
				disableButton(buttonId);
				createHrEl();
				informationBlock('Ориентируясь на финальное разбиение P и исходную таблицу входов-выходов, введите в таблицу минимальную форму исходного автомата:');
				createTable(DFAofIntputsOutputs);
				writeInfoAboutPsplit(arrColStates);
				createEmptyMDFAtable(DFAofIntputsOutputs, Object.keys(arrColStates).length);
				createButton(3, document.body);
			}
			else myAlert("Неправильно введенное количество состояний!");
			return (true);
		}
		else {
			myAlert("Подождем");
			return (false);
		}
	}
	else if (buttonId == 'LastButton') {
		createMDFA();
		if (confirmAction == true) {
			if (/*isStatesOfMDFA() && */isMDFAofDFA() && isSizeMDFA())/*(checkInputStates() == true)*/ {
				disableButton(buttonId);
				createHrEl();
				myAlert("Поздравляем, вы справились!");
				if (!compareObjects(oldMDFA, MDFA)){
					informationBlock('Таблица входов-выходов минимальной формы исходного конечного автомата:');
					createTable(MDFA, arrKeyMin);
				}
				else{
					informationBlock('Таблица входов-выходов минимальной формы исходного конечного автомата, при изначальных обозначениях:');
					createTable(oldMDFA, arrKeyMin);
					informationBlock('Таблица входов-выходов минимальной формы исходного конечного автомата, при ваших введёных обозначениях:');
					createTable(MDFA, arrKeyMin);
				}
			}
			else myAlert("Неправильно построена минимальная форма исходного автомата!");
			return (true);
		}
		else {
			myAlert("Подождем");
			return (false);
		}
	}
}

function compareObjects(obj1, obj2) {
  for (let key in obj1) {
    if (obj1.hasOwnProperty(key) && obj2.hasOwnProperty(key)) {
			for (let index = 0; index < obj1.length; index++) {
				if (obj1[key][index] != obj2[key][index]) {
					return false; // Значения ключей не совпадают
				}
			}
    } else {
      return false; // Ключ отсутствует в одном из объектов
    }
  }
  return true; // Значения всех ключей совпадают
}

//Разделитель блоков
function createHrEl() {
	let hr = document.createElement('hr');
	let style = "border: 0; padding: 5px 0; border-top: 2px solid #737373"
	hr.setAttribute("style", style);
	document.body.appendChild(hr);
}

//Создаем всплывающее окно подтверждения
function createConfirm(buttonId, conformEnd) {
	var divpop = document.createElement('div');
	divpop.className = 'b-popup';

	var divcontent = document.createElement('div');
	divcontent.className = 'b-popup-content';

	divcontent.innerHTML = "Вы подтверждаете операцию?";

	var divbutton = document.createElement('div');
	divbutton.className = 'b-popup_button';
	var button1 = document.createElement('button');
	button1.className = "b_button";
	button1.innerHTML = 'Да';
	button1.onclick = function myconfirm() {
		divpop.style.visibility = 'hidden';
		confirmAction = true;
		if (conformEnd == false) cofirmtAction(buttonId);
		else end(buttonId, numOfSplits);
		return false;
	};
	var button2 = document.createElement('button');
	button2.className = "b_button";
	button2.innerHTML = 'Нет';
	button2.onclick = function myconfirm() {
		divpop.style.visibility = 'hidden';
		confirmAction = false;
		if (conformEnd == false) cofirmtAction(buttonId);
		else end(buttonId, numOfSplits);
		return false;
	};
	divbutton.appendChild(button1);
	divbutton.appendChild(button2);
	divcontent.appendChild(divbutton);
	divpop.appendChild(divcontent);
	document.body.appendChild(divpop);
}

//Кнопка для завершения разбиения автомата
function createEndButton(appendBody) {
	var button = document.createElement('button');
	button.id = 'EndbuttonP' + numOfSplits;
	button.innerHTML = 'Завершить';
	button.className = 'buttonP';
	button.onclick = function () {
		confirmLastAction = true;
		createConfirm(button.id, confirmLastAction)
		return false;
	};
	appendBody.appendChild(button);
}

//Создаем всплывающее окно информации
function myAlert(text) {
	var divpop = document.createElement('div');
	divpop.className = 'b-popup';

	var divcontent = document.createElement('div');
	divcontent.className = 'b-popup-content';

	divcontent.innerHTML = text;

	var divbutton = document.createElement('div');
	divbutton.className = 'b-popup_button';
	var button = document.createElement('button');
	button.className = "b_button";
	button.innerHTML = 'Ок';
	button.onclick = function () {
		divpop.style.visibility = 'hidden';
		return false;
	};
	divbutton.appendChild(button);
	divcontent.appendChild(divbutton);
	divpop.appendChild(divcontent);
	document.body.appendChild(divpop);
}

//Кнопка для подтверждения очередного разбиения
function createButton(last, appendBody) {
	var button = document.createElement('button');
	switch (last) {
		case 1: button.id = 'buttonP' + numOfSplits;
			break;
		case 2: button.id = 'beforeLastButton';
			break;
		case 3: button.id = 'LastButton';
			break;
	}
	button.innerHTML = 'Подтвердить';
	button.className = 'buttonP';
	button.onclick = function () {
		confirmLastAction = false;
		createConfirm(button.id, confirmLastAction);
		return false;
	};
	appendBody.appendChild(button);
}

//Создание таблицы для ввода MDFA
function createEmptyMDFAtable(arrLoc, NumOfStatesMDFA) {
	var body = document.getElementsByTagName('body')[0];
	var tbl = document.createElement('table');
	tbl.className = 'Mytable';
	var tbdy = document.createElement('tbody');
	for (const key in arrLoc) {
		if (Object.hasOwnProperty.call(arrLoc, key)) {
			var tr = document.createElement('tr');
			var td = document.createElement('td');
			td.appendChild(document.createTextNode(key));
			tr.appendChild(td);
			if (key == 'I/S') {
				for (var j = 0; j < NumOfStatesMDFA; j++) {
					var td = document.createElement('td');
					var input = document.createElement('input');
					input.type = "text";
					input.className = 'inputMDFAstates';
					//input.id = 'enterTableCell' + orderOfMDFAInput;
					td.appendChild(input);
					tr.appendChild(td);
					orderOfMDFAInput++;
				}
			}
			else {
				for (var j = 0; j < NumOfStatesMDFA; j++) {
					var td = document.createElement('td');
					var input = document.createElement('input');
					input.type = "text";
					input.className = 'inputMDFAtransition';
					td.appendChild(input);
					td.appendChild(document.createTextNode("/"));
					var input2 = document.createElement('input');
					input2.type = "text";
					input2.className = 'inputMDFAtransition';
					td.appendChild(input2);
					tr.appendChild(td);
					orderOfMDFAInput++;
				}
			}

			tbdy.appendChild(tr);
		}
	}
	tbl.appendChild(tbdy);
	body.appendChild(tbl);
}

//Проверяем размерность MDFA
function isSizeMDFA() {
	if (MDFA['I/S'].length == oldMDFA['I/S'].length) return true;
	else {
		console.log("Размерность несовпадает. Функция прорерки на строке 510")
		return false;
	}
}

function isCountStatesOfMDFA() {
	var countStatesOfMDFA = document.getElementsByClassName('inputP').item(0).value;
	if (countStatesOfMDFA == Object.keys(arrColStates).length) return true;
	else return false;
}

//Получаем значения, введенные в таблицу MDFA
function getInfoFromMDFAtable() {
	StatesTransOfMDFA = {};
	MDFA = {};
	var count = 0;
	var inputStateValues = document.getElementsByClassName('inputMDFAstates');
	var inputTransValues = document.getElementsByClassName('inputMDFAtransition');
	for (let jndex = 0, countOfITV = 0; jndex < inputStateValues.length; jndex++) {
		var ISV = inputStateValues.item(jndex);
		StatesTransOfMDFA[ISV.value] = [];
		for (let index = 0; index < Object.keys(DFAofIntputsOutputs).length - 1; index++, countOfITV += inputStateValues.length * 2) {
			StatesTransOfMDFA[ISV.value][index] =
				inputTransValues.item(countOfITV).value +
				'/' +
				inputTransValues.item(countOfITV + 1).value;
		}
		count += 2;
		countOfITV = count;
	}
	for (const key in DFAofIntputsOutputs) {
		if (Object.hasOwnProperty.call(DFAofIntputsOutputs, key)) {
			MDFA[key] = [];
			if (key == 'I/S') {
				for (let i = 0; i < inputStateValues.length; i++) {
					MDFA[key].push(inputStateValues.item(i).value);
				}
			}
			else {
				for (let trans = 0; trans < StatesTransOfDFA[DFAofIntputsOutputs['I/S'][0]].length; trans++) {
					if (DFAofIntputsOutputs[key][0] == StatesTransOfDFA[DFAofIntputsOutputs['I/S'][0]][trans]) {
						for (let i = 0; i < MDFA['I/S'].length; i++) {
							MDFA[key].push(StatesTransOfMDFA[MDFA['I/S'][i]][trans]);
						}
						break;
					}
				}
			}
		}
	}
}

//Сотритируем состояния array по порядку
function sortMDFA(array) {
	var inputsOfMDFA = [];
	var i = 0;
	for (const key in array) {
		inputsOfMDFA[i] = key;
		i++;
	}
	var locStates = [];
	for (let i = 0; i < array['I/S'].length; i++) {
		locStates[i] = array['I/S'][i];
	}
	var swap;
	quickSort(locStates);
	for (let i = 0; i < locStates.length; i++) {
		for (let j = 0; j < array['I/S'].length; j++) {
			if (locStates[i] == array['I/S'][j]) {
				for (let k = 0; k < inputsOfMDFA.length; k++) {
					swap = array[inputsOfMDFA[k]][i];
					array[inputsOfMDFA[k]][i] = array[inputsOfMDFA[k]][j];
					array[inputsOfMDFA[k]][j] = swap;
				}
				break;
			}
		}

	}
}

function swap(items, firstIndex, secondIndex) {
	const temp = items[firstIndex];
	items[firstIndex] = items[secondIndex];
	items[secondIndex] = temp;
}
function partition(items, left, right) {
	var pivot = items[Math.floor((right + left) / 2)],
		i = left,
		j = right;
	while (i <= j) {
		while (items[i] < pivot) {
			i++;
		}
		while (items[j] > pivot) {
			j--;
		}
		if (i <= j) {
			swap(items, i, j);
			i++;
			j--;
		}
	}
	return i;
}

function quickSort(items, left, right) {
	var index;
	if (items.length > 1) {
		left = typeof left != "number" ? 0 : left;
		right = typeof right != "number" ? items.length - 1 : right;
		index = partition(items, left, right);
		if (left < index - 1) {
			quickSort(items, left, index - 1);
		}
		if (index < right) {
			quickSort(items, index, right);
		}
	}
	return items;
}

// Проверяем состояния введеные в таблицу
function isStatesOfMDFA() {
	statesOfMDFA = [];
	var inputStateValues = document.getElementsByClassName('inputMDFAstates');
	var inputStateValues = [];
	for (let index = 0; index < inputStateValues.length; index++) {
		inputStates.push(index)
		console.log(inputStateValues.item(index).value)
	}
	for (let index = 0; index < inputStateValues.length; index++) {
		statesOfMDFA[index] = inputStateValues.item(index).value;
	}
	if (statesOfMDFA.length == Object.keys(arrColStates).length) {
		var countOfMDFAstates = 0;
		for (const key in arrColStates) {
			var countStatesOfClass = 0; //Переменная для проверки, взято из класса одно состояние или больше
			if (Object.hasOwnProperty.call(arrColStates, key)) {
				for (let i = 0; i < arrColStates[key].length; i++) {
					for (let j = 0; j < statesOfMDFA.length; j++) {
						if (statesOfMDFA[j] == arrColStates[key][i]) {
							countStatesOfClass++
							countOfMDFAstates++;
						};
						if (countStatesOfClass > 1) {
							return false;
						}
					}

				}
			}
			console.log('It\'s all good')
		}
		if (countOfMDFAstates == statesOfMDFA.length)
			return true;
	}
	else return false;
}

function generatePermutations(array) {
  const permutations = [];

  function permute(arr, start = 0) {
    if (start === arr.length - 1) {
      permutations.push([...arr]); // Добавляем перестановку в массив
      return;
    }

    for (let i = start; i < arr.length; i++) {
      [arr[start], arr[i]] = [arr[i], arr[start]]; // Меняем местами элементы
      permute(arr, start + 1); // Рекурсивно генерируем следующую перестановку
      [arr[start], arr[i]] = [arr[i], arr[start]]; // Восстанавливаем исходный порядок элементов
    }
  }

  permute(array);
  return permutations;
}


let MDFAcopy = {}
// Проверяем переходы по состояниям введеные в таблицу oldMDFA
function isMDFAofDFA() {
	const strArray = VAlueOfClass.map((num) => String(num));
	const allPermutations = generatePermutations(strArray);

	// Пример прохода по всем перестановкам
	for (let i = 0; i < allPermutations.length; i++) {
		
		MDFAcopy = JSON.parse(JSON.stringify(MDFA));
		console.log(MDFAcopy)
		const permutation = allPermutations[i];
		//console.log(permutation);
		if (permutation.length == MDFAcopy['I/S'].length){
			for (let index = 0; index < MDFAcopy['I/S'].length; index++) {
				MDFAcopy['I/S'][index] = permutation[index];
			}
			for (const key in MDFA) {
				MDFAcopy
				if (Object.hasOwnProperty.call(MDFA, key)) {
					for (let index = 0; index < MDFA[key].length; index++) {
							if ('I/S' == key) continue
							else{
								for (let jindex = 0; jindex < MDFA['I/S'].length; jindex++) {
									if(MDFAcopy[key][index].split('/')[0] == MDFA['I/S'][jindex]){
										MDFAcopy[key][index] = MDFAcopy['I/S'][jindex]+'/'+MDFAcopy[key][index].split('/')[1];
										break;
									}
								}
								
						}
					}
					
				}
			}
		}
		sortMDFA(MDFAcopy);
		if (compareObjects(oldMDFA, MDFAcopy)) return true
	}
	return false;
}

//Атоматическое создание MDFA
function createMDFA() {
	numOfSplits--;
	var inputStateValues = VAlueOfClass
	//console.log(inputStateValues)
	//Происходит дублирование по одному состоянию из каждого класса (строится минимальный автомат)
	for (const key in DFAofIntputsOutputs) {
		oldMDFA[key] = [];
		if (Object.hasOwnProperty.call(DFAofIntputsOutputs, key)) {
			for (let i = 0; i < DFAofIntputsOutputs[key].length; i++) {
				for (let j = 0; j < inputStateValues.length; j++) {
					if ((key != 'I/S') && (DFAofIntputsOutputs['I/S'][i] == inputStateValues[j]))
						oldMDFA[key].push(DFAofIntputsOutputs[key][i]);
					else if (DFAofIntputsOutputs['I/S'][i] == inputStateValues[j])
						oldMDFA[key].push(DFAofIntputsOutputs[key][i]);
				}

			}
		}
	}

	//Переписывается объект с ключом цвет и значениям состояний минимального автомата, переименовываются состояния из одного класса
	for (const key1 in arrColStates) {
		if (Object.hasOwnProperty.call(arrColStates, key1)) {
			if (arrColStates[key1].length > 1) {
				arrKeyMin[key1] = [];
				for (var j = 0; j < arrColStates[key1].length; j++) {
					for (let index = 0; index < inputStateValues.length; index++) {
						if (inputStateValues[index] == arrColStates[key1][j]) {
							for (var p = 0; p < arrColStates[key1].length; p++)
								if (inputStateValues[index] != arrColStates[key1][p]) {
									for (const key2 in oldMDFA) {
										if (Object.hasOwnProperty.call(oldMDFA, key2)) {
											for (let k = 0; k < oldMDFA[key2].length; k++) {
												if ((key2 != 'I/S') && (arrColStates[key1][p] == oldMDFA[key2][k].split('/')[0]))
													oldMDFA[key2][k] = inputStateValues[index] + '/' + oldMDFA[key2][k].split('/')[1];
											}
										}
									}
								}
							arrKeyMin[key1].push(arrColStates[key1][j]);
						}
					}
				}
			}
			else {
				arrKeyMin[key1] = [];
				arrKeyMin[key1].push(arrColStates[key1][0]);
			}
		}
	}
}

//Функция создания таблицы
function createTable(arrLoc, arrKeyLoc) {
	var body = document.getElementsByTagName('body')[0];
	var tbl = document.createElement('table');
	tbl.className = 'Mytable';
	var tbdy = document.createElement('tbody');
	for (const key in arrLoc) {
		if (Object.hasOwnProperty.call(arrLoc, key)) {
			var tr = document.createElement('tr');
			var td = document.createElement('td');
			td.appendChild(document.createTextNode(key));
			tr.appendChild(td);
			for (var j = 0; j < arrLoc[key].length; j++) {
				var td = document.createElement('td');
				if (isLastSplit != true) colorizing(arrKeyLoc, arrLoc[key][j], td);
				td.appendChild(document.createTextNode(arrLoc[key][j]));
				if (key == 'I/S' && isLastSplit != true) {
					//createSelect(td, arrLoc[key][j]);          
					td.className = 'tdColor' + numOfSplits;
					td.addEventListener("click", function () {
						this.style.backgroundColor = activeColorToFill;
					});
				}
				tr.appendChild(td);
			}
			tbdy.appendChild(tr);
		}
	}
	tbl.appendChild(tbdy);
	body.appendChild(tbl);
}

//Отключение кнопок, с которыми пользователь уже взаимодействовал
function disableButton(buttonId) {
	var elem = document.getElementById(buttonId);
	elem.style.visibility = 'hidden';
	elem.style.display = 'none';
}

// Создаем объект, у которого ключом является состояние, а в значениях хранятс цвета переходов по каждому символу
function fillAutomColor() {
	DFAstateColors = {};
	for (const key in DFAofInputs) {
		if (Object.hasOwnProperty.call(DFAofInputs, key)) {
			for (let i = 0; i < DFAofInputs[key].length; i++) {
				if ('I/S' == key) {
					DFAstateColors[DFAofInputs[key][i]] = [];
				} else {
					DFAstateColors[i + 1].push(dinamycColorsOfStates[DFAofInputs[key][i] - 1]);
				}
			}
		}
	}
}

//Создание ассоциативного массива с ключом цвет
function fillArrColStates() {
	arrColStates = {};
	for (let i = 0; i < dinamycColorsOfStates.length; i++) {
		if (!(dinamycColorsOfStates[i] in arrColStates)) {
			arrColStates[dinamycColorsOfStates[i]] = [];
			arrColStates[dinamycColorsOfStates[i]].push(i + 1);

		} else {
			arrColStates[dinamycColorsOfStates[i]].push(i + 1);
		}
	}
}

//Заполнение массива цветами, которыми пользователь окрасил состояния
function getColorsOfStates() {
	dinamycColorsOfStates = [];
	for (var i = 0; i < USING_COLORS.length; i++) {
		dinamycColorsOfStates.push(document.getElementsByClassName('tdColor' + numOfSplits)[i].style.backgroundColor);
	}
}

// Вывод блока и необходимой информацией
function informationBlock(informationString) {
	var div = document.createElement('div');
	div.className = 'informationBlock';
	//if (isLastSplit) div.style.textAlign = 'center';
	div.innerHTML = informationString;
	div.style.display = 'block';
	document.body.appendChild(div);
}
function importantInfoAboutSplitP(informationString) {
	var div = document.createElement('div');
	div.className = 'infoAboutSplitP';
	//if (isLastSplit) div.style.textAlign = 'center';
	div.innerHTML = informationString;
	div.style.display = 'block';
	document.body.appendChild(div);
}

//Функция, которая вызывается при загрузке сайта
function start() {
	sideNav(USING_COLORS.length);
	informationBlock(infotmationHowToMakeP1);
	createTable(DFAofIntputsOutputs);
	createButton(1, document.body);
}

// Боковая панель цветов
function sideNav(count) {
	var div = document.createElement('div');
	div.className = 'sidenav';
	for (let index = 0; index < count; index++) {
		colorBlock(div, index);
	}
	document.body.appendChild(div);
}

// цветовой блок
function colorBlock(div, index) {
	var colorBlock = document.createElement('div');
	colorBlock.className = 'ColorBox';
	colorBlock.style.backgroundColor = USING_COLORS[index];
	colorBlock.style.display
	div.appendChild(colorBlock);
	colorBlock.addEventListener("click", function () {
		activeColorToFill = this.style.backgroundColor;
		for (let i = 0; i < USING_COLORS.length; i++) {
			document.getElementsByClassName('ColorBox')[i].style.border = 'none';
		}
		this.style.border = "5px solid #00003e";
	});
}

//Создание поля для ввода состояний минимального автомата
function enterNumOfStatesMDFA() {
	var input = document.createElement('input');
	input.type = "number";
	input.id = 'inputP' + numOfSplits;
	input.className = 'inputP';
	document.body.appendChild(input);
}

//Функция, которая вызывается при нажатии на кнопку "Завершить"
function end(EndbuttonId, numOfSplits) {
	if (confirmAction == true) {
		if (EndbuttonId == 'EndbuttonP' + numOfSplits) {
			if (checkingOuts(DFAstateColors) == true) {
				disableButton('buttonP' + numOfSplits);
				disableButton('tableB' + numOfSplits);
				disableButton(EndbuttonId);
				informationBlock('Введите количество состояний минимальной формы исходного автомата:');
				enterNumOfStatesMDFA();
				createButton(2, document.body);
			}
			else myAlert("Вы построили не все разбиения!");
		}
		else myAlert("Вы построили не все разбиения!");
		return (true);
	} else {
		myAlert("Подождем");
		return (false);
	}
}