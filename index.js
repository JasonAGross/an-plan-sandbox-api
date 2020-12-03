var express = require('express');
var bodyParser = require('body-parser');
var pg = require('pg');

var app = express();

app.set('port', process.env.PORT || 5000);

app.use(express.static('public'));
app.use(bodyParser.json());

const pool = new pg.Pool();

app.get('/products', (req, res) => {
  res.send('hello, from express');
  try {
    pool.connect(process.env.DATABASE_URL, (err, client, done) => {
      if (err) {
        done();
        console.log('something bad happened', err);
      }
      console.log('connection happened?');
      client.query(
        'SELECT id, full_description__c, name, catalog_level__c, headline__c FROM salesforce.product2 WHERE catalog_level__c IS NOT NULL AND full_description__c IS NOT NULL AND headline__c IS NOT NULL LIMIT 25', (error, results) => {
          console.log('db result', results);
          done();
          if (error) {
            console.log(error);
            res.status(400).send(error);
          }
          res.status(200).json(results.rows);
        }
      )
    })
  } catch (error) {
    console.log(error);
  }
});

app.listen(app.get('port'), () => {
  console.log(`node app listening on port ${app.get('port')}`);
});