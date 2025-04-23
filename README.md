# CPSC-471 Term Project

# Requirements

MySQL must be installed on your system and running.

If not already on your system, you will have to install multiple modules using pip and npm. They can be installed as follows,

Python/Django modules:

`pip install django djangorestframework django-cors-headers mysql mysqlclient mysql-connector-python`

ReactJS related modules (you may have to cd into the frontend-client directory for these to work):

`npm install -g expo-cli`

`cd frontend-client`

`npm install`

`npx expo install react-dom react-native-web @expo/metro-runtime`

Additionally, you will need some additional files in the 'api' and 'cpsc471project' directorys.

api/config.py:
```
config = {
    'host': 'localhost',
    'user': 'root',
    'password': 'YOUR SQL SERVER PASSWORD',
    'database': 'InvestmentDB'
}
```
(If your sql server username is something other than root, use that.)

cpsc471project/secretkey.py:
```
SQLPASS = 'YOUR SQL SERVER PASSWORD HERE'
```
***
# Running

From the base repository directory, run

`python manage.py runserver `

(if python doesn't work, try python3) 

In a separate terminal, from the base repository directory, run

`cd frontend-client`

`npx expo start --web`

After some time, the app should open as a new page in your web browser.
***