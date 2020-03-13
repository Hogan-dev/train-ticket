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
let id = 0;
function App(props) {
  // const defaultConut = props.defaultConut || 0;
  const [count, setCount] = useState(() => {
    console.log('initial count')
    return props.defaultCount || 0;
  });

  return (
    <button 
      type="button"
      onClick={() => {setCount( count + 1)}}>Click ({count})</button>
  )
}

export default App;