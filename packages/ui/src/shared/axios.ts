import axios from 'axios';

export const openbox = axios.create({
    baseURL: `https://api.open-box.io`,
});

export const githubRaw = axios.create({
    baseURL: `https://raw.githubusercontent.com`,
});

export const githubApi = axios.create({
    baseURL: `https://api.github.com`,
});
