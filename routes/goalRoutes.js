const router = require('express').Router();

const { createGoal, getAllGoals, getSpecificGoal, deleteGoal, updateGoal } = require('../controllers/goalControllers');

router.post('/create', createGoal); // Route for creating goals
router.get('/all', getAllGoals); // Route for retrieving all goals
router.get('/specific/:id', getSpecificGoal); // Route for retrieving specific goals
router.put('/update/:id', updateGoal); // Route for updating goals
router.delete('/delete/:id', deleteGoal); // Route for deleting goals

module.exports = router;
