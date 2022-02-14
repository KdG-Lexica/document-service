import DocumentType from "../dtos/document";
import Article from "../models/articles";

export const getFirstArticles = async (amount: number) => {
    const articles = await Article.find().select('pub_date 3d headline.main').limit(amount).exec();
    return articles.map((a: any) => {
        return { id: a._id, date: new Date(a.pub_date), name: a.headline.main, vector3: { x: a['3d'][0], y: a['3d'][1], z: a['3d'][2] } } as DocumentType
    })
}

export const getArticleById = (id: string) => {
    return Article.findById(id).exec();
}
