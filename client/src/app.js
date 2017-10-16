import angular from 'angular';
import { stApp } from './components/st-app/st-app';
import { stUrlList } from './components/st-url-list/st-url-list';
import { ApiService } from './services/api';

import 'angular-material/angular-material.css';
import 'angular-material-data-table/dist/md-data-table.css';

const app = angular.module(
    'app',
    ['ngMaterial', 'md.data.table'],
    ($mdThemingProvider, $httpProvider) => {
        $mdThemingProvider.theme('docs-dark', 'default')
            .primaryPalette('yellow')
            .dark();

        $httpProvider.interceptors.push(($q, $injector) => ({
            responseError: rejection => {
                const message = rejection.data && rejection.data.message;

                if (message) {
                    // To avoid circular dependencies.
                    const $mdToast = $injector.get('$mdToast');

                    $mdToast.show(
                        $mdToast.simple()
                            .textContent(message)
                            .position('bottom right')
                            .hideDelay(3000)
                    );
                }

                return $q.reject(rejection);
            }
        }));
    }
);

app
    .component('stApp', stApp)
    .component('stUrlList', stUrlList)
    .service('api', ApiService);
