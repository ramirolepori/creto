'use client'

import { useEffect, useState } from 'react'

export default function ComingSoon() {
  const [gradientPosition, setGradientPosition] = useState(0)
  const [text, setText] = useState('')
  const fullText = 'Coming Soon'
  const [isPaused, setIsPaused] = useState(false)
  const [index, setIndex] = useState(0)

  useEffect(() => {
    // Intervalo para el movimiento del gradiente
    const gradientInterval = setInterval(() => {
      setGradientPosition((prevPosition) => (prevPosition + 1) % 200)
    }, 50)

    // Intervalo para el efecto de escritura
    const typingInterval = setInterval(() => {
      if (!isPaused) {
        setText(fullText.slice(0, index))
        setIndex((prevIndex) => {
          if (prevIndex >= fullText.length) {
            setIsPaused(true) // Pausa cuando termina de escribir
            return prevIndex
          }
          return prevIndex + 1
        })
      } else {
        // Resetear la animación tras una pausa
        setTimeout(() => {
          setIsPaused(false)
          setIndex(0) // Reiniciar el índice para reescribir el texto
        }, 2000) // 2 segundos de pausa antes de reiniciar
      }
    }, 200)

    // Limpieza de los intervalos al desmontar el componente
    return () => {
      clearInterval(gradientInterval)
      clearInterval(typingInterval)
    }
  }, [index, isPaused])

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
            #FF00FF,
            #FF00FF,
            #8A2BE2,
            #0000FF,
            #00FFFF,
            #00FF00,
            #FFFF00,
            #FF7F00,
            #FF0000,
            #FF00FF
          );
          background-size: 200% 100%;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          color: transparent;
          animation: gradientAnimation 5s linear infinite;
          background-position: ${gradientPosition}% 0%;
        }

        .cursor {
          display: inline-block;
          width: 2px;
          height: 1em;
          background-color: #FFF;
          margin-left: 2px;
          vertical-align: text-bottom;
        }

        .blink {
          animation: blink-animation 0.7s steps(2, start) infinite;
        }
      `}</style>
      <div className="container">
        <h1 className="coming-soon">
          {text}
          <span className={`cursor ${isPaused ? 'blink' : ''}`}></span>
        </h1>
      </div>
    </>
  )
}
