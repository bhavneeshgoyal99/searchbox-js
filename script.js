var searchHistoryArr = [];

var searchOptions = [];
function loadData() {
    fetch('https://jsonplaceholder.typicode.com/posts').then((response) => {
        return response.json();
    }).then((data) => {
        searchOptions = data;
    }).catch(err => { console.error(err) });
}
loadData();

let searchTimeout;

function searchData(e) {
    clearTimeout(searchTimeout);

    const keywords = e.target.value;
    if (!keywords) {
        document.getElementById('searchSuggestions').style.display = 'none';
        return
    };

    searchTimeout = setTimeout(() => {
        const filtered = searchOptions.filter(option => {
            return option.title.search(keywords);
        });

        let html = "";
        for (const option of filtered) {
            html += `<li onclick="selectFileteredOption('${option.title}')">${option.title}</li>`;
        }

        document.getElementById('suggestionsList').innerHTML = html;
        document.getElementById('searchSuggestions').style.display = 'block';
    }, 500);
}

function selectFileteredOption(title) {
    searchHistoryArr.push({ title, timestamp: new Date() });

    document.getElementById('searchField').value = "";
    document.getElementById('searchSuggestions').style.display = 'none';
    searchHistory();
}


function searchHistory() {
    var html = "";
    var i = 0;

    for (const data of searchHistoryArr) {
        const hours = data.timestamp.getHours();
        const minutes = data.timestamp.getMinutes();
        const seconds = data.timestamp.getSeconds();
        html += `<div class="d-flex-aligned">
            <h5>${data.title}</h5>
            <div class='search-timestamp'>
                <span class="light-text">${hours}:${minutes}:${seconds}</span>
                <span onclick="removeFromSearchHistory(${i})" class="delete-history">&#10005;</span>
            </div>
        </div>`

        i++;
    }

    if (html == "") {
        html = "<p><center>No Search History</center></p>";
    }

    document.getElementById('searchesList').innerHTML = html;
}


function clearSearchHistory() {
    searchHistoryArr = [];

    searchHistory();
}

function removeFromSearchHistory(index) {
    const newArray = searchHistoryArr.splice(index, 1);

    searchHistory();
}

searchHistory();