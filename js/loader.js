require.config({
    baseUrl: 'js/lib',
    paths: {
        underscore: 'vendor/underscore',
        jquery: 'vendor/jquery-2.1.0',
        app: "../app"
    }
});
requirejs(["app/main"]);
