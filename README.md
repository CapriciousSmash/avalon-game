# Avalon

> An interactive multiplayer game community where players can enjoy a highly addictive strategy game that focuses on deception and deduction. Players must cooperate to complete their quest, but beware, there are traitors amongst them. The goal is to either hide within the group and sow dissent or discover who the traitors are and bring the group to glory.

## Team

  - __Product Owner__: Andrew Heath
  - __Scrum Master__: June Won
  - __Development Team Members__: Andrew Heath, Charlie Tran, Hien Tran, June Won

## Table of Contents

1. [Requirements](#requirements)
1. [Development](#development)
    1. [Running the Game](#running-game)
1. [Team](#team)
1. [Contributing](#contributing)

## How to Play

> Read instructions on the game info tab on the website. Signin/signup and start playing the game :)

## Requirements

- Node 0.10.x
- Redis 2.6.x
- Postgresql 9.1.x
- etc

## Development

### Running Game

1. Make an .env file in the root directory with 
      >DATABASE_URL=postgres://[FILL THIS IN] 

    >REDIS_URL=redis://[FILL THIS IN]
2. From within the root directory:
    - Production
    ```sh
    #Production
    npm install
    node server/server.js
    ```
    - Development
    ```sh
    #Terminal 1
    npm run build
    ```  
    ```sh
    #Terminal 2
    npm run start
    ```  

### Roadmap

View the project roadmap [here](https://github.com/CapriciousSmash/ragnarok-game/issues)


## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for contribution guidelines.
=======
