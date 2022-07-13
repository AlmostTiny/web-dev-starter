const resultsContainer = document.getElementById("results-container");
const archives = {
    "737208617401749504-tweet": peertheonion_tweet,
    "4097352520-like": sophietheapple_like,
    "4097352520-tweet": sophietheapple_tweet,
};

function setFilterRules(filter1, filter2) {
    Array.from(document.getElementsByClassName(filter1)).forEach((filter) => {
        const otherFilter = document.getElementsByClassName(filter2)[filter.name];
        if (filter.checked) {
            otherFilter.disabled = false;
            otherFilter.checked = false;
            otherFilter.disabled = true;
        }
        filter.addEventListener("change", function () {
            otherFilter.disabled = !otherFilter.disabled;
        });
    });
}
setFilterRules("inc-filter", "exc-filter");
setFilterRules("exc-filter", "inc-filter");

function retweetFilter(tweet) {
    if (
        tweet.tweet.full_text.startsWith("RT @") &&
        tweet.tweet.entities.user_mentions.length === 1
    ) {
        let screenName = tweet.tweet.full_text.substring(4).split(": ")[0];
        for (
            let index = 0;
            index < tweet.tweet.entities.user_mentions.length;
            index++
        ) {
            if (
                tweet.tweet.entities.user_mentions[index].screen_name === screenName
            ) {
                return true;
            }
        }
    }
    return false;
}

function replyFilter(tweet) {
    return typeof tweet.tweet.in_reply_to_status_id_str !== "undefined";
}

function threadFilter(tweet) {
    const searchOption = document.getElementById("search-option").value;
    if (
        tweet.tweet.in_reply_to_user_id_str ===
        searchOption.substring(0, searchOption.length - 6)
    ) {
        return true;
    }
    return false;
}

function mediaFilter(tweet) {
    return typeof tweet.tweet.entities.media !== "undefined";
}

function spotifyFilter(tweet) {
    for (let index = 0; index < tweet.tweet.entities.urls.length; index++) {
        if (
            tweet.tweet.entities.urls[index].expanded_url.startsWith(
                "https://open.spotify.com"
            )
        ) {
            return true;
        }
    }
    return false;
}

function youtubeFilter(tweet) {
    for (let index = 0; index < tweet.tweet.entities.urls.length; index++) {
        if (
            tweet.tweet.entities.urls[index].expanded_url.startsWith(
                "https://www.youtube.com"
            )
        ) {
            return true;
        }
    }
    return false;
}

let filters = [
    function (tweet) {
        return retweetFilter(tweet);
    },
    function (tweet) {
        return replyFilter(tweet);
    },
    function (tweet) {
        return threadFilter(tweet);
    },
    function (tweet) {
        return mediaFilter(tweet);
    },
    function (tweet) {
        return spotifyFilter(tweet);
    },
    function (tweet) {
        return youtubeFilter(tweet);
    },
];

