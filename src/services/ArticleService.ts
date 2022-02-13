import { Mongoose } from "mongoose";
import Article from "../models/articles";

export const getFirstArticles = (amount: number) => {
    return Article.find().limit(10).exec();
}
