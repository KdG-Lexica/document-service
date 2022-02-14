import { ObjectId } from "mongodb";
import { Mongoose } from "mongoose";
import Article from "../models/articles";

export const getFirstArticles = (amount: number) => {
    return Article.find().select('pub_date 3d headline.main').limit(amount).exec();
    // return Article.find().limit(amount).exec();
}

export const getArticleById = (id: string) => {
    return Article.findById(id).exec();
}
