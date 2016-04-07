# Marionette.js

## 소개

굉장히 많은 기능을 제공 하지만 전체를 사용할 필요가 없다.
사용하고자 하는 시점에서 해당 기능만 선택해서 사용할 수 있는데
이렇게 함으로써 다른 Backbone 프레임워크나 플러그인과 손쉽게 같이 사용할 수 있다.

## 특징
Marionette 의 특징은 검색하면 많이 나오기 때문에 전부 나열할 필요는 없다고 생각이 든다.
그중 책에서 나오는 개인적으로 공감이 되는 부분을 정리 하였다.

### 1. Boilerplate code 를 줄일 수 있다.
Backbone 에서는 뷰를 정의하고, 구성하고, 랜더링하고, 출력하기 위한 코드들은 프로젝트에서 반복적으로 작성해야 한다.
이건 보일러플레이트 코드(Boilerplate code) 이다.
> Boilerplate code : 꼭 필요하면서 간단한 기능인데, 많은 코드를 필요로 하는 코드

**Backbone**
```
var MyView = Backbone.View.extend({
  template: $('#my-view-template').html(),

  render : function(){
    var compiledTemplate = _.template(this.template);
    var data = this.model.toJSON();
    var html = compiledTemplate(data);
    this.$el.html(html);
  }
});

var Derick = new Person({
    firstName : 'Derick'
})  

var myView = new MyView({model:Derick});
myView.render();

$("#content").html(myView.el);
```

Backbone View 의 코드를 아래와 같이 대체 할 수 있다.

**Marionette**
```
var MyView = Marionette.ItemView.extend({
  template : '#my-view-template'
});
```

### 2. 메모리 관리
고급 메모리 관리 기능과 뷰 인스턴스나 이벤트 핸들러를 정리하는 잡을 만드는 기능을 제공한다.

다음의 뷰 구현체의 코드를 살펴보자.
```
var ZombieView = Backbone.View.extend({
  template : '#my-view-template',
  initialize : function(){
    this.model.on('change', this.render, this);
  },
  render : function(){
    alert('Alert.....');
  }
});

var Person = Backbone.Model.extend({
  defaults:{
    "firstName" : "test"
  }
});

var Derick = new Person({
  firstName : 'Derick'
});

// 첫 번째 뷰 인스턴를 만든다.
var zombieView = new ZombieView({
  model : Derick
});

// 두 번째 뷰 인스턴스를 만들고
// 동일한 변수명에 이를 저장한다.
zombieView = new ZombieView({
  model : Derick
});

Derick.set('firstName', 'FirstName changed');
```

첫 번째 뷰 인스턴스는 두 번째 뷰 인스턴스가 만들어지자마자 사라진다.
이 인스턴스는 더 이상 활성화되지 않아서 더 이상 모델의 변경 이벤트에도 반응할 수 없기 때문에  자바스크립트 가비지 컬렉터에 의해서 청소된다.

**위 코드를 실행 시키면 alert 가 한번 발생하기를 기대 하지만 경고창이 두 번 뜨는 것을 볼 수 있다.**

initialize 메소드에 모델 이벤트가 바인딩되서 문제가 발생을 한다.
모델이 이벤트가 발생 되고 this.render 콜백 메소드로 전달할 때마다 모델 자체가 뷰 인스턴스에 직접 참조를 한다.
결국 모델은 뷰 인스턴스에 참조를 유지하고 있기 때문에, 첫 번째 뷰도 참조 범위에서 제외 되지 않는다.

이를 쉽게 수정하려면, 뷰가 수행되다가 닫힐 준비가 되었을 때 stopListening 을 호출 하면 된다.

**Backbone**
```
var ZombieView = Backbone.View.extend({
  template : '#my-view-template',
  initialize : function(){
    this.model.on('change', this.render, this);
  },
  render : function(){
    alert('Alert.....');
  },
  close : function(){
    this.stopListening();
  }
});

var Person = Backbone.Model.extend({
  defaults:{
    "firstName" : "test"
  }
});

var Derick = new Person({
  firstName : 'Derick'
});

// 첫 번째 뷰 인스턴를 만든다.
var zombieView = new ZombieView({
  model : Derick
});

zombieView.close();

// 두 번째 뷰 인스턴스를 만들고
// 동일한 변수명에 이를 저장한다.
zombieView = new ZombieView({
  model : Derick
});

Derick.set('firstName', 'FirstName changed');
```

**Marionette**

```
var ZombieView = Marionette.ItemView.extend({
  template : '#my-view-template',
  initialize : function(){
    // Backbone.Events.listenTo 메소드를 Marionette 에서 사용
    // 할 수 있다.
    this.listenTo(this.model, 'change', this.render);
  },
  render : function(){
    alert("Alert....");
  }
})
```
close 메소드를 정의할 필요가 없다.

> 이건 진짜 아직도 잘이해가 안된다. Marionette.View 계열은
> zombieView 가 되지 않는 다는 건가?

### 3. Region 관리
- DOM 엘리먼트에 출렷해줘야 하는 개별 뷰의 생명 주기를 관리한다.
- render 메소드 / DOM 엘리멘트에 뷰를 보여주기 위한 코드들은 보일러플레이트 코드다.

**sample**

```
var myRegion = new Marionette.Region({
  el:'#content'
});

var view1 = new MyView({model : Derick});
myRegion.show(view1);

var view2 = new MyView({model : Derick});
myRegion.show(view2);
```
위 코드는
- Region 인스턴스에 el을 지정해서 관리위한 DOM 요소를 알려주고
- 뷰에서는 더이상 render 메소드를 호출 하지 않는다.

> 이러면 모든 view 를 Region 으로 호출 하면 되지 않을까?

**Region 동작 방식**
 - show 메소드에 뷰를 전달 할때 Region은 뷰의 render 메서드를 호출한다. 그리고 뷰의 el을 가지고 와서 Region.el 에 설정된 DOM 엘리먼트에 이입한다.
 - 현재 보여지고 있는 뷰를 기억하고 있다가 show 메소드가 호출 되면 뷰의 close 메소드를 호출 하고 뷰를 제거한 뒤에 랜더링을 수행하고 전달된 새로운 뷰의 코드를 보여준다.
 - 만약 뷰가 close 메소드를 정의 하지 않으면 Backbone.View 의 remove 메서드를 호출 한다.


 ### 4. LayoutView
 LayoutView 는 region 보다 상위 개념인듯 region 들 등록하고 UI / event binding 을 할 수 있다.
