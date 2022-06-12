let { warn } = console;


warn("======== Основы событий мыши ========");
/*
* Типы событий мыши
 · простые
 · комплексные

* Простые события
 · mousedown/mouseup - Кнопка мыши нажата/отпущена над элементом.
 · mouseover/mouseout - Курсор мыши появляется над элементом и уходит с него.
 · mousemove - Каждое движение мыши над элементом генерирует это событие.
 · contextmenu - Вызывается при попытке открытия контекстного меню, как правило, нажатием правой кнопки мыши. 
  Заметим, что но может вызываться и специальной клавишей клавиатуры.


* Комплексные события
click - Вызывается при mousedown , а затем mouseup над одним и тем же элементом, если использовалась левая кнопка мыши.
dblclick - Вызывается двойным кликом на элементе.


* Получение информации о кнопке: which
 Это свойство не используется для событий click и contextmenu, поскольку первое происходит только
при нажатии левой кнопкой мыши, а второе – правой.
  Но если мы отслеживаем mousedown и mouseup, то оно нам нужно, потому что эти события срабатывают на любой кнопке,
и which позволяет различать между собой «нажатие правой кнопки» и «нажатие левой кнопки».

* Есть три возможных значения:
 · event.which == 1 – левая кнопка
 · event.which == 2 – средняя кнопка
 · event.which == 3 – правая кнопка


* Модификаторы: shift, alt, ctrl и meta
 Все события мыши включают в себя информацию о нажатых клавишах-модификаторах.
 Свойства объекта события:
 · shiftKey: Shift
 · altKey: Alt (или Opt для Mac)
 · ctrlKey: Ctrl
 · metaKey: Cmd для Mac

 Они равны true, если во время события была нажата соответствующая клавиша.
Например, кнопка id="ev_button" работает только при комбинации Alt+Shift+клик:
*/
ev_button.onclick = (e) => {
  return (e.altKey && e.shiftKey) ? alert('Ура!') : console.log('Не правильное сочетание клавишь!');
}

/*
* Координаты: clientX/Y, pageX/Y
 Все события мыши имеют координаты двух видов:
 · Относительно окна: clientX и clientY.
 · Относительно документа: pageX и pageY.

 Наведи курсор мыши на поле ввода, чтобы увидеть clientX/clientY 
(пример находится в iframe, поэтому координаты определяются относительно этого iframe)


* Отключаем выделение
 Двойной клик мыши имеет побочный эффект, который может быть неудобен в некоторых интерфейсах: он выделяет текст.
Например, двойной клик на текст в html выделяет его в дополнение к нашему обработчику.
 Чтобы отменить выделение при помощи "протяжки при нажатии" проще всего будет вернуть false при событии mousedown.
см. html

* Предотвращение копирования
 Если мы хотим отключить выделение для защиты содержимого страницы от копирования, то мы можем использовать другое событие: oncopy.
 Если попытаnmсz скопировать текст в <div>, nj это не получится, потому что срабатывание события oncopy по умолчанию запрещено.
*/

warn("======== Движение мыши ========");
/*
* mouseover/out
 Событие mouseover происходит в момент, когда курсор оказывается над элементом, а событие mouseout – в момент,
когда курсор уходит с элемента.
 Эти события являются особенными, потому что у них имеется свойство relatedTarget. Оно «дополняет» target.
Когда мышь переходит с одного элемента на другой, то один из них будет target, а другой relatedTarget.

* Для события mouseover:
 · event.target – это элемент, на который курсор перешёл.
 · event.relatedTarget – это элемент, с которого курсор ушёл (relatedTarget → target).

* Для события mouseout наоборот:
 · event.target – это элемент, с которого курсор ушёл.
 · event.relatedTarget – это элемент, на который курсор перешёл (target → relatedTarget).

! Свойство relatedTarget может быть null.

 Это нормально и означает, что указатель мыши перешёл не с другого элемента, а из-за пределов окна браузера.
Или же, наоборот, ушёл за пределы окна.
 Следует держать в уме такую возможность при использовании event.relatedTarget в своём коде.
Если, например, написать event.relatedTarget.tagName, то при отсутствии event.relatedTarget будет ошибка.

! Событие mousemove происходит при движении мыши. Однако, если пользователь двигает мышкой очень быстро,
! то некоторые DOM-элементы могут быть пропущены.

! Событие mouseover, происходящее на потомке, всплывает.
 При переходе с родителя элемента на потомка – на родителе сработают два обработчика: и mouseout и mouseover.
*/
let block = document.querySelector('.block-for-mouse');
block.addEventListener('mouseover', e => {
  console.log('Курсор над элементом (OVER)');
})
block.addEventListener('mouseout', e => {
  console.log('Курсов ушёл с элемента (OUT)');
})

