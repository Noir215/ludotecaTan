import { SortPage } from "./SortPage";

export class Pageable {
    [x: string]: any;
    pageNumber: number;
    pageSize: number;
    sort: SortPage[];
}