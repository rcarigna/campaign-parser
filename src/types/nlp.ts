// Compromise.js type definitions for NLP entity extraction

export type CompromiseDocument = {
    text(): string;
    people(): CompromiseCollection;
    places(): CompromiseCollection;
    sentences(): CompromiseCollection;
    match(pattern: string): CompromiseCollection;
};

export type CompromiseCollection = {
    out(format: 'text' | 'array'): string | string[];
    filter(predicate: (sentence: CompromiseSentence) => boolean): CompromiseCollection;
};

export type CompromiseSentence = {
    text(): string;
};