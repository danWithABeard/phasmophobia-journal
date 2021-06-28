import React from 'react'
import './scss/App.scss'
import EMFIcon from './svgs/EMFIcon'
import FingerprintsIcon from './svgs/FingerprintsIcon'
import FreezingTempsIcon from './svgs/FreezingTempsIcon'
import GhostOrbIcon from './svgs/GhostOrbIcon'
import GhostWritingIcon from './svgs/GhostWritingIcon'
import MoonIcon from './svgs/MoonIcon'
import SpiritBoxIcon from './svgs/SpiritBoxIcon'
import { EVIDENCE, GHOST_TYPES } from './constants'

export default class App extends React.Component {
  constructor() {
    super()
    this.state = {
      activeEvidence: [],
      darkMode: false,
      lookupGhost: ''
    }

    this._addActiveEvidence = this._addActiveEvidence.bind(this)
    this._removeActiveEvidence = this._removeActiveEvidence.bind(this)
    this.evidenceIcon = {
      1: EMFIcon,
      2: FingerprintsIcon,
      3: FreezingTempsIcon,
      4: GhostOrbIcon,
      5: GhostWritingIcon,
      6: SpiritBoxIcon
    }
  }

  _removeActiveEvidence(evId) {
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

  _handleDarkModeClick() {
    this.setState({ darkMode: !this.state.darkMode })
  }

  _handleGhostButtonClick(ghost) {
    this.setState({ lookupGhost: ghost })
  }

  _handleEvidenceClick(evId) {
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
      const darkMode = this.state.darkMode ? 'dark' : 'light'
      const evidenceClasses = [
        'evidence__button',
        `evidence__button--${darkMode}`,
        isActiveEvidence ? `evidence__button--${darkMode}-active` : ''
      ].join(' ')

      let Icon = this.evidenceIcon[button.id]

      return (
        <button key={`evidence${button.id}`} className={evidenceClasses} type="button" disabled={isDisabled} onClick={ () => { this._handleEvidenceClick(button.id) }}>
          <Icon />
          <span className="screen-reader">{ button.name }</span>
        </button>
      )
    })
  }

  _renderPossibleGhosts() {
    const { activeEvidence } = this.state
    let possibleGhosts = GHOST_TYPES.sort((ghost1, ghost2) => ghost1.name.localeCompare(ghost2.name))
    const darkMode = this.state.darkMode ? 'dark' : 'light'

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
      return <div className="ghost">Something is wrong. Check your evidence again...</div>
    }

    return possibleGhosts.map( ghost => {
      const isActiveGhost = this.state.lookupGhost.id === ghost.id
      const ghostClasses = [
        'ghost__button',
        `ghost__button--${darkMode}`,
        isActiveGhost ? 'ghost__button--active' : ''
      ].join(' ')

      return (
        <button key={`ghosts${ghost.id}`} className={ ghostClasses } onClick={() => { this._handleGhostButtonClick(ghost) }}>
          { ghost.name }
        </button>
      )
    })
  }

  _renderGhostDetails() {
    const { lookupGhost } = this.state
    const darkMode = this.state.darkMode ? 'dark' : 'light'

    return (
      <div className={ `ghost-details__wrapper ghost-details__wrapper--${darkMode}` } onClick={ () => { this.setState({ lookupGhost: '' }) }}>
        <div className="ghost-details__close-button">x</div>
        <h2>{ lookupGhost.name }</h2>
        <ul>
        {
          lookupGhost.evidence.map( (evidenceId, i) => {
            const item = EVIDENCE.find( element => { return element.id === evidenceId })
            if (item) return <li key={`${lookupGhost.name}${evidenceId}`}>{item.name}</li>
            return null
          })
        }
        </ul>
        <div><h3>Weakness:</h3>{ lookupGhost.weakness }</div>
      </div>
    )
  }

  render() {
    const darkMode = this.state.darkMode ? 'dark' : 'light'

    return (
      <div className={ `App App--${darkMode}` }>
        <div className="journal__wrapper">
          <h2>Evidence</h2>
          <div className="evidence__wrapper">
            { this._renderEvidenceButtons() }
          </div>

          { this.state.lookupGhost && this._renderGhostDetails() }

          <h2>Possible Ghosts</h2>
          <div className="ghost__wrapper">
            { this._renderPossibleGhosts() }
          </div>
        </div>

        <footer className={ `footer--${darkMode}` }>
          <h1>Ghost Journal Companion App <span>Updated for Phasmophobia v0.29.6.1</span></h1>
          <a href="https://store.steampowered.com/app/739630/Phasmophobia/">Buy Phasmophobia</a>
          <a href="https://github.com/danWithABeard/phasmophobia-journal" title="Github">Github</a>

          <button className="button__dark-mode" type="button" onClick={() => { this._handleDarkModeClick() }}>
            <MoonIcon />
            <span className="screen-reader">Toggle Dark Mode</span>
          </button>
        </footer>
      </div>
    )
  }
}
