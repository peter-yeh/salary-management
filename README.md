# salary-management

## Features
- Backend -> Flask
- Frontend -> Angular
- Database -> Sqlite3


## Installation
| | Version |
| --- | --- |
| Python | 3.10.5 |
| NodeJs | 16.16.0 |
| NPM | 8.11.0 |

## Backend
Run on initialization
```
cd Backend
python -m venv env
source env/bin/activate # Linux
./env/Scripts/activate # For Windows
python -m pip install --upgrade pip
pip install -r requirements.txt
python init_db.py
```

To start backend
```
cd Backend
# Activate env
flask run
```

Helpful commands
```
pip install <Package Name>
pip freeze > requirements.txt
```

## Frontend

Might need to install angular
`npm install -g @angular/cli`

```
npm install
ng serve // Goto http://localhost:4200/
```