/*
* mouseenter/leave
 События mouseenter/mouseleave похожи на mouseover/mouseout, но есть и пара важных отличий:
 · Переходы внутри элемента, на его потомки и с них, не считаются.
 · События mouseenter/mouseleave не всплывают.
*/
block.addEventListener('mouseenter', e => {
  console.log('Курсор над элементом (ENTER)');
})
block.addEventListener('mouseleave', e => {
  console.log('Курсов ушёл с элемента (LEAVE)');
})

//!  Так как они не всплывают, mouseenter/leave нельзя делегировать.


warn("======== Drag'n'Drop с событиями мыши ========");
/*
* Алгоритм
 · При mousedown – готовим элемент к перемещению, если необходимо (например, создаём его копию).
 · Затем при mousemove передвигаем элемент на новые координаты путём смены left/top и position:absolute.
 · При mouseup – остановить перенос элемента и произвести все действия, связанные с окончанием Drag’n’Drop.
*/
// Реализация переноса мяча:
ball.onmousedown = function (event) { // (1) отследить нажатие
  /*
   (2) подготовить к перемещению:
  * Правильное позиционирование
   В примерах выше мяч позиционируется так, что его центр оказывается под указателем мыши.
  Было бы лучше, если бы изначальный сдвиг курсора относительно элемента сохранялся.
  Где захватили, за ту «часть элемента» и переносим.

  * Обновим наш алгоритм.
   Когда человек нажимает на мячик (mousedown) – запомним расстояние от курсора до левого верхнего угла шара
  в переменных shiftX/shiftY. Далее будем удерживать это расстояние при перетаскивании.
  */
  let shiftX = event.clientX - ball.getBoundingClientRect().left;
  let shiftY = event.clientY - ball.getBoundingClientRect().top;

  ball.style.position = 'absolute'; // разместить поверх остального содержимого и в абсолютных координатах
  ball.style.zIndex = 1000;
  document.body.append(ball); // переместим в body, чтобы мяч был точно не внутри position:relative

  moveAt(event.pageX, event.pageY);

  function moveAt(pageX, pageY) {
    // Далее при переносе мяча мы позиционируем его с тем же сдвигом относительно указателя мыши
    ball.style.left = pageX - shiftX + 'px';
    ball.style.top = pageY - shiftY + 'px';
  }

  function onMouseMove(event) {
    moveAt(event.pageX, event.pageY);
  }

  // (3) перемещать по экрану
  document.addEventListener('mousemove', onMouseMove);

  // (4) положить мяч, удалить более ненужные обработчики событий
  ball.onmouseup = function () {
    document.removeEventListener('mousemove', onMouseMove);
    ball.onmouseup = null;
  };
};
/*
 При начале переноса мяч «раздваивается» и переносится не сам мяч, а его «клон».
Всё потому, что браузер имеет свой собственный Drag’n’Drop, который автоматически запускается
и вступает в конфликт с нашим. Это происходит именно для картинок и некоторых других элементов.
*/
//! Его нужно отключить
ball.ondragstart = function () {
  return false;
};
/*
 Событие mousemove отслеживается на document, а не на ball.
Из-за быстрого движения указатель может спрыгнуть с мяча и оказаться где-нибудь в середине документа 
(или даже за пределами окна).
 Поэтому надо отслеживать mousemove на всём document, чтобы поймать его.


* Цели переноса (droppable)
 Берём перетаскиваемый (draggable) элемент и помещаем его в другой элемент «цель переноса» (droppable).
Нужно знать:
 · куда пользователь положил элемент в конце переноса, чтобы обработать его окончание
 · и, желательно, над какой потенциальной целью (элемент, куда можно положить, например, изображение папки) 
 он находится в процессе переноса, чтобы подсветить её.

 Существует метод document.elementFromPoint(clientX, clientY). Он возвращает наиболее глубоко вложенный элемент
по заданным координатам окна (или null, если указанные координаты находятся за пределами окна).
*/
let currentDroppable = null; // потенциальная цель переноса, над которой мы пролетаем прямо сейчас

