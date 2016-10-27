//Задаем глобальные переменные
var objectData = [], // содержимое файла настроек
currentObjectsLeft = [], // какие объекты остались после каждой недели
souredObjects = [], // какие объекты испортились
subTotalCalorie = 0, // на сколько калорий накупили за неделю
saturationStatusWidth = '0%', // текущий статус сытости в процентах
calorieNorm = 12600, // норма сытости в ккал
eatingCalorie = 0, // счетчик, сколько продуктов нужно убрать, чтобы получилось 12600
purchaseSum = 0, // на сколько рублей закупили за неделю и всего
souredSum = 0, // на сколько рублей пропало всего
currentSouredSum = 0, // на сколько рублей пропало за неделю
goalPrice = 20000, // сколько нужно накопить на цель
saturation = 0, // сытость
currentWeek = 1, // текущая неделя
totalWeeks = 4, // всего недель в игре
badNutrition = 0; // сколько раз Глаша плохо питалась

var allMoney = 22000 + 100 * Math.floor((Math.random() * 30) + 1); // выдаем деньги на игру. От 22 до 25 тысяч рублей
var currentMoney = allMoney;
$('#glasha__salary').html(String(allMoney).replace(/(\d)(?=(\d{3})+([^\d]|$))/g, '$1 '));
$('.goal__money #goal__money-id').html(String(currentMoney - goalPrice).replace(/(\d)(?=(\d{3})+([^\d]|$))/g, '$1 '));

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

$('.result-screen-button').click(function(){ // если решили сыграть еще раз
	$('input[name= "quantity"]').val("0");
	allMoney = 22000 + 100 * Math.floor((Math.random() * 30) + 1);
	currentMoney = allMoney;
	$('#glasha__salary').html(String(allMoney).replace(/(\d)(?=(\d{3})+([^\d]|$))/g, '$1 '));
	$('.first-screen').show();
	$('.game-results-screen, .game-results-screen [id^="game-result-"]').hide();
	currentWeek = 1;
	currentObjectsLeft = [];
	souredObjects = [];
	subTotalCalorie = 0;
	eatingCalorie = 0;
	purchaseSum = 0;
	souredSum = 0;
	badNutrition = 0;
	currentSouredSum = 0;
	saturation = 0;
	saturationStatusWidth = '0%';
	$("#saturation__status").css({width: saturationStatusWidth});
	$('#current-week-id').html(currentWeek);
	$('.current__loss-id').html(String(currentSouredSum).replace(/(\d)(?=(\d{3})+([^\d]|$))/g, '$1 '));
	$('.total__loss-id').html(String(souredSum).replace(/(\d)(?=(\d{3})+([^\d]|$))/g, '$1 '));
	$('.current__money #current__money-id').html(String(currentMoney).replace(/(\d)(?=(\d{3})+([^\d]|$))/g, '$1 '));
	$('.goal__money .green__text').removeClass('red__text');
	$('.goal__money #goal__money-id').html(String(currentMoney - goalPrice).replace(/(\d)(?=(\d{3})+([^\d]|$))/g, '$1 '));
});

$('.subtotal-result-screen-button').click(function(){

	currentWeek++;
	$('input[name= "quantity"]').val("0");
	$('#current-week-id').html(currentWeek);
	$('.game-results-screen, .game-results-screen [id^="game-result-"], .result-screen-footer').hide();
	$('#game-field, .choose-field, .game-bottom-panel, #play-button').show();
	souredObjects = [];
	eatingCalorie = 0;
	subTotalCalorie = 0;
	currentSouredSum = 0;
	saturation = 0;
	saturationStatusWidth = '0%';
	$("#saturation__status").css({width: saturationStatusWidth});
});

// Функция для вывода оставшихся объектов в нужном месте
function showObject(obj, whereToShow, imagePath, dataName, nth) {
	$(whereToShow).append('<div class="object-field ' + nth + '"><div class="object-image"><img src="' + imagePath + '"></div></div>');
	$(whereToShow + ' .object-field.' + nth).append('<div class="object-quantity">' + obj.quantity + '<span> шт.</span></div>');
	$(whereToShow + ' .object-field.' + nth).attr("data-name", dataName);
}

