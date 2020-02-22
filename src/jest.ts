import { cleanup } from "@marko/testing-library";
import { findProjectFixtures, defaultNormalizer } from "./";
import { toMatchFile } from "jest-file-snapshot";

expect.extend({ toMatchFile });

export default function snapshotComponentFixtures(
  path: string,
  { normalize = defaultNormalizer, ...otherOptions } = {}
) {
  findProjectFixtures(path, otherOptions).forEach(component => {
    describe(component.name, () => {
      beforeAll(cleanup);
      afterEach(cleanup);
      Object.keys(component.fixtures).forEach(name => {
        it(name, async () => {
          const fixture = component.fixtures[name];
          expect(await fixture.toString(normalize)).toMatchFile(
            fixture.path.replace(fixture.ext, ".html")
          );
        });
      });
    });
  });
}