ball2.onmousedown = event => {

  let shiftX = event.clientX - ball2.getBoundingClientRect().left;
  let shiftY = event.clientY - ball2.getBoundingClientRect().top;

  ball2.style.position = 'absolute';
  ball2.style.zIndex = 1000;
  document.body.append(ball2);

  moveAt(event.pageX, event.pageY);

  function moveAt(pageX, pageY) {
    ball2.style.left = pageX - shiftX + 'px';
    ball2.style.top = pageY - shiftY + 'px';
  }

  function onMouseMove(event) {
    moveAt(event.pageX, event.pageY);

    ball2.hidden = true; // нужно спрятать мяч перед вызовом функции, иначе этим координатам мы будем получать мяч,
    let elemBelow = document.elementFromPoint(event.clientX, event.clientY); //  ведь это и есть элемент непосредственно под указателем
    ball2.hidden = false;

    // событие mousemove может произойти и когда указатель за пределами окна
    // (мяч перетащили за пределы экрана)
    // если clientX/clientY за пределами окна, elementFromPoint вернёт null
    if (!elemBelow) return;

    // потенциальные цели переноса помечены классом droppable (может быть и другая логика)
    let droppableBelow = elemBelow.closest('.droppable');
    if (currentDroppable != droppableBelow) {
      // мы либо залетаем на цель, либо улетаем из неё
      // внимание: оба значения могут быть null
      //   currentDroppable=null,
      //     если мы были не над droppable до этого события (например, над пустым пространством)
      //   droppableBelow=null,
      //     если мы не над droppable именно сейчас, во время этого события
      if (currentDroppable) { // null если мы были не над droppable до этого события
        // (например, над пустым пространством)
        leaveDroppable(currentDroppable);
      }
      currentDroppable = droppableBelow;
      if (currentDroppable) { // null если мы не над droppable сейчас, во время этого события
        // (например, только что покинули droppable)
        enterDroppable(currentDroppable);
      }
    }
  }
  document.addEventListener('mousemove', onMouseMove);

  ball2.onmouseup = () => {
    document.removeEventListener('mousemove', onMouseMove);
    ball2.onmouseup = null;
  };
};

function enterDroppable(elem) {
  elem.style.background = 'pink';
}

function leaveDroppable(elem) {
  elem.style.background = '';
}

ball2.ondragstart = () => false;


warn("======== Клавиатура: keydown и keyup ========");
/*
* События keydown и keyup
 Событие keydown происходит при нажатии клавиши, а keyup – при отпускании.

* event.code и event.key
 Свойство key объекта события позволяет получить символ, а свойство code – «физический код клавиши».
К примеру, одну и ту же клавишу Z можно нажать с клавишей Shift и без неё. 
В результате получится два разных символа: z в нижнем регистре и Z в верхнем регистре.

Клавиша   \   event.key	             \    event.code
___________________________________________________________
Z	        \   z (нижний регистр)	   \    KeyZ
-----------------------------------------------------------
Shift+Z   \  	Z (Верхний регистр)	   \    KeyZ

 Если пользователь работает с разными языками, то при переключении на другой язык символ изменится с "Z"
на совершенно другой. Получившееся станет новым значением event.key, тогда как event.code останется тем же: "KeyZ".

* клавишные коды
 · Буквенные клавиши имеют коды по типу "Key<буква>": "KeyA", "KeyB" и т.д.
 · Коды числовых клавиш строятся по принципу: "Digit<число>": "Digit0", "Digit1" и т.д.
 · Код специальных клавиш – это их имя: "Enter", "Backspace", "Tab" и т.д.

* Если клавиша не буквенно-цифровая
Клавиша          \ 	event.key	      \  event.code
_______________________________________________________________
F1               \ 	F1	            \  F1
---------------------------------------------------------------
Backspace	       \  Backspace	      \  Backspace
---------------------------------------------------------------
Shift	           \  Shift	          \  ShiftRight или ShiftLeft
*/
//! Хотим поддерживать клавиши, меняющиеся при раскладке? Тогда event.key .
//! Надо, чтобы горячая клавиша срабатывала даже после переключения на другой язык? event.code может быть лучше.

