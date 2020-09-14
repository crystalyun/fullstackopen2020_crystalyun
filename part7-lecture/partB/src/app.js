import React, { useState } from 'react'
// useCounter custom hook
const useCounter = () => {
    const [value, setValue] = useState(0)

    const increase = () => {
        setValue(value + 1)
    }

    const decrease = () => {
        setValue(value - 1)
    }

    const zero = () => {
        setValue(0)
    }

    return {
        value,
        increase,
        decrease,
        zero
    }
}

const Counter = () => {
    const counter = useCounter()

    return (
      <div>
          increase, decrease, or make it zero
          <div>{counter.value}</div>
          <button onClick={counter.increase}>
              plus
          </button>
          <button onClick={counter.decrease}>
            minus
          </button>      
          <button onClick={counter.zero}>
            zero
          </button>
      </div>
    )
}

const LeftAndRight = () => {
    const left = useCounter()
    const right = useCounter()

    return (
        <div>
            left and right tracker
            {left.value}
            <button onClick={left.increase}>
                left
            </button>
            <button onClick={right.increase}>
                right
            </button>
            {right.value}
        </div>
    )
}

export { Counter, LeftAndRight }