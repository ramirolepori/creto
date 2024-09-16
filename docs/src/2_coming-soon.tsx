'use client'

import { useEffect, useState } from 'react'

export default function ComingSoon() {
  const [gradientPosition, setGradientPosition] = useState(0)
  const [text, setText] = useState('')
  const fullText = 'Coming Soon'
  const [isPaused, setIsPaused] = useState(false)

  useEffect(() => {
    const gradientInterval = setInterval(() => {
      setGradientPosition((prevPosition) => (prevPosition + 1) % 200)
    }, 50)

    let index = 0
    let pauseCounter = 0
    const typingInterval = setInterval(() => {
      if (isPaused) {
        pauseCounter++
        if (pauseCounter > 20) { // 20 * 200ms = 4 seconds pause
          setIsPaused(false)
          pauseCounter = 0
          index = 0
        }
      } else {
        setText(fullText.slice(0, index))
        index++
        if (index > fullText.length) {
          setIsPaused(true)
        }
      }
    }, 200)

    return () => {
      clearInterval(gradientInterval)
      clearInterval(typingInterval)
    }
  }, [isPaused])

  return (
    <>
      <style>{`
        @keyframes gradientAnimation {
          0% {
            background-position: 0% 0%;
          }
          100% {
            background-position: 200% 0%;
          }
        }

        @keyframes blink-animation {
          to {
            visibility: hidden;
          }
        }

        .container {
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
          background-color: black;
        }

        .coming-soon {
          font-size: 4rem;
          font-weight: bold;
          background-image: linear-gradient(
            90deg,
            #F48DE0,
            #CCAAE9,
            #A7C7F3,
            #88F2DF,
            #F2F2F2,
            #F48DE0
          );
          background-size: 200% 100%;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          color: transparent;
          animation: gradientAnimation 5s linear infinite;
        }

        .cursor {
          display: inline-block;
          width: 2px;
          height: 1em;
          background-color: #F2F2F2;
          margin-left: 2px;
          vertical-align: text-bottom;
        }

        .blink {
          animation: blink-animation 0.7s steps(2, start) infinite;
        }
      `}</style>
      <div className="container">
        <h1 className="coming-soon" style={{ backgroundPosition: `${gradientPosition}% 0%` }}>
          {text}
          <span className={`cursor ${isPaused ? 'blink' : ''}`}></span>
        </h1>
      </div>
    </>
  )
}