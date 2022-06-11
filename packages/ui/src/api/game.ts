import { githubApi, githubRaw } from '../shared/axios';

const getGithubFile = async (
    githubUser: string,
    githubRepo: string,
    version: string,
    file: string,
): Promise<any> =>
    await githubRaw.get(`/${githubUser}/${githubRepo}/${version}/${file}`);

const getGithubGamemodeDetails = async (
    githubUser: string,
    githubRepo: string,
    version: string,
): Promise<any> =>
    await getGithubFile(githubUser, githubRepo, version, `game.JSON`);

const getGithubLibFile = async (
    githubUser: string,
    githubRepo: string,
    version: string,
): Promise<any> =>
    await getGithubFile(githubUser, githubRepo, version, `src/lib.js`);

const getGithubFileStructure = async (
    githubUser: string,
    githubRepo: string,
    version: string,
): Promise<{ data: { tree: [{ path: string }] } }> =>
    await githubApi.get(
        `/repos/${githubUser}/${githubRepo}/git/trees/${version}?recursive=1`,
    );

export const getGamemodeDetails = async () => ({
    name: `Story Points`,
    description: `A voting system for agile story points`,
    githubUser: `open-box-io`,
    githubRepo: `story-points`,
    latestVersion: `b27f95858b2f06dec8170bd83452b0209a5bada3`,
    latestVerifiedVersion: undefined,
});

export const getGamemode = async (
    githubUser: string,
    githubRepo: string,
    version: string,
): Promise<any> => {
    console.log(`here`);
    const filesPromise = getGithubFileStructure(
        githubUser,
        githubRepo,
        version,
    );

    const detailsPromise = getGithubGamemodeDetails(
        githubUser,
        githubRepo,
        version,
    );

    const libPromise = getGithubLibFile(githubUser, githubRepo, version);

    const files = await filesPromise;

    const phasePaths = files.data.tree
        .map((file) => file.path)
        .filter((path) => path.startsWith(`src/phases/`));

    const phasesCodePromise = Promise.all(
        phasePaths.map((path) =>
            getGithubFile(githubUser, githubRepo, version, path),
        ),
    );

    const details = (await detailsPromise).data;
    const lib = (await libPromise).data;
    const phasesCode = await phasesCodePromise;

    const phases = phasePaths.map((path, i) => {
        const name = path.match(/src\/phases\/(.*)\.js/);
        return {
            phaseName: name ? name[1] : undefined,
            code: phasesCode[i].data,
        };
    });

    const game = {
        initialPhaseName: details.initialPhaseName,
        sharedCode: lib,
        phases,
    };

    console.log(`GAME`, game);

    return game;
};
