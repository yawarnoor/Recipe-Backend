const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const recipeSchema = new Schema(
    {
        name: { type: String, required: true },
        chef: { type: String, required: true },
        desc: { type: String, required: true },
        file: {type: String, required: false}
    }, {timestamps: true}
);

const recipe = mongoose.model('recipe' , recipeSchema);
module.exports = recipe;