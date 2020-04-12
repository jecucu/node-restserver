// Puerto
process.env.PORT = process.env.PORT || 3000

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

let urlDB;

if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe';
} else {
    urlDB = process.env.MONGO_URL;
}

process.env.URLDB = urlDB;


//Vencimiento TOKEN
process.env.CADUCIDAD_TOKEN = '48h';

//Semilla
process.env.SEED = process.env.SEED || 'este-es-el-seed-desarrollo';

//google client id
process.env.CLIENT_ID = process.env.CLIENT_ID || '491312156295-q94gtipdrld9oglqd9p6ifdc39nov3mf.apps.googleusercontent.com';