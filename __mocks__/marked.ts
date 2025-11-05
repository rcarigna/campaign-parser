export const marked = {
    parse: jest.fn((markdown: string) => Promise.resolve(`<p>${markdown}</p>`)),
};
