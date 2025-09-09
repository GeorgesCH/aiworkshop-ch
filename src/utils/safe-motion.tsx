import React from 'react'

type AnyProps = Record<string, any>

function passthrough<TagName extends keyof JSX.IntrinsicElements>(tag: TagName) {
  // Return a component that ignores animation props and renders a plain element
  const Comp = React.forwardRef<any, AnyProps>((props, ref) => {
    const { initial, animate, transition, whileInView, variants, exit, ...rest } = props
    return React.createElement(tag, { ref, ...rest })
  })
  Comp.displayName = `motion.${String(tag)}`
  return Comp
}

export const motion = {
  // Common HTML
  div: passthrough('div'),
  section: passthrough('section'),
  span: passthrough('span'),
  // SVG elements used in interactive demos
  svg: passthrough('svg'),
  g: passthrough('g'),
  circle: passthrough('circle'),
  path: passthrough('path'),
  text: passthrough('text'),
}
