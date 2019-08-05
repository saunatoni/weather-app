function getWeather(city){
    const apikey = '63e2483f717974c4522b2bd0740c0e16';
    let url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apikey}`;
    console.log(url);
    fetch(url)
    .then((response) => response.json())
    .then((JSONdata) => {
        let temp = Math.round(JSONdata.main.temp-272.15);
        let humidity = JSONdata.main.humidity;
        let wind = JSONdata.wind.speed;
        drawTable(city, temp, humidity, wind);
    });
}

function drawTable(city, temp, humidity, wind) {
    let list = document.querySelector('#citylist');
    const row = document.createElement('tr');
    row.className = 'item';
    let favorites = getFavorites();
    if (favorites.includes(city)) {
        row.innerHTML = `
            <td id="name">${city}</td>
            <td>${temp}&#8451</td>
            <td>${humidity}%</td>
            <td>${wind} m/s</td>
            <td><i class="fa fa-star addtofav active"></i></td>`;
        list.insertBefore(row, list.childNodes[0]);
    } else {
        row.innerHTML = `
            <td id="name">${city}</td>
            <td>${temp}&#8451</td>
            <td>${humidity}%</td>
            <td>${wind} m/s</td>
            <td><i class="fa fa-star addtofav"></i></td>`;
        list.appendChild(row);
    }
} 

function addToFavorites(e) {
    let name = e.target.parentElement.parentElement.querySelector('#name').innerHTML;
    let element = e.target.parentElement.parentElement;
    let list = document.querySelector('#citylist');
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

document.querySelector('#city').addEventListener('input', e => {
    let input = e.target.value.toUpperCase();
    let names = document.querySelectorAll('#name');
    let tr = document.querySelectorAll('tr');
    for(let i = 0; i < names.length; i++){
        let a = names[i];
        if(a.innerHTML.toUpperCase().indexOf(input) > -1){
            tr[i].style.display = '';
        } else {
            tr[i].style.display = 'none';
        }
    }
});
    

let cities = ['Helsinki','Espoo','Tampere','Vantaa','Oulu','Turku','Jyväskylä','Lahti','Kuopio','Pori',
        'Kouvola','Joensuu','Lappeenranta','Vaasa','Hämeenlinna','Ylivieska','Keuruu', 'Seinäjoki','Rovaniemi','Mikkeli',
        'Kotka','Salo','Porvoo','Kokkola','Hyvinkää','Lohja','Järvenpää','Nurmijärvi','Rauma','Kirkkonummi','Tuusula',
        'Kajaani','Kerava','Savonlinna'];
cities.sort();
cities.forEach(city => getWeather(city));

// add favorites
document.querySelector('#citylist').addEventListener('DOMContentLoaded', getFavorites);
document.querySelector('#citylist').addEventListener('click', addToFavorites);