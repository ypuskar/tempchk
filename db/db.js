const  pg  = require('pg');

var pool = new pg.Pool({
    port: 5432,
    user: 'pi',
    password: 'ReheAhi1965',
    database: 'pi',
    max: 10,
    host: '192.168.1.43'
});
module.exports = {
    query: async function(statement, binds = []) {
      try {
        const client = await pool.connect();
       // console.log('query statement ', client);
   
               const start = Date.now();
   
                  
               const result  = await client.query(statement, binds);
   
               const duration = Date.now() - start;
   
               //console.log('executed query', { statement, duration, rows:  result});
              client.release();
              return result
   
      } catch(e) {
          //console.error('services/database/simpleExecute',e);
          throw new Error(`DB PROBLEM! ${e}`);
      }
    },
    getClient: (callback) => {
      pool.connect((err, client, done) => {
        const query = client.query.bind(client)
  
        // monkey patch the query method to keep track of the last query executed
        client.query = () => {
          client.lastQuery = arguments
          client.query.apply(client, arguments)
        }
  
        // set a timeout of 5 seconds, after which we will log this client's last query
        const timeout = setTimeout(() => {
          console.error('A client has been checked out for more than 5 seconds!')
          console.error(`The last executed query on this client was: ${client.lastQuery}`)
        }, 5000)
  
        const release = (err) => {
          // call the actual 'done' method, returning this client to the pool
          done(err)
  
          // clear our timeout
          clearTimeout(timeout)
  
          // set the query method back to its old un-monkey-patched version
          client.query = query
        }
  
        callback(err, client, done)
      })
    }
  }


/*
exports.execSql = (sqlstatement, tempValues, callback) => {
    pool.on('error', (err, client) => {
        console.error('Unexpected error on idle client', err)
        process.exit(-1)
    });

    pool.connect((err, db, done) => {
  
    if(err) {
        return console.log(err);
    } else {
        //console.log(tempValues);
        db.query(sqlstatement, tempValues, (err, table) => {
            done();
            if(err) {
                console.log(err);
            } else {
                console.log(table.rows);
                //db.end();
            }
        });
    }
    })
}
*/