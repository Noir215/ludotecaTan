import CategoryModel from '../schemas/category.schema.js';
import { getGame } from './game.service.js';

export const createCategory = async function(name) {
    try {
        const category = new CategoryModel({ name });
        return await category.save();
    } catch (e) {
        throw Error('Error creating category');
    }
}

export const getCategories = async function () {
    try {
        return await CategoryModel.find().sort('name');
    } catch (e) {
        throw Error('Error fetching categories');
    }
}

export const updateCategory = async (id, name) => {
    try {
        const category = await CategoryModel.findById(id);
        if (!category) {
            throw Error('Theres is no category with than Id');
        }
        return await CategoryModel.findByIdAndUpdate(id, {name});
    } catch (e) {
        throw Error (e);
    }
}

export const deleteCategory = async (id) => {
    try {
        const category = await CategoryModel.findById(id);
        if (!category) {
            throw Error ('Theres is no category with that Id');
        }
        const games = await getGame({ category });
        if (games.length > 0) {
            throw 'There are games related to this category';
        }
        return await CategoryModel.findByIdAndDelete(id);
    }
    catch (e) {
        throw Error ('Error deleting category');
    }
}

export const getCategory = async (id) => {
    try {
        return await CategoryModel.findById(id);
    }
    catch (e) {
        throw Error('There is no category with that Id');
    }
}