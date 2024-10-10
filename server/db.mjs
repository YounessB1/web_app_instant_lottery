import sqlite from 'sqlite3'

export const db = new sqlite.Database("database.sqlite", (err) => {
    if (err) throw err
    db.run("PRAGMA foreign_keys = ON")
})

export function runQuery(query) {
    db.run(query, function(err) {
        if (err) {
            console.error(`Failed query: \n${query}\n${err.message}\n`);
        }
    });
}