/*
* Автоповтор
 Это ситуация, когда много keydownи один keyup.
Для событий, вызванных автоповтором, у объекта события свойство event.repeat равно true.


* Действия по умолчанию
 · Появление символа (самое очевидное).
 · Удаление символа (клавиша Delete).
 · Прокрутка страницы (клавиша PageDown).
 · Открытие диалогового окна браузера «Сохранить» (Ctrl+S)
 · …и так далее.

 event.preventDefault() работает во всех сценариях, кроме тех, которые происходят на уровне операционной системы.
Например, комбинация Alt+F4 инициирует закрытие браузера в Windows, что бы мы ни делали в JavaScript.

 Для примера, <input> ниже ожидает телефонный номер, так что ничего кроме чисел, +, () или - принято не будет:
*/
function checkPhoneKey(key) {
  return key >= 0 || key <= 9 || key == '+' || key == '(' || key == ')' || key == '-' ||
    key == 'ArrowLeft' || key == 'ArrowRight' || key == 'Delete' || key == 'Backspace';
}
/*
 Впрочем, мы всё равно можем ввести в <input> что угодно с помощью правого клика мыши и пункта «Вставить»
контекстного меню. Альтернатива – отслеживать событие input, оно генерируется после любых изменений в поле <input>,
и мы можем проверять новое значение и подчёркивать/изменять его, если оно не подходит.
*/


warn("======== События указателя ========");
/*
* Типы событий указателя
Событие указателя       \	Аналогичное событие мыши
___________________________________________________
pointerdown             \	mousedown
---------------------------------------------------
pointerup	              \  mouseup
---------------------------------------------------
pointermove	            \  mousemove
---------------------------------------------------
pointerover	            \  mouseover
---------------------------------------------------
pointerout	            \  mouseout
---------------------------------------------------
pointerenter	          \  mouseenter
---------------------------------------------------
pointerleave	          \  mouseleave
---------------------------------------------------
pointercancel	          \      -
---------------------------------------------------
gotpointercapture	      \      -
---------------------------------------------------
lostpointercapture	    \      -
---------------------------------------------------


* Свойства событий указателя
 События указателя содержат те же свойства, что и события мыши, например clientX/Y, target и т.п.,
и несколько дополнительных:
 · pointerId – уникальный идентификатор указателя, вызвавшего событие.
  Идентификатор генерируется браузером. Это свойство позволяет обрабатывать несколько указателей, 
 например сенсорный экран со стилусом и мульти-тач.
 · pointerType – тип указывающего устройства. Должен быть строкой с одним из значений: «mouse», «pen» или «touch».
  Мы можем использовать это свойство, чтобы определять разное поведение для разных типов указателей.
 · isPrimary – равно true для основного указателя (первый палец в мульти-тач).

 Некоторые устройства измеряют область контакта и степень надавливани.
 · width – ширина области соприкосновения указателя (например, пальца) с устройством.
  Если не поддерживается, например мышью, то всегда равно 1.
 · height – высота области соприкосновения указателя с устройством.
  Если не поддерживается, например мышью, то всегда равно 1.
 · pressure – степень давления указателя в диапазоне от 0 до 1.
  Для устройств, которые не поддерживают давление, принимает значение 0.5 (нажато) либо 0.
 · tangentialPressure – нормализованное тангенциальное давление.
 · tiltX, tiltY, twist – специфичные для пера свойства, описывающие положение пера относительно сенсорной поверхности.


* Мульти-тач
 События указателя позволяют обрабатывать мульти-тач с помощью свойств pointerId и isPrimary.
 Вот что происходит, когда пользователь касается сенсорного экрана в одном месте, а затем в другом:
 · При касании первым пальцем:
  происходит событие pointerdown со свойством isPrimary=true и некоторым pointerId.
 · При касании вторым и последующими пальцами (при остающемся первом):
  происходит событие pointerdown со свойством isPrimary=false и уникальным pointerId для каждого касания.


* Событие: pointercancel
 Событие pointercancel происходит, когда текущее действие с указателем по какой-то причине прерывается,
и события указателя больше не генерируются.
 К таким причинам можно отнести:
 · Указывающее устройство было физически выключено.
 · Изменилась ориентация устройства (перевернули планшет).
 · Браузер решил сам обработать действие, считая его жестом мыши, масштабированием и т.п.

! Предотвращайте действие браузера по умолчанию, чтобы избежать pointercancel.

 Нужно сделать две вещи:
 · Предотвратить запуск встроенного drag’n’drop для действий мыши:
  item.ondragstart = () => false
 · Для устройств с сенсорным экраном существуют другие действия браузера, связанные с касаниями, кроме drag’n’drop.
  добавляем в CSS свойство #item { touch-action: none }.


* Захват указателя
 Основной метод:
elem.setPointerCapture(pointerId) – привязывает события с данным pointerId к elem.
 После такого вызова все события указателя с таким pointerId будут иметь elem в качестве целевого элемента
(как будто произошли над elem), вне зависимости от того, где в документе они произошли.

 Другими словами, elem.setPointerCapture(pointerId) меняет target всех дальнейших событий с данным pointerId на elem.

Эта привязка отменяется:
 · автоматически, при возникновении события pointerup или pointercancel,
 · автоматически, если elem удаляется из документа,
 · при вызове elem.releasePointerCapture(pointerId).

! Захват указателя используется для упрощения операций с переносом (drag’n’drop) элементов.

 В качестве примера - реализация слайдера (из практики).
Такое решение выглядит слегка «грязным». Одна из проблем – это то, что движения указателя по документу
(вне слайдера) могут вызвать сторонние эффекты.

 Захват указателя позволяет привязать pointermove к thumb и избежать любых подобных проблем:
 · Вызываем thumb.setPointerCapture(event.pointerId) в обработчике pointerdown
 · Дальнейшие события указателя до pointerup/cancel будут привязаны к thumb.
 · Когда произойдёт pointerup (передвижение завершено), привязка будет автоматически удалена.
*/
let shiftX;
thumb.addEventListener('pointerdown', e => {
  e.preventDefault();

  shiftX = e.clientX - thumb.getBoundingClientRect().left;
  thumb.setPointerCapture(e.pointerId);
});

