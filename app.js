function getWeather(city){
    const apikey = '63e2483f717974c4522b2bd0740c0e16';
    let url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apikey}`;
    fetch(url)
    .then((response) => response.json())
    .then((JSONdata) => {
        let temp = (JSONdata.main.temp-272.15).toFixed(1);
        let humidity = JSONdata.main.humidity;
        let wind = JSONdata.wind.speed.toFixed(1);
        let icon = JSONdata.weather[0].icon;
        drawTable(city, temp, humidity, wind, icon);
    });
}

function drawTable(city, temp, humidity, wind, icon) {
    let list = document.querySelector('#weathertable');
    const row = document.createElement('tr');
    let iconURL = `http://openweathermap.org/img/w/${icon}.png`;
    let favorites = getFavorites();
    if (favorites.includes(city)) {
        row.innerHTML = `
            <td class="align-middle" id="name">${city}</td>
            <td class="align-middle">${temp}&#8451</td>
            <td class="align-middle">${humidity}%</td>
            <td class="align-middle">${wind} m/s</td>
            <td><img src="${iconURL}"></td>
            <td class="align-middle"><i class="fa fa-star addtofav active"></i></td>`;
        list.insertBefore(row, list.childNodes[0]);
    } else {
        row.innerHTML = `
            <td class="align-middle" id="name">${city}</td>
            <td class="align-middle">${temp}&#8451</td>
            <td class="align-middle">${humidity}%</td>
            <td class="align-middle">${wind} m/s</td>
            <td><img src="${iconURL}"></td>
            <td class="align-middle"><i class="fa fa-star addtofav"></i></td>`;
        list.appendChild(row);
    }
} 

function addToFavorites(e) {
    let name = e.target.parentElement.parentElement.querySelector('#name').innerHTML;
    let element = e.target.parentElement.parentElement;
    let list = document.querySelector('#weathertable');
    let favorites = getFavorites();
    if(!favorites.includes(name) && e.target.classList.contains('addtofav')){
        favorites.push(name);
        list.insertBefore(element, list.childNodes[0]);
        e.target.className += ' active';
        localStorage.setItem('favorites', JSON.stringify(favorites));
    }
    else if(favorites.includes(name) && e.target.classList.contains('active')){
        favorites.splice(favorites.indexOf(name), 1);
        list.appendChild(element);
        e.target.classList.remove('active');
        localStorage.setItem('favorites', JSON.stringify(favorites));
    }
}

function getFavorites() {
    let favorites;
    if(localStorage.getItem('favorites') === null){
        favorites = [];
    } else {
        favorites = JSON.parse(localStorage.getItem('favorites'));
    }
    return favorites;
}

// add favorites
document.querySelector('#weathertable').addEventListener('click', addToFavorites);

// search
document.querySelector('#input').addEventListener('input', e => {
    let input = e.target.value.toUpperCase();
    let names = document.querySelectorAll('#name');
    let table = document.getElementById('table');
    let tr = table.getElementsByTagName('tr');
    for(let i = 0; i < tr.length; i++){
        let td = tr[i].getElementsByTagName('td')[0];
        if (td) {
            let txtValue = td.textContent || td.innerText;
            if(txtValue.toUpperCase().indexOf(input) > -1){
                tr[i].style.display = '';
            } else {
                tr[i].style.display = 'none';
            }
        }
    }
});

// get favorites
document.querySelector('#weathertable').addEventListener('DOMContentLoaded', getFavorites);

let cities = ['Helsinki','Espoo','Tampere','Vantaa','Oulu','Turku','Jyväskylä','Lahti','Kuopio','Pori',
        'Kouvola','Joensuu','Lappeenranta','Vaasa','Hämeenlinna','Ylivieska','Keuruu', 'Seinäjoki','Rovaniemi',
        'London', 'Reykjavik','Madrid','Berlin','Bern','Ankara','Rome','Moscow','Washington','Mexico','Brasilia',
        'Cape Town','Dakar','New Delhi','Beijing','Bangkok','Tokyo','Manila','Canberra'];
cities.sort();
cities.forEach(city => getWeather(city));