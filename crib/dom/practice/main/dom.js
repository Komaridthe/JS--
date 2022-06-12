// Создать div

// Добавить к нему класс wrapper

// Поместить его внутрь тэга body

// Добавить атрибут "Test" со значением 123

// Проверить наличие нового атрибота в консоле

// Создать заголовок H1 "DOM (Document Object Model)"

// Добавить H1 перед DIV с классом wrapper

// Создать список <ul></ul> и добавить в него 3 элемента с текстом "один, два, три"

// Поместить список внутрь элемента с классом wrapper

// =================================================
// Создать изображение

// Добавить следующие свойства к изображению
// 1. Добавить атрибут source. (picsum.photos/240)

// 2. Добавить атрибут width со значением 240

// 3. Добавить класс super

// 4. Добавить свойство alt со значением "Super Man"

// Поместить изображение внутрь элемента с классом wrapper

// Используя HTML строку, создать DIV с классом 'pDiv' + c 2-мя параграфами

// Поместить этот DIV до элемента <ul></ul>

// Добавить для 2-го параграфа класс text

// Удалить 1-й параграф

// Добавить третий параграф с текстом в конец (не через HTML)

// =================================================
// Создать функцию generateAutoCard, 
// которая принимает 3 аргумента: brand, color, year
// Функция должна возвращать разметку HTML:
// <div class="autoCard">
//   <h2>BRAND YEAR</h2>
//   <p>Автомобиль BRAND - YEAR года. Возраст авто - YEARS лет.</p>
//   <p>Цвет COLOR</p>
// </div>


// Создать новый DIV с классом autos

// Создать 4 карточки авто, используя функцию generateAutoCard
const carsList = [
    { brand: 'Tesla', year: 2015, color: 'Красный' },
    { brand: 'Lexus', year: 2016, color: 'Серебристый' },
    { brand: 'Nissan', year: 2012, color: 'Черный' },
    { brand: 'Lada', year: 2010, color: 'Баклажан' },
];

// Поместить эти 3 карточки внутрь DIV с классом autos

// Поместить DIV c классом autos на страницу DOM - до DIV с классом wrapper

// Добавить кнопку 'Удалить' на каждую карточку авто

// При клике на кнопку - удалять карточку из структуры DOM
