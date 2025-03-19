import axios from "axios";

export const serverDelay = func => duration =>
    new Promise((resolve, reject) =>
        setTimeout(() => {
            resolve(func())
        }, duration || 1000)
    )

export const getWhitelistFromServer = serverDelay(async () => {
    const alldata = await axios.get("https://jsonplaceholder.typicode.com/posts?_limit=10").then((response) => {
        let datas = response.data;
        const datapush = [];
        datas.forEach(element => {
            datapush.push(element.title);
        });
        return datapush;
    });

    return alldata;
})



export const getValue = serverDelay(() => ["foo", "bar", "baz"])
