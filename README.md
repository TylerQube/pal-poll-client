# PalPoll Client

PalPoll, a daily quiz game designed to bring friends closer together!

<img src="https://i.imgur.com/qzhKI2y.png" width="600" />

A single-page Vue/Vuetify frontend providing preregistered users access to my daily PalPoll quiz game!

The client communicates with the [palpoll backend](https://github.com/TylerQube/pal-poll-server) to fetch user data, questions, stats, and game progress.

# Features

- Animated gradient background using [particles.js](https://vincentgarreau.com/particles.js/)
- Profile page for editing account data
- Administrator page (restricted to admin role) to create/reorder questions and edit properties of Quiz game
- Quiz game page with SCSS animations and answer selection carousel using [Flickity](https://flickity.metafizzy.co/)
- Statistics page showing past and current question results and user guesses

# Profile

On their profile page, registered users (restricted to a whitelist of close friends) can view and update personal data such as a display name, email, and profile picture.

<img src="https://i.imgur.com/ipXrdu0.png" width="600" />

# Admin Page

Users with the admin role can edit the start date of the Quiz game, as well as add Quiz questions (with a limited number of responses and a correct answer) or Poll questions (which allows users to select any of our friends as a response)

<img src="https://i.imgur.com/fILjCnM.png" width="400" />

# Quiz Game

Every 24 hours, a new quiz or poll question becomes available for users.

<img src="https://i.imgur.com/X28IsZz.gif" height="400"/>

# Stats Page

After playing, users can view the results of today's and all past questions.

Each stat card displays the most popular or correct answer, answer frequency in a bar graph, and each individual answer in a data table.

Below is an example statistics card (user information censored).

<img src="https://i.imgur.com/rWMfmS9.png" width="400"/>

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
