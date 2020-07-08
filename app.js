"use strict";

// api key and endpoint https://developer.nps.gov/api/v1/parks?stateCode=HI&api_key=mQjMtZQe5RfTqrMPOTMQmzEjrvQUElykjkryhTSO&limit=3
let stateList = [];
let parkCount = 10;
//mQjMtZQe5RfTqrMPOTMQmzEjrvQUElykjkryhTSO&stateCode=AL&limit=10
const apiKey = "mQjMtZQe5RfTqrMPOTMQmzEjrvQUElykjkryhTSO";
const searchURL = `https://developer.nps.gov/api/v1/parks`;
//stateCode=${stateList}&limit=${parkCount}&api_key=${apiKey};

function formatQueryParams(params) {
  const queryItems = Object.keys(params).map(
    (key) => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`
  );
  return queryItems.join("&");
}

function displayResults(responseJson) {
  // if there are previous results, remove them
  console.log(responseJson);
  $("#results-list").empty();
  // iterate through the items array
  for (let i = 0; i < responseJson.data.length; i++) {
    // for each video object in the items
    //array, add a list item to the results
    //list with the video title, description,
    //and thumbnail

    // we want to display the name, description picture and url
    $("#results-list").append(
      `<li><h3>${responseJson.data[i].fullName}</h3>
      <p>${responseJson.data[i].description}</p>
      <img src='${responseJson.data[i].images[0].url}'>
      <a href='${responseJson.data[i].url}'>Click Here to See More!! ${responseJson.data[i].url}</a>

      </li>`
    );
  }
  //display the results section
  $("#results").removeClass("hidden");
}
//sets parameters for the query string
function getParks(stateList, limit = 10) {
  const params = {
    api_key: apiKey,
    stateCode: stateList,
    limit,
  };
  const queryString = formatQueryParams(params);
  const url = searchURL + "?" + queryString;

  console.log(url);

  fetch(url)
    .then((response) => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(response.statusText);
    })
    .then((responseJson) => displayResults(responseJson))
    .catch((err) => {
      $("#js-error-message").text(`Something went wrong: ${err.message}`);
    });
}

function watchForm() {
  $("form").submit((event) => {
    event.preventDefault();
    // const searchTerm = $("input").click(function () {
    //   var stateList = [];
    //   $.each($(".state-selector option:selected"), function () {
    //     stateList.push($(this).val());
    //   });
    // });
    var stateList = [];
    $.each($("input[class='state-selector']:checked"), function () {
      stateList.push($(this).val());
    });

    console.log(stateList);
    //   $("form").submit((event) => {
    //     event.preventDefault();
    //     const searchTerm = $(".state-selector").val();
    //     stateList.push(searchTerm);
    //     // $("input:checkbox.class").each(function () {
    //     //   var sThisVal = this.checked ? $(this).val() : "";
    //     // });
    const maxResults = $("#js-max-results").val();
    getParks(stateList.join(","), maxResults);
  });
}

$(watchForm);
