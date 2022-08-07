import {ExtraField} from "./gzip.js";
import path from "path";
import util from "util";
import glob from "glob";
import createTorrent from "create-torrent";
import {download, index, login, upload} from "./api.js";
import {QBittorrent} from '@ctrl/qbittorrent';
import {Meta} from "./resource.js";

async function UnityPackageMeta(file: string) {
    return ExtraField(file, 65, 36);
}

(async function () {
    const client = new QBittorrent({
        baseUrl: 'http://localhost:8080/',
        username: 'admin',
        password: 'adminadmin',
    });

    // client.setPreferences()

    // const data = await client.getAllData();
    const tasks = await client.listTorrents()
    const taskTorrentIds = tasks.map((item) => parseInt(new URL(item.tracker).searchParams.get('torrent_id')));
    await login('simpletracker', 'simpletracker');
    const resources = await index();
    const resourceUploadIds = resources.map(i => JSON.parse(i.description).upload_id)
    console.log(resourceUploadIds);

    const cwd = path.join(process.env.APPDATA, 'Unity', 'Asset Store-5.x');
    const files = await util.promisify(glob)("**/*.unitypackage", {cwd});

    for (const file of files) {
        const p = path.join(cwd, file);
        const description = await UnityPackageMeta(p);
        console.log(description)
        const meta = <Meta>JSON.parse(description);

        // 远端有
        const resourceIndex = resourceUploadIds.indexOf(meta.upload_id);
        if (resourceIndex >= 0) {
            const torrent_id = resources[resourceIndex].torrent_id;

            // qb 有
            const taskIndex = taskTorrentIds.indexOf(torrent_id);
            if (taskIndex >= 0) {

            } else {
                // qb 无
                console.log(`downloading ${meta.title}`)
                const torrent = await download(torrent_id);
                const result = await client.addTorrent(torrent, {
                    savepath: path.dirname(p),
                    filename: path.basename(p),
                    category: 'Unity'
                })
            }
        } else {
            // @ts-ignore
            const torrent: Buffer = await util.promisify(createTorrent)(p, {
                comment: description,
                info: {id: meta.id},
                announceList: [],
                private: true,
            })
            console.log(`uploading ${meta.title}`)
            const torrent2 = await upload(torrent, description, `${meta.title}.torrent`);

            const result = await client.addTorrent(torrent2, {
                savepath: path.dirname(p),
                filename: path.basename(p),
                category: 'Unity'
            })
        }
    }
})();