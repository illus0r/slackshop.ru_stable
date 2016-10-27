//Задаем глобальные переменные
var objectData = [], // содержимое файла настроек
currentObjectsLeft = [], // какие объекты остались после каждой недели
souredObjects = [], // какие объекты испортились
subTotalCalorie = 0, // на сколько калорий накупили за неделю
eatingCalorie = 0, // счетчик, сколько нужно убрать, чтобы получилось 12600
purchaseSum = 0, // на сколько рублей закупили за неделю и всего
souredSum = 0, // на сколько рублей пропало всего
currentSouredSum = 0, // на сколько рублей пропало за неделю
saturation = 0, // сытость
currentWeek = 1, // текущая неделя
totalWeeks = 4, // всего недель в игре
badNutrition = 0; // сколько раз Глаша плохо питалась

var allMoney = 22000 + 100 * Math.floor((Math.random() * 30) + 1); // выдаем деньги на игру. От 22 до 25 тысяч рублей
var currentMoney = allMoney;

// Парсим файл настроек
var xmlhttp = new XMLHttpRequest();
var url = "js/data.json";

xmlhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
        objectData = JSON.parse(this.responseText);
        loadingContent(objectData);
    }
};
xmlhttp.open("GET", url, true);
xmlhttp.send();

$('#first-screen-button').click(function(){
	$('.first-screen').hide();
	$('#game-field').show();
});

$('.result-screen-button').click(function(){
	$('input[name= "quantity"]').val("0");
	$('.first-screen').show();
	$('.game-results-screen, .game-results-screen [id^="game-result-"]').hide();
	$('#saturation__scale').empty();
	currentWeek = 1;
	currentObjectsLeft = [];
	souredObjects = [];
	subTotalCalorie = 0;
	eatingCalorie = 0;
	purchaseSum = 0;
	souredSum = 0;
	currentMoney = allMoney;
	badNutrition = 0;
	currentSouredSum = 0;
	saturation = 0;
	$('#current-week-id').html(currentWeek);
	$('.current__loss-id').html(String(currentSouredSum).replace(/(\d)(?=(\d{3})+([^\d]|$))/g, '$1 '));
	$('.total__loss-id').html(String(souredSum).replace(/(\d)(?=(\d{3})+([^\d]|$))/g, '$1 '));
	$('.current__money #current__money-id').html(String(currentMoney).replace(/(\d)(?=(\d{3})+([^\d]|$))/g, '$1 '));
});

$('.subtotal-result-screen-button').click(function(){

	currentWeek++;
	$('input[name= "quantity"]').val("0");
	$('#current-week-id').html(currentWeek);
	$('#saturation__scale').empty();
	$('.game-results-screen, .game-results-screen [id^="game-result-"], .result-screen-footer').hide();
	$('#game-field, .choose-field, .game-bottom-panel, #play-button').show();
	//$('.current-loss').css('visibility', 'visible');
	souredObjects = [];
	eatingCalorie = 0;
	subTotalCalorie = 0;
	currentSouredSum = 0;
	saturation = 0;
});

function showObject(obj, whereToShow, nth) { // вывод каждого объекта
	//$(whereToShow).append('<div class="object-field ' + nth + '"><div class="object-price">' + obj.price + ' ' + '<span>&#8381;</span></div></div>');	
	$(whereToShow).append('<div class="object-field ' + nth + '"><div class="object-image"><img src="' + obj.image + '"></div></div>');
	$(whereToShow + ' .object-field.' + nth).append('<div class="object-quantity">' + obj.quantity + '<span> шт.</span></div>');
}

// Загружаем контент из файла на первую страницу
function loadingContent(objectData) {
	var counter = 0;
	$('.object-field').each(function() {
		var $currentObject = $(this);
		$currentObject.children('.object-price').html(objectData[0][counter].price + ' ' + '<span>&#8381;</span>');
		$currentObject.children('.object-image').html('<img src="' + objectData[0][counter].image + '">');
		$currentObject.find('input').attr("data-name", objectData[0][counter].name);
		counter++;
	});

	$('.current-week #current-week-id').html(currentWeek);
	$('.current__loss-id').html(String(currentSouredSum).replace(/(\d)(?=(\d{3})+([^\d]|$))/g, '$1 '));
	$('.total__loss-id').html(String(souredSum).replace(/(\d)(?=(\d{3})+([^\d]|$))/g, '$1 '));
	$('.current__money #current__money-id').html(String(currentMoney).replace(/(\d)(?=(\d{3})+([^\d]|$))/g, '$1 '));
}