thumb.addEventListener('pointermove', e => {
  let newLeft = e.clientX - shiftX - slider.getBoundingClientRect().left;

  if (newLeft < 0) newLeft = 0;
  let rightEdge = slider.offsetWidth - thumb.offsetWidth;
  if (newLeft > rightEdge) newLeft = rightEdge;

  thumb.style.left = newLeft + 'px';
});
thumb.ondragstart = () => false;

/*
* Существует два связанных с захватом события:
 · gotpointercapture срабатывает, когда элемент использует setPointerCapture для включения захвата.
 · lostpointercapture срабатывает при освобождении от захвата: явно с помощью releasePointerCapture или автоматически,
  когда происходит событие pointerup/pointercancel.
*/

warn("======== Прокрутка ========");
// Событие прокрутки scroll позволяет реагировать на прокрутку страницы или элемента.
/*
* Предотвращение прокрутки
 Нельзя предотвратить прокрутку, используя event.preventDefault() в обработчике onscroll,
потому что он срабатывает после того, как прокрутка уже произошла. Но можно предотвратить прокрутку,
используя event.preventDefault() на событии, которое вызывает прокрутку, например, на событии keydown для клавиш pageUp и pageDown.

Если поставить на них обработчики, в которых вызвать event.preventDefault(), то прокрутка не начнётся.

* Пример безконечной прокрутки страницы.
 Когда посетитель прокручивает её до конца, она автоматически добавляет текущие время и дату в текст
(чтобы посетитель мог прокрутить ещё).
*/
function populate() {
   while (true) {
      let windowRelativeBottom = document.documentElement.getBoundingClientRect().bottom;
      if (windowRelativeBottom > document.documentElement.clientHeight + 100) break;
      document.body.insertAdjacentHTML("beforeend", `<p>Date: ${new Date()}</p>`); // добавляем текущее время
   }
}
document.querySelector('.code-result').addEventListener('scroll', populate);
populate(); // инициализация документа



