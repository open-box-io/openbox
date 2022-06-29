import {
    GamemodeVersion,
    Phase,
} from '@openbox/common/src/types/gamemodeTypes';
import { githubApi, githubRaw } from '../shared/axios';

const getGithubFile = async (
    githubUser: string,
    githubRepo: string,
    version: string,
    file: string,
): Promise<{ data: string }> =>
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

export const getGithubResourceFile = async (
    githubUser: string,
    githubRepo: string,
    version: string,
    resource: string,
): Promise<string> =>
    JSON.stringify(
        (
            await getGithubFile(
                githubUser,
                githubRepo,
                version,
                `src/resources/${resource}.JSON`,
            )
        ).data,
    );

const getGithubFileStructure = async (
    githubUser: string,
    githubRepo: string,
    version: string,
): Promise<{ data: { tree: [{ path: string }] } }> =>
    await githubApi.get(
        `/repos/${githubUser}/${githubRepo}/git/trees/${version}?recursive=1`,
    );

export const getGithubResourceList = async (
    githubUser: string,
    githubRepo: string,
    version: string,
): Promise<string[]> => {
    const files = await getGithubFileStructure(githubUser, githubRepo, version);

    const resourceList = files.data.tree
        .map((file) => file.path)
        .filter((path) => path.startsWith(`src/resources/`))
        .map((path) => {
            const name = path.match(/src\/resources\/(.*)\.JSON/);
            return name ? name[1] : ``;
        });

    return resourceList;
};

export const getGamemode = async (
    githubUser: string,
    githubRepo: string,
    version: string,
): Promise<GamemodeVersion> => {
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

    const phases: Phase[] = phasePaths.map((path, i) => {
        const name = path.match(/src\/phases\/(.*)\.js/);
        return {
            phaseName: name ? name[1] : ``,
            code: phasesCode[i].data,
        };
    });

    const game = {
        initialPhaseName: details.initialPhaseName,
        sharedCode: lib,
        phases,
    };

    return game;
};
