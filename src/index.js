/**
 * [@uking/marmot]{@link https://github.com/An-uking/marmot.git}
 *
 * @namespace marmot
 * @version 1.0.7
 * @author uking [ptvile@live.com]
 * @copyright uking 2024
 * @license MIT
 */
const html = (strings, ...values) => ({ strings, values })
const reservedKeys = ['Template', 'Slot']
class Component {
    constructor(props) {
        this.props = props
        let name = this.constructor.name
        if (reservedKeys.includes(name)) {
            throw new Error(`Component ${name} is a reserved keyword and cannot be used as a component name.`)
        }

    }

    components() {
    }

    render(props = {}) {
    }
}

const componentNameRegExp = /<([A-Z][A-Za-z0-9]*)/g
const render = (node, components, slots) => {
    let { strings, values } = node
    if (!strings) return ''
    return _renderToString(strings, values, components, slots)
}

function _renderToString(arr, values, components, slots) {
    let strings = arr.slice(0)
    let html = ''
    slots = slots || {}
    while (strings.length) {
        let matchComponents = strings[0].match(componentNameRegExp)
        if (matchComponents) {
            for (let j = 0; j < matchComponents.length; j++) {
                strings[0] = strings[0].replace(/\n\s+/g, '')
                if (!strings[0]) continue
                let componentName = matchComponents[j].replace('<', '')
                let beginPosition = strings[0].indexOf(matchComponents[j])
                html += strings[0].substring(0, beginPosition)
                if (componentName === 'Template') {
                    strings[0] = strings[0].substring(beginPosition + matchComponents[j].length)
                    let {
                        props,
                        currentIndex,
                        endTagPosition
                    } = findComponentAttributes(strings, values)
                    strings[currentIndex] = strings[currentIndex].substring(endTagPosition + 1)
                    strings.splice(0, currentIndex)
                    values.splice(0, currentIndex)
                    let componentEndTag = `</Template>`
                    let { index, offset, length } = findComponentEndTagPosition(componentEndTag, strings)
                    let arr = strings.slice(0, index + 1)
                    let val = values.slice(0, index)
                    arr[index] = arr[index].substring(0, offset)
                    slots[props.slot] = _renderToString(arr, val, components, slots)
                    strings[index] = strings[index].substring(offset + componentEndTag.length)
                    strings.splice(0, index)
                    values.splice(0, index)
                    j += length
                } else if (componentName === 'Slot') {
                    let tagLen = beginPosition + matchComponents[j].length
                    strings[0] = strings[0].substring(tagLen)
                    let {
                        props,
                        currentIndex,
                        endTagPosition
                    } = findComponentAttributes(strings, values)
                    if (props.name) {
                        html += slots[props.name] || ''
                        slots[props.name] = ''
                    } else {
                        html += slots.default || ''
                        slots['default'] = ''
                    }
                    strings[currentIndex] = strings[currentIndex].substring(endTagPosition + 2)
                    strings.splice(0, currentIndex)
                    values.splice(0, currentIndex)
                } else {
                    //自定义组件
                    let MyComponent = components[componentName]
                    if (!MyComponent) {
                        throw new Error(`Component ${componentName} not found.`)
                    }
                    strings[0] = strings[0].substring(beginPosition + matchComponents[j].length)
                    let { props, currentIndex, endTagPosition, isCloseTag } = findComponentAttributes(strings, values)
                    if (!isCloseTag) {
                        strings[currentIndex] = strings[currentIndex].substring(endTagPosition + 1)
                        strings.splice(0, currentIndex)
                        values.splice(0, currentIndex)
                        //查找自定义组件的结束标签
                        let componentEndTag = `</${componentName}>`
                        let { index, offset, length } = findComponentEndTagPosition(componentEndTag, strings)
                        let arr = strings.slice(0, index + 1)
                        let val = values.slice(0, index)
                        arr[index] = arr[index].substring(0, offset)
                        slots['default'] = _renderToString(arr, val, components, slots)
                        let myComponent = new MyComponent()
                        html += render(myComponent.render(props), myComponent.components(), slots)
                        //删除已经渲染的自定义组件标签
                        strings[index] = strings[index].substring(offset + componentEndTag.length)
                        strings.splice(0, index)
                        values.splice(0, index)
                        j += length

                    } else {
                        let myComponent = new MyComponent()
                        html += render(myComponent.render(props), myComponent.components(), slots)
                        strings[0] = strings[0].substring(endTagPosition + 2)
                    }
                }
            }

        } else {
            strings[0] = strings[0].replace(/\n\s+/g, '')
            html += strings[0]
            strings.splice(0, 1)
            if (values[0]) {
                if (Array.isArray(values[0])) {
                    html += values[0].join('')
                } else {
                    html += values[0]
                }
                values.splice(0, 1)
            }
        }
    }
    return html
}

