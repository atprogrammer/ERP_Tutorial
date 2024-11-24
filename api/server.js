const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');

const userController = require('./controllers/UserController');
const productTypeController = require('./controllers/ProductTypeController');

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

//Product type
app.post("/api/productType/create", productTypeController.create);
app.get("/api/productType/list", productTypeController.list);
app.put("/api/productType/update/:id", productTypeController.update);
app.delete("/api/productType/remove/:id", productTypeController.remove);

//User
app.post("/api/user/signIn",userController.signIn);
app.get("/api/user/info",userController.info);
app.put("/api/user/update", userController.update);


app.listen(3001,'0.0.0.0', () => {
    console.log('Server is running on port 3001');
});




