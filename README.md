# PwaExperimentOne

This is a small example app showing the use of [@angular/pwa](https://angular.io/guide/service-worker-getting-started).

## Running the project

The see the caching capabilities of the Service Worker, the application must be built in production mode and server via an external webserver (`ng serve --prod` is not enough).

To do this:

1. Install http-server:

```
> npm install --global http-server
```

2. Build the app in production mode:

```
> ng build -c production
```

3. Serve it:

```
> http-server -p 8080 -c-1 dist/pwa-experiment-one
```

4. Open <http://localhost:8080/>.
