import express from 'express';
import router from './router.js';

const app = express();

app.use(express.json())
app.use('/api/expenses',router)

const PORT = 8000;

app.listen(PORT, () => {
    console.log("Server started");
})