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
    'SELECT id, full_description__c, name, catalog_level__c, headline__c, Brand__c, Plateau_Price__c, Item_Type__c, Vendor_Account__c FROM salesforce.product2 WHERE catalog_level__c IS NOT NULL AND full_description__c IS NOT NULL AND headline__c IS NOT NULL LIMIT 25', (error, results) => {
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