import angular from 'angular';
import { getShortenedUrl } from '../../utils';
import { ResultDialogController } from './result-dialog/result-dialog';
import './st-app.css';

class AppController {
    constructor(api, $mdDialog) {
        this.api = api;
        this.$mdDialog = $mdDialog;

        this.shorteningUrl = false;
        this.originalUrl = undefined;
        this.items = [];
        this.itemsPerPage = 10;
        this.currentPage = 1;
        this.totalNumberOfItems = 0;
        this.itemsLoadingProgress = undefined;

        this.changePage = this.changePage.bind(this);
    }

    $postLink() {
        this.changePage(1, this.itemsPerPage);
    }

    shortenUrlButtonClicked() {
        this.shorteningUrl = true;

        this.api
            .shortenUrl(this.originalUrl)
            .then(data => {
                this.$mdDialog.show({
                    template: require('./result-dialog/result-dialog.html'),
                    controller: ResultDialogController,
                    controllerAs: '$ctrl',
                    locals: { shortUrl: getShortenedUrl(data.shortUrlHash) }
                });

                this.changePage(this.currentPage, this.itemsPerPage);
                this.originalUrl = undefined;
            })
            .catch(angular.noop)
            .finally(() => {
                this.shorteningUrl = false;
            });
    }

    changePage(page, limit) {
        this.itemsLoadingProgress =
            this.api
                .getUrlList((page - 1) * limit, limit)
                .then(data => {
                    this.items = data.items;
                    this.totalNumberOfItems = data.totalNumberOfItems;
                })
                .catch(angular.noop);
    }
}

export const stApp = {
    template: require('./st-app.html'),
    controller: AppController
};
