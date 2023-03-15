var searchHistoryArr = [];

/**
 * Fetch data from server
 * 
 * @returns {Object}
 */
async function loadData() {
    const data = await fetch('https://jsonplaceholder.typicode.com/posts')
    .then((response) => {
        return response.json();
    }).then((data) => {
        if(data && Array.isArray(data)) return data;

        return [];
    }).catch(err => { console.error(err) });
    
    return data;
}

let searchTimeout;
/**
 * Handles Search input and performs search operations
 * 
 * @param {DOM} e 
 */
function searchData(e) {
    clearTimeout(searchTimeout);

    const keywords = e.target.value;
    if (!keywords) {
        document.getElementById('searchSuggestions').style.display = 'none';
        return
    };

    searchTimeout = setTimeout(async () => {
        const getApiResult = await loadData();
        const filtered = getApiResult.filter(option => {
            return option.title.includes(keywords);
        });

        let html = "";
        if(!filtered.length){
            html += `<li>Sorry! Unable to find relevant data.</li>`;
        }else{
            for (const option of filtered) {
                html += `<li onclick="selectFileteredOption('${option.title}')">${option.title}</li>`;
            }
        }

        document.getElementById('suggestionsList').innerHTML = html;
        document.getElementById('searchSuggestions').style.display = 'block';
    }, 500);
}

/**
 * Cancel Search
 */
function cancelSearch(){
    document.getElementById('searchField').value = '';
    document.getElementById('searchSuggestions').style.display = 'none';
}

/**
 * Handles search selection
 * 
 * @param {String} title
 */
function selectFileteredOption(title) {
    searchHistoryArr.push({ title, timestamp: new Date() });

    document.getElementById('searchField').value = "";
    document.getElementById('searchSuggestions').style.display = 'none';
    searchHistory();
}

/**
 * Creates DOM for search history list
 */
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

/**
 * Clears search history
 */
function clearSearchHistory() {
    searchHistoryArr = [];

    searchHistory();
}

/**
 * Deletes specific search record
 */
function removeFromSearchHistory(index) {
    searchHistoryArr.splice(index, 1);

    searchHistory();
}

searchHistory();