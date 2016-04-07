# yeoman ?
yeoman은 자바스크립트 기반의 프론트앤드 개발을 도와주는 자동화 툴이다.
자바에서 요즘 많이 사용되는 Maven과 유사하다고 합니다.
Generator 라는 것을 이용해서 개발하려는 프로젝트 종류(webapp, bootstrap, angularjs 등등)에 따라 기본적인 구조를 알아서 잡아준다.
내부적으로 Grunt, Bower를 사용하고 있다.
> 다른 많은 기능이 있다고 하는데 스캐폴딩(구조) 기능이 좋은것 같음

## pre-install
node 가 필요함

## Install
```
npm install -g yo

npm install -g bower

npm install -g gulp-cli
```
> npm install -g {}모듈} 은 글로벌설치를 하는 것임
> Global 설치 : 터미널에서 모듈의 명령어를 사용할 일이 있다면 Global로 설치합니다.
> Local 설치 : 소스내에서 require()로 불러들이는 모듈들은 Local로 설치합니다.
> [Outsider's DevStory](https://blog.outsider.ne.kr/638)

검색 결과는 대부분 grunt 를 사용하는데 gulp 을 대세라고 함..
grunt 를 설치 하려면 npm install -g grunt 로 설치 하면 됨

npm install -g generator-webapp
> generator-webapp 는 웹 어플리케이션에 기존 구조를 자동으로 생성해 준다. 만약 backbone 이라면 generator-backbone

## Start
```
yo webapp
```
이러게 하면 기본 디렉토리와 기본 파일들(bower.json, package.json) 등등을 자동으로 생성해 준다.
> 만약 gulp 과 grunt 가 같이 설치 되어 있다면?

```

```
