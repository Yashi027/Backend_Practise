import express from 'express';
import router from './route.js';

const app = express();

app.use(express.json());
app.use('/api',router)

const PORT = 8000;

app.listen(PORT, () => {
    console.log("Server started");
})