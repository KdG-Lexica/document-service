import mongoose from 'mongoose';

const legacySchema = new mongoose.Schema({
    xlarge: String,
    xlargewidth: Number,
    xlargeheight: Number
});

const multimediaSchema = new mongoose.Schema({
    rank: Number,
    subtype: String,
    caption: String,
    credit: String,
    type: String,
    url: String,
    height: Number,
    width: Number,
    legacy: legacySchema,
    subType: String,
    crop_name: String
});

const headlineSchema = new mongoose.Schema({
    main: String,
    kicker: String,
    content_kicker: String,
    print_headline: String,
    name: String,
    seo: String,
    sub: String
});

const keywordSchema = new mongoose.Schema({
    name: String,
    value: String,
    rank: Number,
    major: String,
});

const personSchema = new mongoose.Schema({
    firstname: String,
    middleName: String,
    lastname: String,
    qualifier: String,
    title: String,
    role: String,
    organization: String,
    rank: Number
});

const bylineSchema = new mongoose.Schema({
    original: String,
    person: personSchema,
    organization: String
});

const articleSchema = new mongoose.Schema({
    _id: mongoose.Types.ObjectId,
    web_url: String,
    snippet: String,
    print_page: Number,
    source: String,
    multimedia: multimediaSchema,
    headline: headlineSchema,
    keywords: keywordSchema,
    pub_date: Date,
    document_type: String,
    news_desk: String,
    byline: bylineSchema,
    type_of_material: String,
    word_count: Number,
    score: Number,
    uri: String,
    text: String,
    '3d': [String],
    '768d': [String]
});

const Article = mongoose.model('embeddings', articleSchema);
export default Article;