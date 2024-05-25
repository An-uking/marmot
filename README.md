# @uking/marmot

A lightweight and fast javascript template rendering engine that supports browsers, FibJS and NodeJS.

### Tips

1. Component name must start with a capital letter
2. Component name can not be Template or Slot
3. Support for nested components
4. Support for "v-if","v-else-if","v-else","v-for" directives
5. Support for variable interpolation

### render function

```javascript
render(html`...`,components,data,context,slots)
```

- `html` is a tagged template literal function that returns a `Template` object.
- `components` is an object that contains all the required components.
- `data` is an object that contains all the data for the template.
- `context` is an object that contains the context for the template.
- `slots` is an object that contains the slots for the template.

### Install

```bash
npm install @uking/marmot
//or
yarn add @uking/marmot
//or
pnpm add @uking/marmot
```

### Usage

```javascript
const {html,Component,render} = require('@uking/marmot')

class Layout extends Component {
  data(){
    console.log(this.context)
    return{
      //
    }
  }
  render(){
    return html`
        <!DOCTYPE html>
        <html lang="en">
            <head>
                <meta charset="UTF-8">
                <title>{{title}}</title>
                <Slot name="header" />
            </head>
            <body>
                <Slot />
            </body>
        </html>
    `
  }
}

class Page extends Component {
  // Register required components
  components(){
    return {
      Layout
    }
  }
  data(){
    return {
      data:['test1','test2','test3'],
      color:'red',
      cls:"class test" //can not use "class" as a variable name in js
    }
  }
  render(){
    return html`
    	<Layout title="this is layout title">
    		<Template slot="header">
    			<style>
    			body{
    				font-size:16px;
    				color:{{color}};
    			}
    			</style>
    		</Template>
    		<h2>{{title}}</h2>
    		<div>this is body content</div>
            <ul>
                <li v-for="item in data" class="x" :class="cls">{{item}}</li>
            </ul>
    	</Layout>
    `
  }
}
let str = render(html`<Page title="this is Page title" />`,{Page})
console.log(str)
//or
let data = {
  color:'red',
  data:['test1','test2','test3']
}
// with context, the context can be passed to child components

let ctx = {
  a:1,
  b:2
}
let str2 = render(html`<Page title="Test" />`,{Page},data,ctx)
console.log(str2)


```







