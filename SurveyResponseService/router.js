import express from 'express';

const router = express();

const questions = [
    {
        id: "q1",
        question: "How satisfied are you with our service?",
        choices: ["Very Satisfied", "Satisfied", "Neutral", "Dissatisfied", "Very Dissatisfied"]
    },
    {
        id: "q2",
        question: "How easy was it to use our service?",
        choices: ["Very Easy", "Easy", "Neutral", "Difficult", "Very Difficult"]
    },
    {
        id: "q3",
        question: "Would you recommend our service?",
        choices: ["Definitely", "Probably", "Not Sure", "Probably Not", "Definitely Not"]
    }
];

const users = [];

router.get('/questions', (req, res) => {
    return res.json({ questions: questions });
})

router.post('/feedback', (req, res) => {
    const { userId, responses } = req.body;
    if (!userId || !responses || responses.length === 0) {
        return res.status(400).json({ message: "Please provide valid feedback" });
    }
    for (const response of responses) {
        const question = questions.find(q => q.id === response.questionId)
        if (!question) {
            return res.status(404).json({ message: "Please provide valid feedback" });
        }
        if (!question.choices.includes(response.selectedOption)) {
            return res.status(404).json({ message: "Please provide valid feedback" });
        }
    }
    users.push({
        userId: userId,
        responses: responses
    })
    return res.status(200).json({ message: "Feedback submitted" })
})

router.get('/feedback/summary', (req, res) => {
    try {
        const summary = {};
        questions.forEach(question => {
            summary[question.id] = {};
            question.choices.forEach(c => {
                summary[question.id][c] = 0;
            })
        })

        users.forEach(user => {
            user.responses.forEach(r => {
                const questionSummary = summary[r.questionId]
                if (questionSummary) {
                    questionSummary[r.selectedOption]++;
                }
            })
        })
        return res.status(200).json(summary);
    } catch (error) {
        return res.status(500).json({ message: "Something went wrong" })
    }
})

router.get('/feedback/:userId', (req, res) => {
    try {
        const userId = Number(req.params.userId);
        const user = users.find(u => u.userId === userId)
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        return res.status(200).json(user.responses);
    } catch (error) {
        return res.status(500).json({ message: "Something went wrong" })
    }
})



export default router;