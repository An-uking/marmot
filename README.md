# @uking/marmot

A lightweight and fast javascript native template rendering engine that supports browsers, FibJS and NodeJS.

### Note

1. Component name must start with a capital letter
2. Component name can not be Template or Slot

### usage



```javascript
const {html,Component,render} = require('@uking/marmot')

class Layout extends Component {
  render({title}){
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
```







