import express from 'express';

const router = express.Router();

const candidates = [
    { id: 1, name: "Candidate A", votes: 1 },
    { id: 2, name: "Candidate B", votes: 3 },
    { id: 3, name: "Candidate C", votes: 6 }
];

router.get('/candidates', (req, res) => {
    return res.status(200).json({ candidates: candidates, message: "All candidates retrieved successfully" });
})

router.post('/vote', (req, res) => {
    const { candidateId } = req.body;
    if (!candidateId) {
        return res.status(400).json({ message: "candidateId is required" });
    }
    const candidate = candidates.find(c => c.id === Number(candidateId))
    if (!candidate) {
        return res.status(404).json({ message: "Candidate not found" });
    }
    candidate.votes++;
    return res.status(200).json({ message: "Voting cast successfull", candidate: candidate });
})

router.get('/result', (req, res) => {
    const result = candidates.map((c) => (
        {
            name: c.name,
            votes: c.votes
        }
    ))
    return res.status(200).json({ message: "Voting result", result });
})

export default router;