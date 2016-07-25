# Skipper
Skipper will help you to skip/drop tasks that are no longer expected to be performed.

For example: it used to detect and drop outdated responses from asyncronious operations, promisified responses from services.

Use case: user making chaotic/fast navigation and in result the app will fire a lot of requests to services, and only results of last call is valuable for the user.

```
                    ________________________ 
                   /                        \
                  |    Hold that elevator!   |
                   \________________________/
  ___________      /
 /       ___ \    /
 |      (_O_) \  /
 |             > 
 |             |
 |             |
 |_____________|
 |______}______}
```

## Usage

* Original code without Skipper:
```
      function someActionThatUseServiceA() {
          serviceA.getData(
              requestParams,
              myCallbackFunction
          );
      }
```
* Example with callback and Skipper:
```
      const mySkipperForServiceA = new Skipper();
      function someActionThatUseServiceA() {
          const marker = mySkipperForServiceA.mark();
          serviceA.getData(
              requestParams,
              mySkipperForServiceA.do(marker, myCallbackFunction)
          );
      }
```
* Example #1 with skipping Promise:
```
      const mySkipperForServiceB = new Skipper();
      function someActionThatUseServiceB() {
          const marker = mySkipperForServiceB.mark();
          serviceB.getData(requestParams)
              .then(mySkipperForServiceB.check(marker))
              .catch(console.log) //catch Skipper exceptions immediately
              .then(myHandlerFunction)
              .catch(console.log)
          );
      }
```
* Example #2 with skipping exceptions from Promise:
```
      const mySkipperForServiceB = new Skipper('my.custom.exception.code.for.skipped.operations');
      function someActionThatUseServiceB() {
          const marker = mySkipperForServiceB.mark();
          serviceB.getData(requestParams)
              .catch(mySkipperForServiceB.catch(marker))
              .then(mySkipperForServiceB.check(marker))
              .catch(console.log) //catch Skipper exceptions
              .then(myHandlerFunction)
              .catch(console.log)
          );
      }
```
* Example #3 with Promise:
```
const mySkipperForServiceB = new Skipper();
      function someActionThatUseServiceB() {
          const marker = mySkipperForServiceB.mark();
          serviceB.getData(requestParams)
              .then(mySkipperForServiceB.do(marker, myHandlerFunction))
              .catch(console.log); //catch exceptions from myHandlerFunction or mySkipperForServiceB
          );
      }
```
