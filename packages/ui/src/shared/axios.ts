import axios from 'axios';

const instance = axios.create({
    baseURL: `https://api.open-box.io`,
});

export default instance;
