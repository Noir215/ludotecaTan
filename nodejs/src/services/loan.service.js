import LoanModel from "../schemas/loan.schema.js";
import { getClientById } from "./client.service.js"
import { getGameById } from "./game.service.js";

export const getLoans = async (game, client, loanDate) => {
    try {
        let find = {};
        if (game && loanDate && client) {
            const find = { $and: [{ loanDate: loanDate }, { game: game }, {client, client}] };
        } else if (loanDate) {
            const find = { loanDate: loanDate };
        } else if (game) {
            const find = { game: game };
        } else if (client) {
            const find = { client: client }
        }

        return await LoanModel.find(find).sort('id').populate('game').populate('client');
    } catch (e) {
        throw Error('Error fetching loans');
    }
}

export const createLoan = async (data) => {
    try {
        const game = await getGameById(data.game.id);
        if (!game) {
            throw Error ('There is no game with that id');
        }

        const client = await getClientById(data.client.id);
        if (!client) {
            throw Error ('There is no client with that id');
        }

        const loansInTotal = await LoanModel.find({
            client: data.client.id,
            returnDate: { $gt: data.loanDate },
            loanDate: { $lte: data.loanDate }
        });
        
        if (loansInTotal.length >= 2) {
            throw Error ('The client has two games assigned in the loan date');
        }

        const gameLoans = await LoanModel.find({
            game: data.game.id,
            returnDate: { $gt: data.loanDate },
            loanDate: { $lte: data.loanDate }
        });

        if (gameLoans.length >= 1) {
            throw Error('This game is already loaned');
        }

        const loan = new LoanModel({
            game: data.game.id,
            client: data.client.id,
            loanDate: data.loanDate,
            returnDate: data.returnDate,
        });

        return await loan.save();
    } catch (e) {
        throw Error (e);
    }
}

export const updateLoan = async (id, data) => {
    try {
        const loan = await LoanModel.findById(id);
        if (!loan) {
            throw Error('There is no loan with that id');
        }

        const game = await getGameById(data.game.id);
        if (!game) {
            throw Error('There is no game with that id');
        }

        const client = await getClientById(data.client.id);
        if (!client) {
            throw Error('There is no client with that id');
        }

        const loanToUpdate = {
            ...data,
            game: data.game.id,
            client: data.client.id,
        };
        return await LoanModel.findByIdAndUpdate(id, loanToUpdate, {new: false});
    } catch  (e) {
        throw Error(e);
    }
}

export const getLoan = async (field) => {
    try {
        return await LoanModel.find(field);
    }
    catch (e) {
        throw Error ('Error fetching loan');
    }
}

export const deleteLoan = async (id) => {
    try {
        return await LoanModel.findByIdAndDelete(id)
    } catch (e) {
        throw Error(e)
    }
}

export const getLoansPageable = async (page, limit, sort, title, client, loandate) => {
    const sortObj = {
        [sort?.property || 'loanDate']: sort?.direction === 'DESC' ? 'DESC' : 'ASC'
    };

    try {
        const query = {};
        if (title) {
            query.game = title;
        }
        if (client) {
            query.client = client;
        }
        if (loandate) {
            const isoDate = new Date(loandate).toISOString();
            query.loanDate = { $lt: isoDate };
            query.returnDate = { $gt: isoDate };
        }

        const options = {
            page: parseInt(page) + 1,
            limit,
            sort: sortObj,
            populate: ['game', 'client']
        };

        return await LoanModel.paginate(query, options);
    } catch (e) {
        throw Error('Error fetching loans page');
    }
}