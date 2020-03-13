##### React新特性
- Context
  - Context提供了一种方式，能够让数据在组件树中传递而不必一级一级手动传递
  ```javascript
  const BatteryContext = createContext();
  const OnlineContext = createContext();
  class Leaf extends Component {
    render() {
      return (
        <BatteryContext.Consumer>
          {
            battery => (
              <OnlineContext.Consumer>
                {
                  online => <h1>Battery: {battery}, online: {String(online)}</h1>
                }
              </OnlineContext.Consumer>
            )
          }
        </BatteryContext.Consumer>
      )
    }
  }
  //声明一个中间组件
  class Middle extends Component {
    render() {
      return <Leaf/>
    }
  }

  class App extends Component {
    state = {
      online: false,
      battery: 60
    }
    render() {
      const { battery, online } = this.state;
      return (
        <BatteryContext.Provider value={battery}> 
          <OnlineContext.Provider value={online}>
            <button type="button" onClick={() => this.setState({battery: battery - 1})}>Press</button>
            <Middle/>
            <button type="button" onClick={() => this.setState({online: !online})}>Press</button>
          </OnlineContext.Provider>
        </BatteryContext.Provider>
      )
    }
  }
  ```
  - context因为全局变量让组件变得不纯粹，所以在一个组件中最多使用一个context就好
- ContextType
  ```javascript
  const BatteryContext = createContext(90);
  const OnlineContext = createContext();
  class Leaf extends Component {
    static contextType = BatteryContext;
    render() {
      const battery = this.context;
      return (
        <h1>Battery: {battery}</h1>
      )
    }
  }
  //声明一个中间组件
  class Middle extends Component {
    render() {
      return <Leaf/>
    }
  }

  class App extends Component {
    state = {
      online: false,
      battery: 60
    }
    render() {
      const { battery, online } = this.state;
      return (
        <BatteryContext.Provider value={battery}> 
          <OnlineContext.Provider value={online}>
            <button type="button" onClick={() => this.setState({battery: battery - 1})}>Press</button>
            <Middle/>
            <button type="button" onClick={() => this.setState({online: !online})}>Press</button>
          </OnlineContext.Provider>
        </BatteryContext.Provider>
      )
    }
  }
  ```
- lazy和Suspense
  ```javascript
  import React, { Component, lazy, Suspense } from 'react'

  const About = lazy(() => import(/*webpackChunkName: "about"*/'./About.jsx'));

  // ErrorBoundary 捕获组件加载错误
  // componentDidCatch
  export default class App extends Component {
    state = {
      hasError: false
    }
    // componentDidCatch() {
    //   this.setState({
    //     hasError: true
    //   })
    // }
    static getDerivedStateFromError() {
      return {
        hasError: true
      }
    }
    render() {
      if(this.state.hasError) {
        return <div>error</div>
      }
      return (
        <div>
          <Suspense fallback={<div>Loading...</div>}>
            <About />
          </Suspense>
        </div>
      )
    }
  }
  ```
  ```javascript  
  export default class About extends Component {
    render() {
      return (
        <div>
          About
        </div>
      )
    }
  }
  ```
- memo
  ```javascript
  import React, { Component, PureComponent, memo } from 'react'
  class Foo extends PureComponent {
    //PureComponent下不需要，而且只有传入组件属性的对比
    // shouldComponentUpdate(nextProps, nextState) {
    //   if(nextProps.name === this.props.name) {
    //     return false;
    //   }
    //   return true;
    // }
    render() {
      console.log('Foo render');
      return <div>{this.props.person.age}</div>;
    }
  }

  const FooSec = memo(function FooSec(props) {
    //纯函数父组件改变，子组件会渲染
    console.log('Foo render');
    return <div>{props.person.age}</div>
  })

  class App extends Component {
    state = {
      count: 0,
      person: {
        age: 1
      }
    }
    callback = () => {
      console.log(this)
    }
    render() {
      const { person } = this.state;
      return (
        <div>
          {/* <button 
            onClick={() => this.setState({count: this.state.count + 1})}>Add 
          </button> */}
          <button onClick={() => {
            person.age++
            this.setState({
              count: this.state.count + 1
            })
          }}>Add</button>
          <FooSec person={person} cb={this.callback}/>
        </div>
      )
    }
  }
  ```
- hooks
  - 为什么用hooks
    - 类组件不足
      - 状态逻辑复用难
        1. 缺少复用机制
        2. 渲染属性和高阶组件导致层级冗余
      - 趋向复杂难以维护
        1. 生命周期函数混杂不相干逻辑
        2. 相干逻辑分散在不同生命周期
      - this指向困扰
        1. 内联函数过度创建新句柄
        2. 类成员函数不能保证this
    - Hooks优势
      - 优化类组件的三大问题
        1. 函数组件无this问题
        2. 自定义Hook方便复用状态逻辑
        3. 副作用的关注点分离
  - 使用State Hooks
  ```javascript
  //与类组件等价的hooks组件
  import React, { Component, useState } from 'react'
  class App2 extends Component {
    state = {
      count: 0
    }
    render() {
      const { count } = this.state;
      return (
        <button 
          type="button"
          onClick={() => {this.setState({count: count + 1})}}>Click ({count})</button>
      )
    }
  }

  function App() {
    const [count, setCount] = useState(0);
    return (
      <button 
        type="button"
        onClick={() => {setCount( count + 1)}}>Click ({count})</button>
    )
  }
  ```
  - 使用Effect Hooks
  ```javascript
  import React, { Component, useState, useEffect } from 'react'

  class App2 extends Component {
    state = {
      count: 0,
      size: {
        width: document.documentElement.clientWidth,
        height: document.documentElement.clientHeight
      }
    }

    onResize = () => {
      this.setState({
        size: {
          width: document.documentElement.clientWidth,
          height: document.documentElement.clientHeight
        }
      })
    }

    componentDidMount() {
      document.title = this.state.count;
      window.addEventListener('resize', this.onResize, false)
    }

    componentDidUpdate() {
      document.title = this.state.count;
    }

    componentWillUnmount() {
      window.removeEventListener('resize', this.onResize, false)
    }

    render() {
      const { count, size } = this.state;
      return (
        <button 
          type="button"
          onClick={() => {this.setState({count: count + 1})}}>
            Click ({count})
            size: {size.width}x{size.height}
        </button>
      )
    }
  }
  function App(props) {
    const [count, setCount] = useState(0);
    const [size, setSize] = useState({
      width: document.documentElement.clientWidth,
      height: document.documentElement.clientHeight
    })

    const onResize = () => {
      setSize({
        width: document.documentElement.clientWidth,
        height: document.documentElement.clientHeight
      })
    }

    useEffect(() => {
      document.title = count;
    });

    useEffect(() => {
      window.addEventListener('resize',onResize, false);

      return () => {
        window.removeEventListener('resize', onResize, false)
      }
    }, [])

    return (
      <button 
        type="button"
        onClick={() => {setCount( count + 1)}}>
          Click ({count})
          size: {size.width}x{size.height}
      </button>
    )
  }

  export default App;

  ```
