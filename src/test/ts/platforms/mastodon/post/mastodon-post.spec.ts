import { mastodon } from "masto";
import { UserAccountProfile } from "../../../../../main/ts/api/account/user-account-profile";
import { MastodonPost } from "../../../../../main/ts/platforms/mastodon/post/mastodon-post";
import simplePost from "./files/simple-post.json";

const VIEWER_ACCOUNT_ID = "1";
const VIEWER: UserAccountProfile = {
    id: "1",
    accountId: VIEWER_ACCOUNT_ID,
    avatarUrl: undefined,
    displayName: undefined,
    handle: "handle",
    rawHandle: "handle"
};

const SIMPLE_POST = simplePost as mastodon.v1.Status;

describe("Testing MastodonPost...", () => {
    beforeAll(() => {});
    beforeEach(() => {});
    afterAll(() => {});
    afterEach(() => {});

    test("Constructor doesn't error.",  () => {
        expect(() => new MastodonPost(SIMPLE_POST, VIEWER, VIEWER_ACCOUNT_ID)).not.toThrow();
    });

    test("Constructor assigns things.", () => {
        const post = new MastodonPost(SIMPLE_POST, VIEWER, VIEWER_ACCOUNT_ID);
        expect(post.getRaw()).toBe(SIMPLE_POST);
        expect(post.getViewer()).toBe(VIEWER);
        expect(post.getViewerAccountId()).toBe(VIEWER_ACCOUNT_ID);

        expect(post.isRetweet()).toBe(false);
    });


    test.each`
        functionName                        | expected
        ${"getId"}                          | ${"115257158552139711"}
        ${"getCid"}                         | ${""}
        ${"getUrl"}                         | ${"https://beige.party/@Nerde/115257158524558116"}
        ${"hasViewerRetweeted"}             | ${false}
        ${"getPosterAvatarUrl"}             | ${"https://social-cdn.vivaldi.net/system/cache/accounts/avatars/113/556/502/991/636/762/original/a95ae3be3b8f0576.jpeg"}
        ${"getPosterDisplayName"}           | ${"Stanley Nerdlinger II"}
        ${"getPosterHandle"}                | ${"Nerde@beige.party"}
        ${"getPosterService"}               | ${"Mastodon"}
        ${"getPosterUrl"}                   | ${"https://beige.party/@Nerde"}
        ${"isMe"}                           | ${false}
        ${"isRetweetedByMe"}                | ${false}
        ${"getTimestamp"}                   | ${new Date("2025-09-24T03:31:09.000Z")}
        ${"getPostText"}                    | ${"<p>There must be 3 or 4 Disney/Hulu ads every break in this show I’m watching on ID. 🤔</p>"}
        ${"getLinkCard"}                    | ${undefined}
        ${"getImages"}                      | ${[]}
        ${"getAnimatedImages"}              | ${[]}
        ${"getVideos"}                      | ${[]}
        ${"isReply"}                        | ${false}
        ${"getRepliedTo"}                   | ${undefined}
        ${"getRepliedToUrl"}                | ${undefined}
        ${"isRepliedToMutual"}              | ${true}
        ${"isQuoteTweet"}                   | ${false}
        ${"getQuoteTweet"}                  | ${undefined}
        ${"isRabbitHole"}                   | ${false}
        ${"getRabbitHoleUrl"}               | ${undefined}
        ${"isRetweet"}                      | ${false}
        ${"getRetweet"}                     | ${undefined}
    `(`$functionName() doesn't throw an exception and returns expected value.`, ({functionName, expected}: {functionName: string, expected: any}) => {
        const post = new MastodonPost(SIMPLE_POST, VIEWER, VIEWER_ACCOUNT_ID);

        // @ts-ignore
        expect(() => post[`${functionName}`]()).not.toThrow();
        // @ts-ignore
        expect(post[`${functionName}`]()).toStrictEqual(expected);
    });
});
