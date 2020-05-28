// import { Observable } from 'rxjs/Observable';
// // we will use Oboe for streaming data directly from xhr onProgress handler
// import Oboe from 'oboe';
//
// import module from 'module';
//
// module.service('streamingService', class {
//   // Oboe is not aware of AngularJS and AngularJS is not aware of our http requests,
//   // so we will need to trigger AngularJS change detection algorithm manually
//   constructor($rootScope) {
//     this.$scope = $rootScope;
//   }
//
//   get(config, pattern = '!') {
//     return Observable.create(subscriber => {
//       const oboe = Oboe(config)
//         .start((status, headers) => {
//           // if request failed, we abort fetching additional response body data and report error
//           if (status < 200 || status >= 300) {
//             oboe.abort();
//             // we use $applyAsync, which batches multiple change detection requests
//             // $apply here would cause huge performance drop
//             this.$scope.$applyAsync(() => subscriber.error(status, headers));
//           }
//         })
//         .fail(error => {
//           this.$scope.$applyAsync(() => subscriber.error(error));
//         })
//         .node(pattern, node => {
//           this.$scope.$applyAsync(() => subscriber.next(node));
//           return Oboe.drop;
//         })
//         .done(emptyJson => {
//           this.$scope.$applyAsync(() => subscriber.complete());
//           return Oboe.drop;
//         });
//
//       // we abort fetching more data when somebody unsubscribes from observable
//       return () => oboe.abort();
//     })
//   }
// });
