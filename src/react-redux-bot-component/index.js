import _ from 'lodash'
import React, { Component } from 'react'
import { go, take, put, CLOSED } from 'js-csp'

/**
 * Shalow diff between two object, using lodash
 * @param  {Object} object Object compared
 * @param  {Object} base   Object to compare with
 * @return {Object}        Return a new object who represent the diff
 */
function difference(object, base) {
    function changes(object, base) {
        return _.transform(object, function(result, value, key) {
            if (!_.isEqual(value, base[key])) {
                result[key] = value
            }
        })
    }
    return changes(object, base)
}

class BotComponent extends Component {
    constructor(props) {
        super(props)

        const dispatchAction = (actionName, actionPayload) => {
            if (actionName != null) {
                const actionProp = props[actionName]
                if (_.isFunction(actionProp)) {
                    console.log(`Act: ${actionName} / `, actionPayload)
                    actionProp(actionPayload)
                } else {
                    throw new Error(`BotComponent has no "${actionName}" property or it is not a Function`)
                }
            }
        }

        go(function*() {
            while (true) {
                const act = yield take(props.actionsCh)
                if (act === CLOSED) {
                    return
                } else {
                    dispatchAction(act.action, act.payload)
                }
            }
        })
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        const renderCh = this.props.renderCh
        const updateCh = this.props.updateCh
        const props = this.props
        const diff = difference(this.props, prevProps)
        console.log(`\n---------------------------------------\nStore change:`, diff)
        if (updateCh) {
            go(function*() {
                yield put(updateCh, diff)
            })
        }
    }

    render() {
        const props = this.props
        go(function*() {
            yield put(props.renderCh, props)
        })
        return React.createElement('div', {})
    }
}

module.exports = {
    BotComponent
}