function filterResult(tweet) {
    //console.log(document.getElementsByClassName("inc-filter")[0].checked + " " + filters[0](tweet) + " " + !(document.getElementsByClassName("inc-filter")[0].checked && !filters[0](tweet)));
    let a1 = [true, true, false, false, false, false];
    let a2 = [false, false, false, false, false, false];
    //console.log(a1.reduce((a, b) => (a && !a2[a1.indexOf(a)]) && !(b && !a2[a1.indexOf(b)]), true));

    let filterOK;
    let jhfhg = document.createElement("input");
    jhfhg.type = "checkbox";
    const incFilter = [jhfhg].concat(
        Array.from(document.getElementsByClassName("inc-filter"))
    );
    if (document.getElementById("inc-filter-and").checked) {
        jhfhg.checked = true;
        filterOK = filters.reduce(
            (a, b) =>
                !(a.checked && !filters[incFilter.indexOf(a)](tweet)) &&
                !(b.checked && !filters[incFilter.indexOf(b)](tweet))
        );
        console.log(filterOK);
    } else {
        jhfhg.checked = false;
        filterOK = incFilter.reduce(
            (a, b) =>
                !(a.checked && !filters[incFilter.indexOf(a)](tweet)) ||
                !(b.checked && !filters[incFilter.indexOf(b)](tweet)),
            false
        );
        console.log(filterOK);
    }
    if (filterOK) {
        const excFilter = Array.from(document.getElementsByClassName("exc-filter"));
        if (document.getElementById("exc-filter-and").checked) {
            jhfhg.checked = true;
            filterOK = excFilter.reduce(
                (a, b) =>
                    !(a.checked && filters[incFilter.indexOf(a)](tweet)) &&
                    !(b.checked && filters[incFilter.indexOf(b)](tweet)),
                true
            );
            //console.log(filterOK);
        } else {
            jhfhg.checked = false;
            filterOK = excFilter.reduce(
                (a, b) =>
                    !(a.checked && filters[incFilter.indexOf(a)](tweet)) ||
                    !(b.checked && filters[incFilter.indexOf(b)](tweet)),
                false
            );
            //console.log(filterOK);
        }
    }
    return filterOK;
}

document
    .getElementById("search-option")
    .addEventListener("change", function () {
        const searchOption = document.getElementById("search-option").value;

        if (searchOption === "4097352520-like") {
            Array.from(document.getElementsByClassName("filters")).forEach(
                (element) => {
                    element.style.display = "none";
                }
            );
        } else if (
            searchOption === "737208617401749504-tweet" ||
            searchOption === "4097352520-tweet"
        ) {
            Array.from(document.getElementsByClassName("filters")).forEach(
                (element) => {
                    element.style.display = "initial";
                }
            );
        }
    });

document.getElementById("search-button").addEventListener("click", function () {
    console.clear();
    const searchOption = document.getElementById("search-option").value;
    const searchText = document.getElementById("search-text").value;
    let searchResults = document.createElement("p");

    if (searchText !== "") {
        if (resultsContainer.hasChildNodes()) {
            resultsContainer.removeChild(resultsContainer.firstChild);
        }

        function getFullText(archiveItem) {
            let fullText = "";
            if (
                searchOption === "737208617401749504-tweet" ||
                searchOption === "4097352520-tweet"
            ) {
                fullText = archiveItem.tweet.full_text;
            } else if (searchOption === "4097352520-like") {
                fullText = archiveItem.like.fullText;
            }
            return fullText;
        }

        function getTimeStamp(archiveItem) {
            let timeStamp = "";
            if (
                searchOption === "737208617401749504-tweet" ||
                searchOption === "4097352520-tweet"
            ) {
                timeStamp = archiveItem.tweet.created_at;
            }
            return timeStamp;
        }

        const tweetResults = archives[searchOption].filter(function (tweet) {
            (searchOption === "737208617401749504-tweet" ||
                searchOption === "4097352520-tweet") &&
                getFullText(tweet).includes(searchText) &&
                filterResult(tweet);
            return false;
        });

        if (tweetResults.length > 0) {
            searchResults = document.createElement("ul");
            resultsContainer.appendChild(searchResults);

            if (
                searchOption === "737208617401749504-tweet" ||
                searchOption === "4097352520-tweet"
            ) {
                tweetResults.sort(function (tweet1, tweet2) {
                    return (
                        new Date(tweet1.tweet.created_at).getTime() >
                        new Date(tweet2.tweet.created_at).getTime()
                    );
                });
            }

            tweetResults.forEach((tweet) => {
                const tweetResult = document.createElement("li");
                tweetResult.appendChild(
                    document.createTextNode(
                        `${getTimeStamp(tweet)} ${getFullText(tweet)}`
                    )
                );
                searchResults.appendChild(tweetResult);
            });
        } else {
            searchResults.appendChild(
                document.createTextNode(`\"${searchText}\" is nowhere to be found :(`)
            );
            resultsContainer.appendChild(searchResults);
        }
    }
});
