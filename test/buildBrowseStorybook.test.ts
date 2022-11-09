import { parseDevOutput } from '../src/startStorybook';

describe('parseDevOutput', () => {
  it('no match', () => {
    expect(parseDevOutput('')).toBeUndefined();
  });

  it('preview only', () => {
    expect(parseDevOutput('│   8.86 s for preview       │')).toMatchInlineSnapshot(`
      Object {
        "manager": 0,
        "preview": 8860000000,
      }
    `);
  });
  it('manager + preview', () => {
    expect(parseDevOutput('│   8.42 s for manager and 8.86 s for preview       │')).toMatchInlineSnapshot(`
      Object {
        "manager": 8420000000,
        "preview": 8860000000,
      }
    `);
  });

  it('milliseconds', () => {
    expect(parseDevOutput('│   880 ms for manager and 8.86 s for preview       │')).toMatchInlineSnapshot(`
      Object {
        "manager": 880000000,
        "preview": 8860000000,
      }
    `);
  });
});
