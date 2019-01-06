import React, { Component } from 'react'
import { connect } from 'react-redux'
import { BotComponent } from './react-redux-bot-component/'

// Monitoring
import {
    // action
    getMonitoringIsAlive,
    // selectors
    monitoringIsAliveSelector,
    getMonitoringIsAliveStateSelector
} from '@tombenke/redux-app'


const mapStateToProps = state => ({
    monitoringIsAlive: monitoringIsAliveSelector(state),
    getMonitoringIsAliveState: getMonitoringIsAliveStateSelector(state)
})

const mapDispatchToProps = {
    // locale
    getMonitoringIsAlive
}

export const MonitoringBotComponent = connect(mapStateToProps, mapDispatchToProps)(BotComponent)
