const API_KEY = "1d3a0eefa97b499d8fbc4ee93eeb40b7";
const url = "https://newsapi.org/v2/everything?q=";

window.addEventListener("load", () => fetchNews("India"));

function reload() {
    window.location.reload();
}

async function fetchNews(query) {
    // Show loader before making the API request
    showLoader(true);

    try {
        const res = await fetch(`${url}${query}&apiKey=${API_KEY}`);
        if (!res.ok) throw new Error("Network response was not ok");
        const data = await res.json();
        if (data.articles.length === 0) {
            showError("No news articles found.");
        } else {
            bindData(data.articles);
        }
    } catch (error) {
        showError("Failed to fetch news. Please try again later.");
    } finally {
        // Hide loader after the API request completes
        showLoader(false);
    }
}

function bindData(articles) {
    const cardsContainer = document.getElementById("cards-container");
    const newsCardTemplate = document.getElementById("template-news-card");

    cardsContainer.innerHTML = "";

    articles.forEach((article) => {
        if (!article.urlToImage) return;
        const cardClone = newsCardTemplate.content.cloneNode(true);
        fillDataInCard(cardClone, article);
        cardsContainer.appendChild(cardClone);
    });
}

function fillDataInCard(cardClone, article) {
    const newsImg = cardClone.querySelector("#news-img");
    const newsTitle = cardClone.querySelector("#news-title");
    const newsSource = cardClone.querySelector("#news-source");
    const newsDesc = cardClone.querySelector("#news-desc");

    newsImg.src = article.urlToImage;
    newsTitle.innerHTML = article.title;
    newsDesc.innerHTML = article.description;

    const date = new Date(article.publishedAt).toLocaleString("en-US", {
        timeZone: "Asia/Jakarta",
    });

    newsSource.innerHTML = `${article.source.name} · ${date}`;

    cardClone.firstElementChild.addEventListener("click", () => {
        window.open(article.url, "_blank");
    });
}

let curSelectedNav = null;
function onNavItemClick(id) {
    fetchNews(id);
    const navItem = document.getElementById(id);
    curSelectedNav?.classList.remove("active");
    curSelectedNav = navItem;
    curSelectedNav.classList.add("active");
}

const searchButton = document.getElementById("search-button");
const searchText = document.getElementById("search-text");

searchButton.addEventListener("click", () => {
    const query = searchText.value;
    if (!query) return;
    fetchNews(query);
    curSelectedNav?.classList.remove("active");
    curSelectedNav = null;
});

function showLoader(isVisible) {
    const loader = document.getElementById("loader");
    if (isVisible) {
        loader.style.display = "block";
    } else {
        loader.style.display = "none";
    }
}

function showError(message) {
    const cardsContainer = document.getElementById("cards-container");
    cardsContainer.innerHTML = `<div class="error-message">${message}</div>`;
}
