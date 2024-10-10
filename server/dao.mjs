import {db} from "./db.mjs";
import crypto from "crypto";

const generateRandomNumbers = () => {
  const numbers = new Set(); 
  while (numbers.size < 5) {
    const randomNumber = Math.floor(Math.random() * 90) + 1;
    numbers.add(randomNumber);
  }
  return Array.from(numbers);
};

export default function Dao(){
  
  this.getUser = (username, password) => {
          return new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM users WHERE username = ?';
            db.get(sql, [username], (err, row) => {
              if (err) { 
                reject(err); 
              }
              else if (row === undefined) { 
                resolve(false); 
              }
              else {
                const user = {id: row.id, username: row.username, name: row.name, surname: row.surname, tokens: row.tokens};
                
                crypto.scrypt(password, row.salt, 16, function(err, hashedPassword) {
                  if (err) reject(err);
                  if(!crypto.timingSafeEqual(Buffer.from(row.password, 'hex'), hashedPassword))
                    resolve(false);
                  else
                    resolve(user);
                });
              }
            });
          });
  };

  this.addDraw = () =>{
    return new Promise((resolve, reject) => {
      const numbers = generateRandomNumbers();
      const sql = `INSERT INTO draws (int1, int2, int3, int4, int5) VALUES (?, ?, ?, ?, ?)`;

      db.run(sql, numbers, (err) => {
        if (err) {
          reject(err)
        }
        resolve()
      });
    })
  }

  this.getLastDraw = () => {
    return new Promise((resolve, reject) => {
      const sql = `SELECT id,timestamp,int1, int2, int3, int4, int5 FROM draws ORDER BY id DESC LIMIT 1`;

      db.get(sql, (err, row) => {
        if (err) {
          reject(err);
        } if (!row) {
          resolve({
            id: 0,
            timestamp: null,
            int1: null,
            int2: null,
            int3: null,
            int4: null,
            int5: null
          });
        } else {
          resolve(row);
        }
      });
    });
  };

  this.clearDraws = () => {
    return new Promise((resolve, reject) => {
      const deleteSql = 'DELETE FROM draws';
  
      db.run(deleteSql, (err) => {
        if (err) {
          reject(err);
        } else {
          const resetSql = "DELETE FROM sqlite_sequence WHERE name='draws'";

          db.run(resetSql, (err) => {
            if (err) {
              return reject(err);
            }
    
            resolve();
          });
        }
      });
    });
  };

  this.getUserTokens =(id) =>{
    return new Promise((resolve, reject) => {
      const sql = `SELECT tokens FROM users WHERE id = ?`;

      db.get(sql,[id], (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(row);
        }
      });
    });
  }

  this.updateUserTokens =(id,tokens) =>{
    return new Promise((resolve, reject) => {
      const sql = `UPDATE users SET tokens = ? WHERE id = ?`; 
  
      db.run(sql, [tokens, id], function(err) {
        if (err) {
          console.log(err);
          reject(err); 
        }
        resolve();
      });
    });
  }

  this.top3Users = () =>{
    return new Promise((resolve, reject) => {
      const sql = `SELECT id, name, surname, tokens FROM users ORDER BY tokens DESC LIMIT 3`;
  
      db.all(sql, [], (err, rows) => {
        if (err) {
          return reject(err);
        }
        
        resolve(rows);
      });
    });
  }

  this.addBet = (userId,drawId,n1,n2,n3) =>{
    return new Promise((resolve, reject) => {
      const sql = `
        INSERT INTO bets (userId, drawId, n1, n2, n3)
        VALUES (?, ?, ?, ?, ?)
      `;
  
      db.run(sql, [userId, drawId, n1, n2, n3], function(err) {
        if (err) {
          return reject(err); 
        }
        resolve(); 
      });
    });
  }

  this.getBet = (userId, drawId) => {
    return new Promise((resolve, reject) => {
      const sql = `SELECT n1, n2, n3 FROM bets WHERE userId = ? AND drawId = ?`;
  
      db.get(sql, [userId, drawId], (err, row) => {
        if (err) {
          reject(err); 
        } else {
          if (row) {
            resolve(row);
          } else {
            resolve(null);
          }
        }
      });
    });
  };

  this.getBets = (drawId) => {
    return new Promise((resolve, reject) => {
      const sql = `SELECT userId, n1, n2, n3 FROM bets WHERE  drawId = ?`;
  
      db.all(sql, [drawId], (err, row) => {
        if (err) {
          reject(err); 
        } else {
          resolve(row);
        }
      });
    });
  };

  this.clearBets = () => {
    return new Promise((resolve, reject) => {
      const deleteSql = 'DELETE FROM bets';
  
      db.run(deleteSql, (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  };

  this.updateUserTokens()
}