const express = require('express');
const bodyParser = require('body-parser');
const { Client } = require('pg');

const app = express();

app.set('port', process.env.PORT || 5000);
app.set('db', process.env.DATABASE_URL || 'postgres://gmmlykhtfjzplo:a0610968434ec4984369ad573a2e374cff4738be2285a87a4b3260aecdd56c9b@ec2-54-158-222-248.compute-1.amazonaws.com:5432/d8ejhm74jmjt8a')

app.use(express.static('public'));
app.use(bodyParser.json());

const client = new Client({
  connectionString: app.get('db'),
  ssl: {
    rejectUnauthorized: false
  }
});

app.get('/products', (req, res) => {
  client.connect();

  client.query(
    'SELECT id, full_description__c, name, catalog_level__c, headline__c FROM salesforce.product2 WHERE catalog_level__c IS NOT NULL AND full_description__c IS NOT NULL AND headline__c IS NOT NULL LIMIT 25', (error, results) => {
      if (error) {
        return res.status(400).send(error);
      }
      res.status(200).json(results.rows);
    }
  );
});

app.listen(app.get('port'), () => {
  console.log(`node app listening on port ${app.get('port')}`);
});