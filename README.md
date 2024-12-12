### Django Full Stack Application

This repository contains a full-stack web application built with Django for the backend and React for the frontend. The application is designed to provide a robust and scalable foundation for web development projects.

## Features

    Backend: Django framework serving as the core backend.
    Frontend: React library for building interactive user interfaces.
    Database: PostgreSQL for reliable data storage.
    Reverse Proxy: Nginx configured as a reverse proxy server.
    SSL Certificates: Certbot for managing SSL certificates to ensure secure connections.

## Prerequisites

Before setting up the project, ensure you have the following installed:

    - Docker
    - Docker Compose

## Setup Instructions

1. Clone the Repository:

git clone https://github.com/jackhax1/django_full_stack.git
cd django_full_stack

2. Configure Environment Variables:

    Duplicate the docker-compose.yml.example file and rename it to docker-compose.yml.
    Modify the environment variables in the docker-compose.yml file to match your project's requirements.
    - Create Postgres username, password and database name
    - Enter the same thing into Django env
    - Create your django superuser
    - Create django secret key: [Generate Django Secret Key](https://djecrety.ir/)

2. Build and Start the Containers:

`docker-compose up --build`

3. Access the frontend

`localhost:81`

## Contributing


Contributions are welcome! Please fork the repository and create a pull request with your changes.
License

This project is licensed under the MIT License. See the LICENSE file for details.

## Acknowledgements

Special thanks to the contributors and the open-source community for their invaluable resources and support.


## To Do
`To Do`