const express = require('express');
const bodyParser = require('body-parser');
const { Client } = require('pg');

const app = express();

app.set('port', process.env.PORT || 5000);
app.set('db', process.env.DATABASE_URL)

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
    'SELECT id, full_description__c, name, headline__c, brand__c, plateau_price__c, item_type__c, vendor_account__c FROM salesforce.product2 WHERE catalogs_included_in__c IS NOT NULL AND headline__c IS NOT NULL LIMIT 25', (error, results) => {
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