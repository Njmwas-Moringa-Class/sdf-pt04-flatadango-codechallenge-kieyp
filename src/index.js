// Wait for the DOM content to be fully loaded before executing the code
document.addEventListener("DOMContentLoaded", () => {
    // Base URL for API requests
    const BASE_URL = "http://localhost:3000";
  
    // Variable to store the number of available tickets
    let availableTickets = 0;
  
    // Object containing references to various HTML elements
    const elements = {
      poster: document.getElementById("poster"),
      title: document.getElementById("title"),
      runtime: document.getElementById("runtime"),
      showtime: document.getElementById("showtime"),
      ticketNum: document.getElementById("ticket-num"),
      filmInfo: document.getElementById("film-info"),
      filmsList: document.getElementById("films"),
      buyButton: document.getElementById("buy-ticket")
    };
  
    // Function to fetch data from the given URL using async/await
    const fetchData = async (url) => {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Failed to fetch data from ${url}`);
      }
      return response.json();
    };
  
    // Function to update the available tickets display and buy button status
    const updateAvailableTickets = () => {
      elements.ticketNum.textContent = availableTickets;
      const buyButton = elements.buyButton;
      if (availableTickets === 0) {
        buyButton.disabled = true;
        buyButton.textContent = "Sold Out";
      } else {
        buyButton.disabled = false;
        buyButton.textContent = "Buy Ticket";
      }
    };
  
    // Function to update movie details displayed on the page
    const updateMovieDetails = (filmData) => {
      const {
        title,
        runtime,
        showtime,
        capacity,
        tickets_sold,
        description,
        poster
      } = filmData;
      availableTickets = capacity - tickets_sold;
  
      // Update HTML elements with movie details
      elements.poster.src = poster;
      elements.title.textContent = title;
      elements.runtime.textContent = `${runtime} minutes`;
      elements.showtime.textContent = showtime;
      elements.filmInfo.textContent = description;
  
      // Update available tickets display and buy button status
      updateAvailableTickets();
    };
  
    // Function to populate the movie list on the page
    const populateMovieList = async () => {
      try {
        // Fetch the list of films from the API
        const films = await fetchData(`${BASE_URL}/films`);
  
        // Clear the films list before populating it with new data
        elements.filmsList.innerHTML = "";
  
        // Iterate through the films and create list items for each film
        films.forEach((film) => {
          const li = document.createElement("li");
          li.textContent = film.title;
          li.classList.add("film-item");
  
          // Add click event listener to each film item to display its details
          li.addEventListener("click", () => {
            fetchData(`${BASE_URL}/films/${film.id}`)
              .then((filmData) => updateMovieDetails(filmData))
              .catch(error => console.error("Error fetching movie details:", error));
          });
  
          // Append the film item to the films list
          elements.filmsList.appendChild(li);
        });
      } catch (error) {
        console.error("Error fetching movie list:", error);
      }
    };
  
    // Function to simulate buying a ticket
    const buyTicket = () => {
      try {
        // If there are available tickets, decrease the count and update the display
        if (availableTickets > 0) {
          availableTickets--;
  
          // Update available tickets display and buy button status
          updateAvailableTickets();
  
          // Simulate updating the server (in reality, make an API call)
          // ...
        }
      } catch (error) {
        console.error("Error purchasing ticket:", error);
      }
    };
  
    // Event listener for the buy button click
    elements.buyButton.addEventListener("click", buyTicket);
  
    // Initialize the movie list and display details for the first movie
    populateMovieList()
      .then(() => fetchData(`${BASE_URL}/films/1`))
      .then((filmData) => updateMovieDetails(filmData))
      .catch(error => console.error("Error initializing:", error));
  });
  