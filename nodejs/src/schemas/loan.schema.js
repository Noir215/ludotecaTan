import mongoose from "mongoose";
const { Schema, model } = mongoose;
import normalize from 'normalize-mongoose';
import mongoosePaginate from "mongoose-paginate-v2";

const loanSchema = new Schema({
    game: {
        type: Schema.Types.ObjectId,
        ref: 'Game',
        required: true
    },
    client: {
        type: Schema.Types.ObjectId,
        ref: 'Client',
        required: true
    },
    loanDate: {
        type: String,
        required: true
    },
    returnDate: {
        type: String,
        required: true
    }
});

loanSchema.plugin(normalize);
loanSchema.plugin(mongoosePaginate);

const LoanModel = model('Loan', loanSchema);

export default LoanModel;