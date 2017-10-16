export class ApiService {
    constructor($http) {
        this.$http = $http;
    }

    shortenUrl(url) {
        return this.$http
            .post('/api/shortened-urls', { originalUrl: url })
            .then(resp => resp.data);
    }

    getUrlList(offset, limit) {
        return this.$http.get(
            '/api/shortened-urls',
            { params: { offset, limit } }
        ).then(resp => resp.data);
    }
}
