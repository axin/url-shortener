import * as moment from 'moment';
import { getShortenedUrl } from '../../utils';

class UrlListController {
    constructor() {
        this.getShortenedUrl = getShortenedUrl;
    }

    fromNow(isoDateStr) {
        return moment(isoDateStr).fromNow();
    }
}

export const stUrlList = {
    template: require('./st-url-list.html'),
    controller: UrlListController,
    bindings: {
        items: '<',
        itemsPerPage: '<',
        currentPage: '=',
        totalNumberOfItems: '<',
        progress: '<',
        onPaginate: '<'
    }
};
