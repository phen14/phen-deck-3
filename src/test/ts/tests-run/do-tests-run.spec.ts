test('adds 1 + 2 to be 3', () => {
    expect(1 + 2).toBe(3);
});

test('adds 1 + 2 to equal 3', () => {
    expect(1 + 2).toEqual(3);
});

test('adds 1 + 2 to not equal 4', () => {
    expect(1 + 2).not.toEqual(4);
});


test('throw an error', () => {
    expect(() => { throw new Error(); }).toThrow();
});

test('adds 1 + 2 to not throw', () => {
    expect(() => { return 1 + 2; }).not.toThrow();
});
