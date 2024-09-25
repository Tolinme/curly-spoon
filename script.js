const proxyUrl = 'https://cors-anywhere.herokuapp.com/';
const date = document.querySelector(".date")
const selectElement = document.querySelector("select[name='lessons']")
const lesson = document.querySelector("textarea")
let SСHEDULE = []
let targetUrl = 'https://www.vgtk.by/schedule/lessons/day-today.php'
let isToday = true;

const userSelectedGropus = []
const userSelectedLessons = []

const allGroups = [
  "А-11","А-21","А-31","А-41",
  "Д-11","Д-31","ЖБИ-11","ЖБИ-21",
  "С-11","С-21","С-31","С-41",
  "С-42","ТС-11",

  "Б-31","ВР-11","ВР-21","ВС-21",
  "ВС-31","ВС-41","ИТ-11","ИТ-21",
  "М-11","М-21","Э-11","Э-21",
  "Э-32","Э-42","ТЭ-11",

  "АС-22","АС-32","АС-42","ОС-11",
  "ОС-21","ОС-32","ОС-42","ЭМ-11",
  "ЭМ-21","ЭМ-32","ЭМ-42",

  "ПКО-11","ПКО-21","ПКО-31","ПКЭ-39",
  "ПСМ-13","ПСМ-23","ПСМ-33","ПСМ-33",
  "ПФЭ-16","ПФЭ-26","ПФЭ-36",

  "ПОО-14","ПОО-24","ПОО-34","ПТЭ-111",
  "ПМЭ-18","ПМЭ-28","ПМЭ-38",


  "ПТС-17","ПТС-27","ПТС-217","ПТС-37",
  "ПТС-317","ПФС-32","ПСЭ-11",

  "ПЭС-15","ПЭС-115","ПЭС-25","ПЭС-35",
  "ПЭС-315","ПКМ-12","ПКМ-22","ПМР-19",
  "ПМР-119","ПМР-29",
  ]
allGroups.forEach(group => {selectElement.appendChild(new Option(group, group))})

function getGroups(){
    userSelectedGropus.push(selectElement.value)
    userSelectedLessons.push(lesson.value)
    filterschedule()
}

function filterschedule(){
    let filteredSchedule = SСHEDULE.filter(item => userSelectedGropus.includes(item.groupName))
    let filteredLessons = SСHEDULE.filter(item =>  userSelectedLessons.includes(item.lessonName))

    console.log(filteredSchedule,filteredLessons)
    console.log(userSelectedGropus,userSelectedLessons)
}

// Функция для разделения td с атрибутом rowspan равным 2
function splitRowspan2TD(tableElement) {
    for (let i = 0; i < tableElement.rows.length; i++) {
        let row = tableElement.rows[i];
        for (let j = 0; j < row.cells.length; j++) {
            let cell = row.cells[j];
            if (cell.hasAttribute("rowspan") && parseInt(cell.getAttribute("rowspan")) === 2) {
                let newCell = cell.cloneNode(true);
                cell.removeAttribute("rowspan");
                newCell.removeAttribute("rowspan");
                if (row.nextElementSibling) {
                    let nextRow = row.nextElementSibling;
                    let nextCell = nextRow.insertCell(j);
                    nextCell.innerHTML = newCell.innerHTML;
                }
            }
        }
    }
}

function getVGTK(url){
    fetch(url)
    .then(response => response.text())
    .then(data => {
        SСHEDULE = []
        const tempElement = document.createElement('div');
        tempElement.innerHTML = data;
        const tableElement = tempElement.querySelector('table');
        date.innerText = tableElement.rows[0].innerText.trim()

        splitRowspan2TD(tableElement)
    
        for (let i = 0; i < tableElement.rows.length - 11; i++) {
            const row = tableElement.rows[i];
            if (row.cells.length > 1) {
                Array.from(row.cells).forEach((cell, j) => {
                    let cellValue = cell.innerText.trim();
                    if (allGroups.includes(cellValue)) {
                        const groupSchedule = {
                            groupName: cellValue,
                            ...Array.from({ length: 11 }, (_, index) => ({
                                [index + 1]: {
                                    lessonName: tableElement.rows[i + index + 1].cells[j]?.innerText.trim(),
                                    cabinet: tableElement.rows[i + index + 1].cells[j + 1]?.innerText.trim()
                                }
                            }))
                        }
                        SСHEDULE.push(groupSchedule);
                    }
                })
            }
        }
    console.log(SСHEDULE)
  })
  .catch(error => console.error('Ошибка:', error))
}
getVGTK(proxyUrl + targetUrl)

function changeDay() {
    isToday = !isToday;
      if (isToday) {
        targetUrl = "https://www.vgtk.by/schedule/lessons/day-today.php";
        getVGTK(proxyUrl + targetUrl)
      } else {  
        targetUrl = "https://www.vgtk.by/schedule/lessons/day-tomorrow.php";
        getVGTK(proxyUrl + targetUrl)
      }
}





