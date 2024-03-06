const Goals = require('../model/goalModel');
const mongoose = require('mongoose');

// Creating a new goal
const createGoal = async (req, res) => {
    try {
        // Initializing the template for the creation of goals
        const { title, description, completed } = req.body;
        const goalExists = await Goals.findOne({ title: title }); // The title will be the indicator as we set it as unique

        // Validating if the goal already exists
        if (goalExists) {
            return res.status(409).json({ error: 'Goal already exists' });
        }

        // The template for creating goals
        const goal = await Goals.create({
            title: title,
            description: description,
            completed: completed,
        });

        // Returning the goal if it is successfully created
        if (goal) {
            return res.status(201).json({
                _id: goal.id,
                title: goal.title,
                description: goal.notes,
                completed: goal.completed,
            });
        } else {
            // If there's an error, an error message will be retrieved
            return res.status(400).json({ error: 'Invalid Goal Retrieval' });
        }
    } catch (error) {
        res.status(500).json({
            error: error.message,
            stack: error.stack,
        });
    }
};

// Getting all the goals
const getAllGoals = async (req, res) => {
    // Retrieval of all goals, disregarding the dates of each creation and updates
    const goals = await Goals.find({}).select('-createdAt -updatedAt -__v').sort({ createdAt: -1 });
    return res.status(200).json(goals);
};

// Getting a specific goal
const getSpecificGoal = async (req, res) => {
    const { id } = req.params; // Retrieving the specific goal through id

    // Setting what to retrieve
    const specificGoal = await Goals.findByIdAndUpdate(
        id,
        { ...req.body },
        { new: true, select: '-createdAt -updatedAt -__v' }
    );

    if (!specificGoal) {
        return res.status(404).json({ error: 'Non-existent Goal' }); // Validation if there's an existing goal that wants to be retrieved
    }

    return res.status(200).json(specificGoal);
};

// Updating goals
const updateGoal = async (req, res) => {
    // Updating a specific goal through id
    const { id } = req.params;

    // Validation if there's a specific goal existing that wants to be updated
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: 'Non-existent Goal' });
    }

    // Setting the update of a specific goal
    const updatedGoal = await Goals.findOneAndUpdate({ _id: id }, { ...req.body }, { new: true });

    if (!updatedGoal) {
        return res.status(400).json({ error: 'Non-existent Goal' });
    }

    // Check if the 'completed' field is updated to true
    if (updatedGoal.completed === true) {
        return res.status(200).json({ message: 'Congratulations! You freaking did it!' });
    } else {
        return res.status(200).json(updatedGoal);
    }
};


// Deleting goals
const deleteGoal = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ error: 'Non-existent Goal' });
        }

        // Specific function for deletion
        const deletedGoal = await Goals.findOneAndDelete({ _id: id });

        // A message for delete confirmation
        return res.status(200).json({ message: 'Goal Successfully Deleted' });

        // Check if there is an existing goal
        if (!deletedGoal) {
            return res.status(400).json({ error: 'No such Goal' });
        }
    } catch (error) {
        res.status(500).json({
            error: error.message,
            stack: error.stack,
        });
    }
};

// Exporting all the functions
module.exports = { createGoal, getAllGoals, updateGoal, deleteGoal, getSpecificGoal };
