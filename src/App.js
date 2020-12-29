import React from 'react'
import './scss/App.scss'
import { EVIDENCE, GHOST_TYPES } from './constants'

export default class App extends React.Component {
  constructor() {
    super()
    this.state = {
      activeEvidence: [],
      lookupGhost: ''
    }

    this._addActiveEvidence = this._addActiveEvidence.bind(this)
    this._removeActiveEvidence = this._removeActiveEvidence.bind(this)
  }

  _removeActiveEvidence(evId) {
    // console.log('_removeActiveEvidence', evId)
    let newArray = [].concat(this.state.activeEvidence)

    const evIds = newArray.filter( id => {
      return id !== evId
    })

    this.setState({ activeEvidence: evIds })
  }

  _addActiveEvidence(evId) {
    if (this.state.activeEvidence.length >= 3) {
      console.log('Unclick another piece of evidence first')
    } else {
      let newArray = [].concat(this.state.activeEvidence)

      newArray.push(evId)

      let evIds = newArray.filter((num, i) => {
        return newArray.indexOf(num) === i;
      });

      this.setState({ activeEvidence: evIds })
    }
  }

  _handleGhostButtonClick(ghost) {
    this.setState({ lookupGhost: ghost })
  }

  _handleEvidenceClick(evId) {
    // console.log( 'clicked evidence', evId )
    const evidenceIsCurrentlyActive = this.state.activeEvidence.indexOf(evId) !== -1

    if (evidenceIsCurrentlyActive) {
      this._removeActiveEvidence(evId)
    } else {
      this._addActiveEvidence(evId)
    }
  }

  _renderEvidenceButtons() {
    return EVIDENCE.map( button => {
      const activeEvidenceFull = this.state.activeEvidence.length >= 3
      const isActiveEvidence = this.state.activeEvidence.indexOf(button.id) !== -1

      const isDisabled = !isActiveEvidence && activeEvidenceFull

      const evidenceClasses = [
        'evidence__button',
        isActiveEvidence ? 'evidence__button--active' : ''
      ].join(' ')

      return (
        <button key={`evidence${button.id}`} className={evidenceClasses} type="button" disabled={isDisabled} onClick={ () => { this._handleEvidenceClick(button.id) }}>
          { button.name }
        </button>
      )
    })
  }

  _renderPossibleGhosts() {
    const { activeEvidence } = this.state
    let possibleGhosts = GHOST_TYPES

    if (activeEvidence.length > 0) {

      possibleGhosts = GHOST_TYPES.filter( ghost => {
        let notThisGhost = false

        activeEvidence.forEach( pieceOfEvidence => {
          const requiredEvidence = ghost.evidence
          if ( requiredEvidence.indexOf(pieceOfEvidence) === -1 ) {
            notThisGhost = true
          }
        })

        /** Remove ghost from list of possible culprits */
        if (notThisGhost) return false
        return true
      })
    }

    if (possibleGhosts.length <= 0) {
      return <div className="ghost">Something is wrong. Double check your evidence again...</div>
    }

    return possibleGhosts.map( ghost => {
      return (
        <button key={`ghosts${ghost.id}`} className="ghost__button" onClick={() => { this._handleGhostButtonClick(ghost) }}>
          { ghost.name }
        </button>
      )
    })
  }

  _renderGhostDetails() {
    const { lookupGhost } = this.state

    return (
      <div className="ghost-details__wrapper" onClick={ () => { this.setState({ lookupGhost: '' }) }}>
        <h2>{ lookupGhost.name }</h2>
        <ul>
        {
          lookupGhost.evidence.map( evidenceId => {
            const item = EVIDENCE.find( element => { return element.id === evidenceId })

            if (item) return <li>{item.name}</li>
            return null
          })
        }
        </ul>
      </div>
    )
  }

  render() {
    return (
      <div className="App">
        <div className="evidence__wrapper">
          { this._renderEvidenceButtons() }
        </div>
        { this.state.lookupGhost && this._renderGhostDetails() }
        <div className="ghost__wrapper">
          { this._renderPossibleGhosts() }
        </div>
        <footer>
          Ghost Journal Companion App
        </footer>
      </div>
    )
  }
}