// Поиск нужного объекта по имени в файле данных или в другом наборе объектов
function findTheObject (set, prop) {
	for (var i = 0; i < set.length; i++) {
		if (set[i].name == prop) {
			return set[i];
		}
	}
}

// Обрабатываем кнопки ввода количества
$('.input-group-button').click(function () {
	var $buttonPressed = $(this); // текущая нажатая кнопка
	var $inputQty = $buttonPressed.siblings('input'); // инпут количества
	var whatObject = $inputQty.attr('data-name');
	var whatCurrentObject = findTheObject(objectData[0], whatObject);
	
	if ( $buttonPressed.hasClass('inc') ) {
		$inputQty.val(function (n, oldval) {
    		return parseInt( oldval, 10) + 1;
		});
		currentMoney -= whatCurrentObject.price;
		saturation += whatCurrentObject.saturation;
		if (saturation <= 32) {
			for (var s = 0; s < whatCurrentObject.saturation; s++) {
				$('#saturation__scale').append('<img src="img/interface/scale-division.png">');
			}
		} else {
			for (var s = 0; s <= (32 - saturation + whatCurrentObject.saturation); s++) {
				$('#saturation__scale').append('<img src="img/interface/scale-division.png">');
			}
		}

		console.log(saturation);	
	} else {
		$inputQty.val(function (n, oldval) {
    		if (parseInt( oldval, 10) - 1 < 0) {
    			return parseInt( oldval, 10);
    		} else {
    			currentMoney += whatCurrentObject.price;
    			saturation -= whatCurrentObject.saturation;
    			if ( saturation <= 32) {
    				$('#saturation__scale').empty();
    				for (var s = 0; s < saturation; s++) {
    					$('#saturation__scale').append('<img src="img/interface/scale-division.png">');
						//$('#saturation__scale img').last().remove();
					}	
    			}
    			return parseInt( oldval, 10) - 1;
    		}
		});
		console.log(saturation);
	}
	$('.current__money #current__money-id').html(String(currentMoney).replace(/(\d)(?=(\d{3})+([^\d]|$))/g, '$1 '));
});

