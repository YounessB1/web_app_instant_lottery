import crypto from 'crypto';
import { db } from "./db.mjs";
import { runQuery } from "./db.mjs";

const salt1 = crypto.randomBytes(16).toString('hex');
const salt2 = crypto.randomBytes(16).toString('hex');
const salt3 = crypto.randomBytes(16).toString('hex');
const salt4 = crypto.randomBytes(16).toString('hex');
const salt5 = crypto.randomBytes(16).toString('hex');
const hashedPassword1 = crypto.scryptSync("password1", salt1, 16).toString('hex');
const hashedPassword2 = crypto.scryptSync("password2", salt2, 16).toString('hex');
const hashedPassword3 = crypto.scryptSync("password3", salt3, 16).toString('hex');
const hashedPassword4 = crypto.scryptSync("password4", salt4, 16).toString('hex');
const hashedPassword5 = crypto.scryptSync("password5", salt5, 16).toString('hex');

db.serialize(() => { 
    
    //Users
    runQuery(`
        CREATE TABLE users(
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT NOT NULL UNIQUE,
            name TEXT NOT NULL,
            surname TEXT NOT NULL,
            tokens NUMBER NOT NULL,
            password TEXT NOT NULL,
            salt TEXT NOT NULL
        )
    `);

    //draws
    runQuery(`
        CREATE TABLE draws(
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            timestamp DATETIME DEFAULT (DATETIME('now', 'localtime')),
            int1 INTEGER,
            int2 INTEGER,
            int3 INTEGER,
            int4 INTEGER,
            int5 INTEGER
        )
    `);

    runQuery(`
        CREATE TABLE bets(
            userId INTEGER NOT NULL,
            drawId INTEGER NOT NULL,
            n1 INTEGER,
            n2 INTEGER,
            n3 INTEGER,
            PRIMARY KEY (userId, drawId)
        )
    `);


    //Inserimento utenti
    runQuery(`
        INSERT INTO users (username, name, surname, tokens, password, salt) VALUES 
        ('user1', 'Mario', 'Rossi', 100,'${hashedPassword1}', '${salt1}'),
        ('user2', 'Marco', 'Bianchi', 100, '${hashedPassword2}', '${salt2}'),
        ('user3', 'Giulio', 'Verdi', 100, '${hashedPassword3}', '${salt3}'),
        ('user4', 'Matteo', 'Aranci', 100, '${hashedPassword4}', '${salt4}'),
        ('user5', 'Luigi', 'Neri', 100, '${hashedPassword5}', '${salt5}');
    `);
});

db.close();