function findComponentEndTagPosition(componentName, strings) {
    let strLen = strings.length
    let isTemplate = componentName === '</Template>'
    let arr = []
    let offset = -1
    let length = 0
    let index = -1
    for (let i = 0; i < strLen; i++) {
        let line = strings[i]
        offset = line.indexOf(componentName)
        // index = i
        let flag = offset > -1
        let str = line
        if (flag) {
            index = i
            str = line.substring(0, offset)
        }
        if (isTemplate) {
            let match = str.match(componentNameRegExp)
            if (match) {
                arr.push(...match)
                length = arr.length
            }
        }

        if (flag) break
    }
    return { index, offset, length }
}

function findComponentAttributes(strings, values) {
    const strLen = strings.length
    let props = {}
    let currentIndex = -1
    let endTagPosition = -1
    let isCloseTag = false
    for (let i = 0; i < strLen; i++) {
        let line = strings[i].replace(/\n\s+/g, '')
        let endTagRegex = new RegExp(`(\/)?>`, 'g')
        let endTagMatch = endTagRegex.exec(line)
        if (endTagMatch) {
            isCloseTag = endTagMatch[0] === '/>'
            let endPosition = endTagMatch.index
            line = line.substring(0, endPosition)
            props = getBooleanAttributes(line, props)
            props = getStaticAttributes(line, props)
            currentIndex = i
            endTagPosition = endTagMatch.index
            break
        } else {
            props = getBooleanAttributes(line, props)
            props = getStaticAttributes(line, props)
            let attrKey = getDynamicAttributesKey(line)
            attrKey && !props[attrKey] && (props[attrKey] = values[i])
        }
    }
    return { props, currentIndex, endTagPosition, isCloseTag }
}

/**
 * Extracts attributes from an HTML string.
 * @param htmlString
 * @param props
 * @returns {{}}
 */
function getStaticAttributes(htmlString, props = {}) {
    const regex = /([\w-]+)\s*=\s*(['"])(.*?)\2/g;
    let match;
    while ((match = regex.exec(htmlString))) {
        const [, key, , value] = match;
        props[key] = value;
    }
    return props;
}

//获取自定义组件的动态属性 如：<MyComponent name="{name}" age="{age}" />
function getDynamicAttributesKey(htmlString) {
    const regex = /([\w-]+)\s*=['"]$/g;
    let match = regex.exec(htmlString)
    if (match) {
        return match[1]
    } else {
        return null
    }
}

/**
 * //获取自定义组件的布尔属性 如：<MyComponent disabled checked />
 * @param htmlString
 * @param props
 * @returns {Object}
 */
function getBooleanAttributes(htmlString, props = {}) {

    const regex = /(^|\s)(\w+)(?=\s|$)/g
    let match;
    while ((match = regex.exec(htmlString))) {
        const [, , key] = match;
        props[key] = true;
    }
    return props;
}

export {
    render,
    Component,
    html
}