// Загружаем контент из файла на первую страницу
function loadingContent(objectData) {
	var counter = 0;
	$('.object-field').each(function() {
		var $currentObject = $(this);
		$currentObject.children('.object-price').html(objectData[0][counter].price + ' ' + '<span>&#8381;</span>');
		$currentObject.children('.object-image').html('<img src="' + objectData[0][counter].imageNormal + '">');
		$currentObject.find('input').attr("data-name", objectData[0][counter].name);
		counter++;
	});

	$('.current-week #current-week-id').html(currentWeek);
	$('.current__loss-id').html(String(currentSouredSum).replace(/(\d)(?=(\d{3})+([^\d]|$))/g, '$1 '));
	//$('.total__loss-id').html(String(souredSum).replace(/(\d)(?=(\d{3})+([^\d]|$))/g, '$1 '));
	$('.goal__money #goal__money-id').html(String(currentMoney - goalPrice).replace(/(\d)(?=(\d{3})+([^\d]|$))/g, '$1 '));
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
		saturation += whatCurrentObject.calorie;
		if (saturation <= calorieNorm) {
			saturationStatusWidth = saturation/calorieNorm*100 + '%'; 
		} else {
			saturationStatusWidth = 100 + '%'; 
		}	
	} else {
		$inputQty.val(function (n, oldval) {
    		if (parseInt( oldval, 10) - 1 < 0) {
    			return parseInt( oldval, 10);
    		} else {
    			currentMoney += whatCurrentObject.price;
    			saturation -= whatCurrentObject.calorie;
    			if ( saturation <= calorieNorm) {
					saturationStatusWidth = saturation/calorieNorm*100 + '%'; 
    			}
    			return parseInt( oldval, 10) - 1;
    		}
		});
	}
	if ( (currentMoney - goalPrice) < 0 ) {
		$('.goal__money .green__text').addClass('red__text');
	} else {
		$('.goal__money .green__text').removeClass('red__text');
	}
	//console.log(saturation);
	$("#saturation__status").animate({width: saturationStatusWidth}, {duration: 200, easing: "linear"});
	$('.current__money #current__money-id').html(String(currentMoney).replace(/(\d)(?=(\d{3})+([^\d]|$))/g, '$1 '));
	$('.goal__money #goal__money-id').html(String(currentMoney - goalPrice).replace(/(\d)(?=(\d{3})+([^\d]|$))/g, '$1 '));
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
				matchingObject.quantity += currentQuantity;
			} else {
				currentObjectsLeft.push( findTheObject(objectData[0], whichObject) );
				currentObjectsLeft[currentObjectsLeft.length-1].quantity = currentQuantity;
			}	
		} 
	});
	subTotalCalorie = saturation;

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

	if ( subTotalCalorie < 12600 ) { // если плохо питалась
		badNutrition++;
	} 

	// Убираем нулевые остатки
	var m = currentObjectsLeft.length;
	while (m--) {
		if ( currentObjectsLeft[m].quantity < 1 ) {
			currentObjectsLeft.splice(m, 1);
		}
	}	

	// Показываем все, что осталось и все, что пропало
	$('.objects-left .all-objects-field, .objects-soured .all-objects-field').empty();
	for ( var i = 0; i < currentObjectsLeft.length; i++ ) {
		if ( currentObjectsLeft[i].expiration <= 7 ) {
			currentSouredSum += (currentObjectsLeft[i].price * currentObjectsLeft[i].quantity);
			currentObjectsLeft[i].condition = "soured";
			showObject(currentObjectsLeft[i], ".objects-left .all-objects-field", currentObjectsLeft[i].imageSoured, currentObjectsLeft[i].name, i);
		} else {
			currentObjectsLeft[i].condition = "frozen";
			showObject(currentObjectsLeft[i], ".objects-left .all-objects-field", currentObjectsLeft[i].imageFrozen, currentObjectsLeft[i].name, i);
		}
	}
	souredSum += currentSouredSum;

	// Убираем пропавшие продукты
	var n = currentObjectsLeft.length;
	while (n--) {
		if ( currentObjectsLeft[n].expiration <= 7 ) {
			currentObjectsLeft.splice(n, 1);
		} 
	}

	if ( (currentWeek < totalWeeks) && (badNutrition < 3) ) { // если не последняя неделя и питались нормально

		if ( subTotalCalorie < 12600 ) { // если купили недостаточно еды и это не предпоследняя неделя
			$('#game-field, .result-screen-footer').hide();
			$('.game-results-screen, .game-results-screen #game-result-07').show();
			//badNutrition++;
		} else if (currentSouredSum <= 0 && currentObjectsLeft.length == 0) {
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
		saturation = 0;
	} else { // конец игры
		purchaseSum = allMoney - currentMoney;
		$('.total-spend p span:first-child').html('-' + String(purchaseSum).replace(/(\d)(?=(\d{3})+([^\d]|$))/g, '$1 '));
		$('.total__loss-id').html(String(souredSum).replace(/(\d)(?=(\d{3})+([^\d]|$))/g, '$1 '));
		$('.current__money-class').html(String(currentMoney).replace(/(\d)(?=(\d{3})+([^\d]|$))/g, '$1 '));
		$('.total__per-year').html(String(souredSum*12).replace(/(\d)(?=(\d{3})+([^\d]|$))/g, '$1 '));
		$('#game-field').hide();

		if ( subTotalCalorie < 12600 ) { // если плохо питались в последнюю неделю
			badNutrition++;
		}

		console.log(souredSum/purchaseSum);
		if (badNutrition >= 3) {
			$('.game-results-screen, .game-results-screen #game-result-06').show();
		} else {
			if ( currentMoney >= goalPrice ) {
				$('.game-results-screen, .game-results-screen #game-result-04').show();
			} else {
				if ( (currentMoney < goalPrice) && (purchaseSum/allMoney<0,5) ) {
					$('.game-results-screen, .game-results-screen #game-result-05').show();
				} else {
					if ( (currentMoney < goalPrice) && (purchaseSum/allMoney>0,5) ) {
						$('.game-results-screen, .game-results-screen #game-result-01').show();	
					} else { 
						if ( currentMoney == purchaseSum ) {
							$('.game-results-screen, .game-results-screen #game-result-02').show();	
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
	souredObjects = [];
	eatingCalorie = 0;
	currentSouredSum = 0;
	saturation = 0;
	saturationStatusWidth = '0%';
	$("#saturation__status").css({width: saturationStatusWidth});
	// Обрабатываем заморозку
	var m = currentObjectsLeft.length;
	while (m--) {
		if ( currentObjectsLeft[m].condition == "frozen" ) { // если есть что-то в заморозке
			saturation += (currentObjectsLeft[m].calorie*currentObjectsLeft[m].quantity);
			if (saturation <= calorieNorm) {
				saturationStatusWidth = saturation/calorieNorm*100 + '%'; 
			} else {
				saturationStatusWidth = 100 + '%'; 
			}

			//Ищем контейнер объекта для анимации
			$('.objects-left .object-field').each(function() {
				var $currentContainer = $(this);
				if ( $currentContainer.attr("data-name") == currentObjectsLeft[m].name ) {
					var endPointCoordinates = $('.saturation__indicator').position();
					var containerCoordinates = $currentContainer.position();
					$currentContainer.css({"position": "absolute"});
					$currentContainer.animate({left: endPointCoordinates.left+'px', top: endPointCoordinates.top+'px', opacity: 0}, {duration: 800, easing: "linear"});
				}
			});

			currentObjectsLeft[m].quantity = 0;	
			currentObjectsLeft.splice(m, 1);

		} else {
			saturationStatusWidth = '0%';
		}


	}

	subTotalCalorie  = saturation;
	eatingCalorie = saturation;

	$("#saturation__status").animate({width: saturationStatusWidth}, 800, "linear", function() {
  		$('input[name= "quantity"]').val("0");
		$('#current-week-id').html(currentWeek);
		$('.subtotal-field').hide();
		$('#next-week-button').css('visibility', 'hidden');
		$('.choose-field, #play-button').show();
	});
		
}