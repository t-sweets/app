'use strict';

const os = require('os');
const {app, autoUpdater, dialog} = require('electron');
const version = app.getVersion();
const platform = os.platform() + '_' + os.arch();

const updaterFeedURL = `${process.env.UPDATE_CHECK_NUTS}/${platform}/${version}`;

function appUpdater() {

    autoUpdater.setFeedURL(updaterFeedURL);
    autoUpdater.on('error', err => console.log(err));
    autoUpdater.on('checking-for-update', () => console.log('checking-for-update'));
    autoUpdater.on('update-available', () => console.log('update-available'));
    autoUpdater.on('update-not-available', () => console.log('update-not-available'));
    autoUpdater.on('update-downloaded', (event, releaseNotes, releaseName) => {
        let message = app.getName() + ' ' + releaseName;
        if (releaseNotes) {
            const splitNotes = releaseNotes.split(/[^\r]\n/);
            message += '\n\nリリース内容:\n';
            splitNotes.forEach(notes => {
                message += notes + '\n\n';
            });
        }
        dialog.showMessageBox({
            type: 'question',
            buttons: ['再起動', 'あとで'],
            defaultId: 0,
            message: '新しいバージョンをダウンロードしました。再起動しますか？',
            detail: message
        }, response => {
            if (response === 0) {
                setTimeout(() => autoUpdater.quitAndInstall(), 1);
            }
        });
    });
    autoUpdater.checkForUpdates();

}
exports = module.exports = {
    appUpdater
};