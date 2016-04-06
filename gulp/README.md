# gulp ?
반복적인 귀찮은 작업을 쉽게 처리 해준다. 한 마디로 Javascript 에서의 Maven, Ant, Gradle 같은 툴.
node.js 가 기반이다 보니 event-driven, non-blocking I/O 같은 특징이 있다.

> 일단 front-end 만 하기 위해서 위와 같은 특징은 그냥 알고만 있으면 될듯.

## 왜 gulp
웹 개발을 주로 했지만 Javascript 는 jQuery 를 대부분 사용하는 나에게는 front-end 의
gulp, Grunt 같은 task runner 툴은 생소하다. 그래도 gulp 를 선택 한 이유는
Grunt 는 json 포멧으로 설정을 기반으로 하는데 하지만 gulp 은 메소드를 작성해서 task 를 관리 하기 때문에
개인적으로 코드를 작성하는게 보기 편한것 같다. 그리고 메소드를 작성 하면 log 출력 같은 추가적인 작업을 만들 수 있어서 좋은 것 같다.

## install
node 기반이니 npm 으로 설치 하면 된다.
```
npm install -g gulp

```
> npm -g 옵션 때문에 어디서 든지 gulp 를 실행 할 수 있다.

package.json 에 devDependencies 에 추가를 하지 않은 이유는 범위를 벗어나서
비롯 gulp 가 개발 환경에서 만 실행을 하고 프로덕션에서는 사용하지 않는다고 해서 구지 devDependencies
에 추가를 해야 되는 건가? npm 은 잘몰라서 이부분은 넘어 가겠다. 글로벌 설치를 해도 이상없이 동작 하므로
그냥 글러벌 설치만 하겠다.

## gulp.task
gulp 는 gulpfile.js 내용을 실행 한다.
gulpfile.js 파일을 아래와 같이 테스트 할 수 있는 코드를 작성 했다.
```
var  gulp = require('gulp');

gulp.task('hello', function(){
  return console.log('Hello World!!');
});

```
node 에서 쓰는 require 함수로 gulp 모듈을 gulp 변수에 담는고, gulp.task 메소드를 구현 하였다. 터미널에서
```
gulp hello
```
를 실행 시키면 "Hello World!!" 가 출력된다.
[gulp API Docs](https://github.com/gulpjs/gulp/blob/master/docs/API.md) 에  gulp.task 에 대한 내용을 보면
```
gulp.task(name [, deps, fn])
```
name 을 제외하고는 전부 옵션 이다. deps 는 해당 task 가 실행되지 이전에 실행 되어야 할 task name 을
배열로 넘겨 주면 된다. fn 은 실질적으로 해당 task 가 실행 하는 코드 이다. 대부분  익명함수롤 작성한다.

```
gulp.task('default', ['hello']);
```
default name 은 터미널에서 gulp 명령어만 만 실행 했을때 실행 되는 메소드 있다. default 메소드를 구현 하지 않고
gulp 명령어를 실행 하면 error 가 발생 한다.
```
Task 'default' is not in your gulpfile
```




## 마무리
