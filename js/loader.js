require.config({
    baseUrl: 'js/lib',
    paths: {
        underscore: 'vendor/underscore',
        jquery: 'vendor/jquery-2.1.0',
        hammer: 'vendor/jquery.hammer-full.min',
        transit: 'vendor/jquery.transit',
        app: "../app"
    }
});
requirejs(["app/main"]);
