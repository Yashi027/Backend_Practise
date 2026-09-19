import express from 'express';

const router = express.Router();

let expenses = [];
let nextId = 1;

router.get('/', (req, res) => {
    return res.json(expenses)
})

router.post('/', (req, res) => {
    const { title, amount, category } = req.body;
    if (!title || !amount || !category || title.trim() === "" || category.trim() === "" || Number(amount) <= 0) {
        return res.status(400).json({ message: "Please provide valid expense details" });
    }
    const expense = {
        id: nextId,
        title: title,
        category: category,
        amount: Number(amount)
    }
    expenses.push(expense);
    nextId++;
    return res.status(200).json(expenses);
})

router.get('/category/:category', (req, res) => {
    const { category } = req.params;
    if (!category) {
        return res.status(400);
    }
    const required = expenses.filter(e => e.category.toLowerCase() === category.toLowerCase());
    if (!required)
        return res.status(404);
    return res.status(200).json(required)
})

router.get('/summary', (req, res) => {
    const numberOfExpenses = expenses.length;
    const total = expenses.reduce((acc, expense) => acc + expense.amount, 0);
    return res.status(200).json({ numberOfExpenses: numberOfExpenses, total: total })
})

router.delete('/:id', (req, res) => {
    const { id } = req.params;
    if (!id) {
        return res.status(400).json({ message: "Please provide valid details" });
    }
    const expense = expenses.findIndex((e) => e.id === Number(id));

    if (expense == -1) {
        return res.status(404).json({ message: "Expense not found" });
    }
    expenses.splice(expense, 1);
    return res.json({ message: "Deleted successfully" });
})



export default router;