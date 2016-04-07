# RequireJS 를 이용해서 AMD 모듈 작성하기
AMD 포멧의 전반적인 목표는 개발자들에세 자바스크립트 모듈화 솔루션을 제공하는 데 있다. RequireJS를 사용해야 할 때 알아야 할 두 가지 핵심 개념은 모듈을 정의하기 위한 define() 메서드와 종속성을 로딩하는 require() 메서드다.

## define 메서드
```
define(
  module_id // 선택
  [dependecies] // 선택
  definition function // 모듈 또는 객체를 초기화하는 함수
)
```
> 주석만으로 충분히 의미를 알 수 가 있다.
> module_id 값이 없을 경우 익명 함수가 된다.

## require 메서드
require() 메서드는 일반적으로 최상단의 자바스크립트 파일에 코드를 로딩하기 위해서 사용되거나 모듈 내부에서 종속성을 동적으로 가지고 오기 위해서 사용된다. 다음 예가 이를 보여주고 있다.


```
require(['foo', 'bar'], function(foo, bar){
  // 여기에 코드의 나머지를 넣는다.
  foo.doSomething();
})
```
> foo, bar 는 require.config 메서드에서 정의한 변수이다.
> 'foo' 를 foo로 'bar' 를 bar 로 function 에서 사용하겠다는 의미
> config 메서드는 RequireJS 설정에서 다시 설명함.

# RequireJS 로 시작하기
HTML 파일에서 RequireJS 스크립트를 로딩할 때 RequireJS에게 메인 자바스크립트 파일이 어디 있는지 알려줘야 한다. (일반적으로 app.js 와 같이 호출되고, 이 파일은 애플리케이션의 진입 지점이다.)

``<script>`` 태그에 data-main 속성을 추가해서 이를 지정할 수 있다.

```
<script data-main="app.js" src="lib/require.js"></script>
```

## RequireJS 설정
data-main 속성을 가지고 로딩된 메인 자바스크립트 ㅍ일 내에서 RequireJS가 애플리케이션의 나머지 부분을 로드하는 방법을 설정할 수 있는데, require.config를 호출하고 객체를 전달하면 된다.

```
require.config({
  // 키/값 쌍으로 여기서 설정할 수 있다.
  baseUrl :"app",
  // 일반적으로, 최상위 스크립트의 data-main 소성에 설정된 스크립트 파일과 동일한 디렉터리를 기술한다.
  paths:{},
  // 라이브러리의 커스텀 경로를 설정하거나 RequireJS 플러그인의 경로를 설정한다.
  shim : {}, // 모든 shim을 설정하는 데 사용된다.
});
```

> 스크립트 로딩 > data-main js 호출 > data-main js 에서 require.config 메소드를 참조 이런 순으로 인식 하는 듯
