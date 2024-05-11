# @uking/marmot

A lightweight and fast javascript native template rendering engine that supports browsers, FibJS and NodeJS.

### Tips

1. Component name must start with a capital letter
2. Component name can not be Template or Slot

### Usage



```javascript
const {html,Component,render} = require('@uking/marmot')

class Layout extends Component {
  render({title}){
    console.log(this.context)
    return html`
      <!DOCTYPE html>
      <html lang="en">
        <head>
           <meta charset="UTF-8">
           <title>${title}</title>
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
  render({title,data}){
    return html`
    	<Layout title="this is title">
    		<Template slot="header">
    			<style>
    			body{
    				font-size:16px;
    			}
    			</style>
    		</Template>
    		<h2>${title}</h2>
    		<div>this is body content</div>
            <ul>
                ${data.map(item =>`<li>${item}</li>`)}
            </ul>
    	</Layout>
    `
  }
}
const data = ['test1','test2','test3']
const str = render(html`<Page title="Test" data="${data}" />`,{Page})
console.log(str)
//or
const props = {
  title:"Test",
  data
}
const com = new Page()
const res = com.render(props)
console.log(res)

// with context, the context can be passed to child components

const ctx = {
  a:1,
  b:2
}
const str2 = render(html`<Page title="Test" data="${data}" />`,{Page},null,ctx)
console.log(str)

// or

const com2 = new Page(ctx)
const res2 = com2.render(props)
console.log(res2)


```







