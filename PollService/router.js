import express from 'express';

const router = express.Router();

const polls = [
  {
    id: 1,
    question: "What is your favorite programming language?",
    options: [
      { id: 1, text: "JavaScript", votes: 5 },
      { id: 2, text: "Python", votes: 1 },
      { id: 3, text: "Java", votes: 7 },
      { id: 4, text: "C++", votes: 3 }
    ]
  },
  {
    id: 2,
    question: "Which frontend framework do you prefer?",
    options: [
      { id: 1, text: "React", votes: 0 },
      { id: 2, text: "Vue", votes: 6 },
      { id: 3, text: "Angular", votes: 4 }
    ]
  }
];

router.get('/polls',(req,res) => {
    try {
        const formattedPolls = polls.map((poll) => ({
            ...poll,
            options: poll.options.map((option) => ({
                ...option,
                responseCounts: option.votes
            }))
        }))
        if(!formattedPolls){
            return res.status(404);
        }
        return res.json({message:"Polls retrieved successfully"});
    } catch (error) {
        return res.status(500);
    }
})

router.get('/polls/:id',(req,res)=>{
    const {id} = req.params;
    const found = polls.find(poll => poll.id === Number(id))
    if(!found){
        return res.status(404).json({message:"Poll not found"});
    }
    return res.json({poll: found});
})

router.post('/vote',(req,res) => {
    const {pollId, optionId} = req.query;
    if(!pollId || !optionId){
        return res.status(400).json({message: "pollId and optionId are required"});
    }

    const poll = polls.find((p) => p.id === Number(pollId));
    if(!poll){
        return res.status(404).json({message: "Poll not found"});
    }
    const option = poll.options.find((o) => o.id === Number(optionId))
    if(!option){
        return res.status(400).json({message:"Invalid option"});
    }
    option.votes = option.votes+1;
    return res.status(200).json({
        pollId: poll.id,
        optionId: option.id,
        responseCounts: option.votes
    })
})

router.get('/polls/:id/results',(req,res) => {
    const {id} = req.params;
    const poll = polls.find(p => p.id === Number(id));
     if (!poll) {
        return res.status(404).json({
            message: "Poll not found"
        });
    }
    const responseCounts = poll.options.reduce((acc,option) => acc+option.votes, 0);

    const results = poll.options.map((po => ({
        optionId: po.id,
        option: po.text,
        responseCount: po.votes

    })))

    return res.status(200).json({
        pollId: poll.id,
        question: poll.question,
        responseCount: responseCounts,
        results
    })
})

export default router;