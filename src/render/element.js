// @flow
import * as React from 'react'
import { type Lemonbar } from 'lemonbar'

export type ElementProps = {
  children: React.Node,
  onClick?: Function,
  fcolor?: string,
  bcolor?: string,
  offset: number,
  possition?: number,
  index?: number,
}

class Element {

  isText: boolean
  type: string
  start: string
  end: string
  value: any
  onClick: Function
  children: Element[]
  bar: Lemonbar

  constructor(
    type: string,
    {
      possition,
      index,
      children,
      onClick,
      fcolor,
      bcolor,
      offset,
      ...props
    }: ElementProps,
    bar: Lemonbar
  ): void {
    this.type = type
    this.children = []
    this.bar = bar
    this.start = ''
    this.end = ''

    switch(type) {
      case ('monitor'): {
        if(!possition) {
          throw new Error('<monitor> tag requires a position prop')
        }
        this.start = `%{S${possition}}`
      } break

      case 'left': {
        this.start = '%{l}'
      } break

      case 'center': {
        this.start = '%{c}'
      } break

      case 'right': {
        this.start = '%{r}'
      } break

      case 'font': {
        if(!index) {
          throw new Error('<font> tag requires a index prop')
        }
        this.start = `%{T${index}}`
      } break

      case 'text': {
        this.value = children
      } break

      case 'textNode': {
        this.value = children
        this.isText = true
      } break
    }

    if (onClick) {
      const id = bar.registerOnClick(onClick, props)
      this.start = `%{A:${id}:}` + this.start
      this.end += '%{A}' + this.end
    }

    if (fcolor) {
      this.start = `%{F${fcolor}}` + this.start
      this.end = '%{F-}' + this.end
    }

    if (bcolor) {
      this.start = `%{B${bcolor}}` + this.start
      this.end = '%{B-}' + this.end
    }

    if (offset) {
      this.start = `%{O${offset}}` + this.start
      this.end = '%{O-}' + this.end
    }

  }

  appendChild(child: Element): void {
    this.children.push(child)
  }

  removeChild({ children, bar }: Element, child: Element) {
    children.splice(children.indexOf(child), 1)
    bar.flush()
  }

  updateValue(value): void {
    this.value = value
    this.bar.flush();
  }

  toString(): string {
    if(this.isText){
      if(Array.isArray(this.value)) {
        const o = this.value.reduce((o, c) => o += c, '')
        return `${this.start}${o}${this.end}`
      }
      return `${this.start}${this.value}${this.end}`
    }

    const childrenString = this
      .children
      .filter(a => !!a)
      .reduce((o, childElement) => {
        o += childElement.toString()
        return o
      }, "")

    return `${this.start}${childrenString}${this.end}`
  }
};

export function createElement(
  type: string,
  props: Object,
  bar: Lemonbar,
): Element {
  return new Element(type, props, bar)
}
