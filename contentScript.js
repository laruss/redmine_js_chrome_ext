var inputTags = document.getElementsByTagName("input");
var searchText = "Принять";
var button;
var tablink;
var docTitle;
var status;
var textString;
var statusList = [
    'Тестируется',
    'Тестирование пройдено',
    'Требуется доработка'
]
var finalDict = {}
var inJSON

for (var i = 0; i < inputTags.length; i++) {
  if (inputTags[i].getAttribute("value") == searchText) {
    button = inputTags[i];
    break;
  }
}


function getJSON() {
    let url = chrome.extension.getURL("tmp.json");
    fetch(url)
    .then(res => res.json())
    .then((out) => {
        saveJSON(out)
    })
    .catch(err => { throw err });
}

function saveJSON(inData) {
    inJSON = inData;
}

function pushTextToJSON(text, status) {
    // 1. checkout if we already have our task in json
    for (var i = 0; i < statusList.length; i++) {
        // console.log(Object.keys(inJSON.statuses).length);
        var item = statusList[i];
        for (var j = 0; j < Object.keys(inJSON.statuses).length; j++) {
            // console.log(inJSON.statuses[item][j]) // undefined
            // if (statusDict[item][j] == text) {
            //     console.log("типа удалили");
            //     statusDict[item].splice(j,1);
            // }
        }
    }
    // 2. add our task in json
    var entries = Object.entries(inJSON.statuses)
    for (var i in entries) {
        var item = statusList[i];
        console.log(entries[i][0]+', st:'+status);
        if (entries[i][0] == status) {
            entries[i][1].push(text)
        }
    }
}

window.onload = getJSON

function getTodayDate() {
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();
    today = dd + '.' + mm + '.' + yyyy;
    return today;
}

button.addEventListener("click", function() {
    tablink = window.location;
    docTitle = document.title;
    textString = tablink + ' ' + docTitle
    status = document.querySelectorAll("select[id=issue_status_id] > option[selected]")[0].text
    pushTextToJSON(textString, status)
    // console.log(inJSON)
    alert(inJSON.statuses["Требуется доработка"]);
  }, false);

// TODO: create a file-report to send to slack
//       send text-message to slack
// js должен отправлять сообщение в слак в опр. канал (отд. ф-ция)