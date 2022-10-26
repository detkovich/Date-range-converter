// "Создать форму - 2 инпута даты и кнопка ""Рассчитать"".
//При нажатии на кнопку получить курс доллара с сайта нацбанка
// на все даты в диапазоне и вывести на интерфейс дату с минимальным
//и максимальным курсами(с указанием курса).
//Кнопку можно нажать только есть обе даты введены и диапазон корректен
// (то есть левая дата меньше правой). Одним запросом можно получать курс
// только на один день(нельзя использовать эндпоинт на получение курсов на диапазон дат)
// ДЗ разместить на GIT скинуть ссылку на репозиторий"
const date1 = document.querySelector('#date1')
const date2 = document.querySelector('#date2')
const button = document.querySelector('.btn')
const body = document.querySelector('.card')

button.addEventListener("click", e => {
  if (date1.value > date2.value || date1.value === "" || date2.value === "") {
    alert("Введен некорректный диапазон дат")
    location.reload()
  }
  let first = date1.valueAsNumber
  let second = date2.valueAsNumber
  let day = 86400000
  let arr = []
  let div = document.createElement("div")

  for (let i = first; i <= second; i += day) {
    arr.push(i)
  }

  let readyDate = arr.map((num) => {
    let finishedDate = new Date(num);
    let finalDate = `${finishedDate.getFullYear()}-${finishedDate.getMonth() + 1}-${finishedDate.getDate()}`;
    return finalDate;
  });

  let urls = readyDate.map((date) => {
    return `https://www.nbrb.by/api/exrates/rates/usd?parammode=2&ondate=${date}`;
  });
  
  let arrCourse = [];
  let arrDate = [];
  Promise.all(urls.map((url) => fetch(url)
    .then((res) => res.json())))
    .then(results => { // (*)
      results.forEach((result) => {
        arrCourse.push(result.Cur_OfficialRate);
        arrDate.push(result.Date)

      });
      let minCourse = Math.min(...arrCourse);
      let maxCourse = Math.max(...arrCourse);
      let minDay = arrDate[arrCourse.indexOf(minCourse)];
      let maxDay = arrDate[arrCourse.indexOf(maxCourse)];

      div.innerHTML = `Дата ${minDay} c минимальным курсом ${minCourse}<br>
      Дата ${maxDay} с  максимальным курсом ${maxCourse}`

      body.append(div)
    });
})