// Обрабатываем покупки
function play () {	
	if (currentWeek == 1) {
		$('.choose-field h2').html('В&nbsp;районе закрылись все магазины,<br />кроме «Магнита». Пора закупиться');
	}
	if (currentWeek == 2) {
		$('.choose-field h2').html('Хочу новые очки. Если в&nbsp;конце недели<br /> ничего не&nbsp;пропадёт&nbsp;&mdash; куплю&nbsp;их!');
	}
	if (currentWeek == 3) {
		$('.choose-field h2').html('Уже конец месяца. Закупитесь на&nbsp;неделю и&nbsp;узнайте результат игры');
	}			

	var whichObject = '';
	$('input[name= "quantity"]').each(function(){ //проверяем каждый инпут
		var $currentInput = $(this);
		var currentQuantity = parseInt($currentInput.val(), 10);
		if ( currentQuantity > 0) { // если количество объекта больше нуля
			whichObject = $currentInput.attr('data-name');
			var matchingObject = findTheObject(currentObjectsLeft, whichObject);
			if ( matchingObject ) {
				//purchaseSum += (matchingObject.price * currentQuantity);
				matchingObject.quantity += currentQuantity;
			} else {
				currentObjectsLeft.push( findTheObject(objectData[0], whichObject) );
				//purchaseSum += (findTheObject(objectData[0], whichObject).price * currentQuantity);
				currentObjectsLeft[currentObjectsLeft.length-1].quantity = currentQuantity;
			}
			//currentMoney = allMoney - purchaseSum;	
		} 
	});

	// Считаем калории имеющихся продуктов
	for (var n = 0; n < currentObjectsLeft.length; n++) {
		subTotalCalorie += (currentObjectsLeft[n].calorie * currentObjectsLeft[n].quantity);
	}

	// Убираем съеденные продукты
	if (subTotalCalorie <= 12600) {
		currentObjectsLeft = []; //игрок все съел, ничего не осталось
	} else {
		while (eatingCalorie < 12600) { // игрок съедает на 12600 ккал
			for (var n = 0; n < currentObjectsLeft.length; n++) {
				if (currentObjectsLeft[n].quantity > 0) {
					eatingCalorie += currentObjectsLeft[n].calorie;
					currentObjectsLeft[n].quantity -= 1;
				} 
				if (eatingCalorie >= 12600) { break; }	
			}
		}
	}

	// Убираем нулевые остатки
	var m = currentObjectsLeft.length;
	while (m--) {
		if (currentObjectsLeft[m].quantity < 1) {
			currentObjectsLeft.splice(m, 1);
		}
	}	

	// Убираем пропашвие продукты.
	var n = currentObjectsLeft.length;
	while (n--) {
		if (currentObjectsLeft[n].expiration <= 7) {
			souredObjects.push(currentObjectsLeft[n]);
			currentSouredSum += (currentObjectsLeft[n].price * currentObjectsLeft[n].quantity);
			currentObjectsLeft.splice(n, 1);
		}
	}
	souredSum += currentSouredSum;

	// Показываем все, что осталось и все, что пропало
	$('.objects-left .all-objects-field, .objects-soured .all-objects-field').empty();
	for (var i = 0; i < currentObjectsLeft.length; i++) {
		showObject(currentObjectsLeft[i], ".objects-left .all-objects-field", i); 
	}

	for (var j = 0; j < souredObjects.length; j++) {
		showObject(souredObjects[j], ".objects-soured .all-objects-field", j);
		//souredSum += (souredObjects[i].price * souredObjects[i].quantity);
	}

	if (currentWeek < totalWeeks) { // если не последняя неделя
		//$('.choose-field, #play-button').hide();
		if ( subTotalCalorie < 12600 ) { // если купили недостаточно еды и это не предпоследняя неделя
			$('#game-field, .result-screen-footer').hide();
			$('.game-results-screen, .game-results-screen #game-result-07').show();
			badNutrition++;
		} else if (currentSouredSum <= 0) {
			$('#game-field, .result-screen-footer').hide();
			$('.game-results-screen, .game-results-screen #game-result-08').show();
		} else {
			$('.current__loss-id').html(String(currentSouredSum).replace(/(\d)(?=(\d{3})+([^\d]|$))/g, '$1 '));
			$('.total__loss-id').html(String(souredSum).replace(/(\d)(?=(\d{3})+([^\d]|$))/g, '$1 '));
			$('.subtotal-field').show();
			$('#next-week-button').css('visibility', 'visible');
			//$('.current-loss').css('visibility', 'visible');
			$('.choose-field, #play-button').hide();
		}
		$('.current__money #current__money-id').html(String(currentMoney).replace(/(\d)(?=(\d{3})+([^\d]|$))/g, '$1 '));
		$('#saturation__scale').empty();
		saturation = 0;
	} else { // конец игры
		purchaseSum = allMoney - currentMoney;
		$('.total-spend p span:first-child').html(purchaseSum);
		$('.total-loss p span:first-child').html(souredSum);
		$('#game-field').hide();
		if ( subTotalCalorie < 12600 ) { // если плохо питались в последнюю неделю
			badNutrition++;
		}
		console.log(souredSum/purchaseSum);
		if (badNutrition >= 3) {
			$('.game-results-screen, .game-results-screen #game-result-06').show();
		} else {
			if ( (souredSum/purchaseSum > 0.5) ) {
				$('.game-results-screen, .game-results-screen #game-result-01').show();			
			} else {
				if ( (souredSum/purchaseSum > 0.15) && (souredSum/purchaseSum < 0.5) ) {
					$('.game-results-screen, .game-results-screen #game-result-03').show();	
				} else {
					if ( (souredSum/purchaseSum > 0.1) && (souredSum/purchaseSum <= 0.15) ) {
						$('.game-results-screen, .game-results-screen #game-result-05').show();	
					} else { 
						if ( souredSum/purchaseSum == 0.5 ) {
							$('.game-results-screen, .game-results-screen #game-result-02').show();	
						} else {
							$('.game-results-screen, .game-results-screen #game-result-04').show();	
						}	
					} 
				}
			}
		}
		$('.result-screen-footer').show();
	}
}

// Обрабатываем покупки
function playNext () {

	currentWeek++;
	$('input[name= "quantity"]').val("0");

	$('#current-week-id').html(currentWeek);
	$('.subtotal-field').hide();
	$('#next-week-button').css('visibility', 'hidden');
	$('.choose-field, #play-button').show();
	$('#saturation__scale').empty();
	souredObjects = [];
	eatingCalorie = 0;
	subTotalCalorie = 0;
	currentSouredSum = 0;
	saturation = 0;
}