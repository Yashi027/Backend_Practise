import express from 'express';

const router = express.Router();

const validStatuses = ["pending", "in-progress", "completed"];
const tasks = [];
let nextId = 1;

router.get('/', (req, res) => {
    return res.status(200).json(tasks)
})

router.post('/', (req, res) => {
    const { title, status } = req.body;
    if (!title || !status || title.trim() === "" || status.trim() === "" || !validStatuses.includes(status)) {
        return res.status(400).json({ message: "Please provide valid tasks details" });
    }
    const task = {
        id: nextId++,
        title: title,
        status: status
    }
    tasks.push(task);
    return res.status(200).json(task)
})

router.patch('/:id', (req, res) => {
    const id = Number(req.params.id);
    const { title, status } = req.body;

    const task = tasks.find(t => t.id === id);
    if (!task) {
        return res.status(404).json({ message: "Task not found" });
    }
    if (title) {
        task.title = title;
    }
    if (status) {
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ message: "Please provide valid tasks details" });
        }
        task.status = status;
    }
    return res.status(200).json(task);
})

router.delete('/:id', (req, res) => {
    const id = Number(req.params.id);
    const task = tasks.findIndex(t => t.id === id);
    if (task == -1) {
        return res.status(404).json({ message: "Task not found" });
    }
    const deletedTask = tasks.splice(task, 1)[0];
    return res.status(200).json({ message: "Successfully removed" , deletedTask});
})

router.get('/status/:status', (req, res) => {
    const { status } = req.params;
    const task = tasks.filter(t => t.status.toLowerCase() === status.toLowerCase());
    if (!task) {
        return res.status(404).json({ message: "Task not found" });
    }
    return res.json(task);
})

export default router;