import { Router } from "express";
import { check } from "express-validator";
import validateFields from "../middlewares/validateFields.js";
import { createLoan, getLoans, updateLoan, deleteLoan, getLoansPageable } from "../controllers/loan.controller.js";
const loanRouter = Router();

loanRouter.put('/:id', [
    check('game.id').not().isEmpty(),
    check('client.id').not().isEmpty(),
    check('loanDate').not().isEmpty(),
    check('returnDate').not().isEmpty(),
    validateFields
], updateLoan);

loanRouter.put('/', [
    check('game.id').not().isEmpty(),
    check('client.id').not().isEmpty(),
    check('loanDate').not().isEmpty(),
    check('returnDate').not().isEmpty(),
    validateFields
], createLoan);

loanRouter.post('/', [
    check('pageable').not().isEmpty(),
    check('pageable.pageSize').not().isEmpty(),
    check('pageable.pageNumber').not().isEmpty(),
    validateFields
], getLoansPageable);

loanRouter.get('/', getLoans);
loanRouter.get('/:query', getLoans);
loanRouter.delete('/:id', deleteLoan);

export default loanRouter;