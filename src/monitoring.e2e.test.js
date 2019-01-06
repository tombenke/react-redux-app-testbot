import { go, take, put, chan, buffers } from 'js-csp'
import { configureStore } from '@tombenke/redux-app'
import React from 'react'
import { Provider } from 'react-redux'
import { mount } from 'enzyme'
import { MonitoringBotComponent } from './MonitoringBotComponent'

describe('e2e tests', () => {
    it('Server is not alive', done => {
        const actionsCh = chan(buffers.dropping(1))
        const renderCh = chan(buffers.sliding(1))
        const store = configureStore()
        const component = mount(
            <Provider store={store}>
                <MonitoringBotComponent actionsCh={actionsCh} renderCh={renderCh} />
            </Provider>
        )
        process.env.REST_API_PORT = 3000 // Non-existing port

        go(function*() {
            // Wait for first render
            let props = yield take(renderCh)
            //console.log('props:', props)
            expect(props.monitoringIsAlive).toEqual(false)
            expect(props.getMonitoringIsAliveState).toEqual('IDLE')

            // Send a GET /monitoring/isAlive request
            yield put(actionsCh, { action: 'getMonitoringIsAlive' })

            // Wait for state change to FETCHING
            props = yield take(renderCh)
            expect(props.getMonitoringIsAliveState).toEqual('FETCHING')

            // Wait for state change to IDLE again
            props = yield take(renderCh)
            expect(props.getMonitoringIsAliveState).toEqual('IDLE')
            expect(props.monitoringIsAlive).toEqual(false)

            done()
        })
    })

    it('Server is alive', done => {
        const actionsCh = chan(buffers.dropping(1))
        const renderCh = chan(buffers.sliding(1))
        const store = configureStore()
        const component = mount(
            <Provider store={store}>
                <MonitoringBotComponent actionsCh={actionsCh} renderCh={renderCh} />
            </Provider>
        )
        process.env.REST_API_PORT = 3007 // Start easer-server, that provides it by default

        go(function*() {
            // Wait for first render
            let props = yield take(renderCh)
            //console.log('props:', props)
            expect(props.monitoringIsAlive).toEqual(false)
            expect(props.getMonitoringIsAliveState).toEqual('IDLE')

            // Send a GET /monitoring/isAlive request
            yield put(actionsCh, { action: 'getMonitoringIsAlive' })

            // Wait for state change to FETCHING
            props = yield take(renderCh)
            expect(props.getMonitoringIsAliveState).toEqual('FETCHING')

            // Wait for state change to IDLE again
            props = yield take(renderCh)
            expect(props.getMonitoringIsAliveState).toEqual('IDLE')
            expect(props.monitoringIsAlive).toEqual(true)

            done()
        })
    })
})
