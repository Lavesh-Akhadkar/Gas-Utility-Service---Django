# Gas Utility Service

This project is a web application for managing gas utility services. It consists of a Django backend and a ReactJS frontend.


## Setting up backend

1. Create a .env file and add the following environment variables:
```bash
DB_NAME=
DB_USER=
DB_PASSWORD=
DB_HOST=
DB_PORT=
```

2. Install the required packages:
```bash
pip install -r requirements.txt
```
3. Run the migrations:
```bash
python manage.py makemigrations users service_requests
python manage.py migrate
```
4. Create a superuser:
```bash
python manage.py createsuperuser
```
5. Run the server:
```bash
python manage.py runserver
```
6. Create a admin role user using django admin panel and super admin account (Only admin role can create a customer service representative via frontend)

## Setting up frontend

1. Install the required packages:
```bash
cd web
npm install
```
2. Run the server:
```bash
npm start
```
