import React from 'react';
import { connect } from 'react-redux';
import { arrayMove } from 'react-sortable-hoc';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSort, faTrashAlt } from '@fortawesome/free-solid-svg-icons'
import { makeGetCreatureSelector } from '../store/creatures/selectors';
import { actions as creatureActions } from  '../store/creatures';
import { actions as initiativeActions } from  '../store/initiative';
import SortableList from './reusable/SortableList';
import { DragHandle } from './reusable/SortableList';


class CreatureForm extends React.Component {
  constructor(props) {
    super(props);
    if (props.creature) {
      this.state = { ...props.creature }
    } else {
      this.state =  {
        name: '',
        counters: [
          { label: 'HP', value: 0 }
        ],
      }
    }
  }

  componentDidMount = () => {
    document.addEventListener('keydown', this.handleTabPress);
  }

  componentWillUnmount = () => {
    document.removeEventListener('keydown', this.handleTabPress);
  }


  addCounter = () => this.setState({
    counters: [ ...this.state.counters, { label: '', value: 0 } ]
  });

  removeCounter = (index) => () => this.setState({
    counters: this.state.counters.filter((_, i) => i !== index)
  });

  handleUpdateCreatureForm = event => {
    const inputType = event.target.name;
    const inputValue = event.target.value;
    if (inputType === 'counter') {
      const counterIndex = event.target.dataset.indexNumber;
      const counterKey = event.target.dataset.id;
      let counters = [ ...this.state.counters ];
      counters[counterIndex][counterKey] = inputValue;
      this.setState({ counters });
    } else {
      this.setState({ name: inputValue });
    }
  }

  handleSubmit = event => {
    event.preventDefault();
    const isExistingCreature = !!this.props.creature;
    isExistingCreature
      ? this.props.updateCreature(this.state)
      : this.props.createCreature(this.state);
    this.props.closeModal();
  }

  handleSortEnd = ({ oldIndex, newIndex }) => this.setState({
    counters: arrayMove(this.state.counters, oldIndex, newIndex)
  });

  handleTabPress = (event) => {
    const code = event.keyCode ? event.keyCode : event.which; // b/c browsers
    if (9 !== code) return; // We only care about tab presses
    const elem = document.activeElement;
    const lastIndex = this.state.counters.length - 1;
    if (
      "remove" === elem.dataset.id &&
      parseInt(elem.dataset.indexNumber) === lastIndex
    ) {
      this.addCounter();
    }
  }

  handleRemoveCreature = () => this.props.removeCreature(this.props.creatureId);

  render() {
    return (
      <form className="creature-form" onSubmit={this.handleSubmit}>
        <fieldset>
          <input
            type="text"
            id="name"
            name="name"
            value={this.state.name}
            onChange={this.handleUpdateCreatureForm}
            autoFocus
            className="creature-form__name"
          />
        </fieldset>
        <fieldset>
          <SortableList
            onSortEnd={this.handleSortEnd}
            useDragHandle
          >
          {this.state.counters.map((counter, index) =>
            <div key={index} className="creature-form__counter">
              <DragHandle><FontAwesomeIcon icon={faSort} /></DragHandle>
              <input
                type="text"
                name="counter"
                data-id="label"
                data-index-number={index}
                value={counter.label}
                onChange={this.handleUpdateCreatureForm}
                className="creature-form__counter-label"
                />
              <input
                type="text"
                name="counter"
                data-id="value"
                data-index-number={index}
                value={counter.value}
                onChange={this.handleUpdateCreatureForm}
                />
              <button
                type="button"
                data-id="remove"
                data-index-number={index}
                onClick={this.removeCounter(index)}
                >
                <FontAwesomeIcon icon={faTrashAlt} />
              </button>
            </div>
          )}
          </SortableList>
          <button type="button" onClick={this.addCounter}>Add Counter</button>
        </fieldset>
        <button type="button" onClick={this.handleRemoveCreature}>Delete Creature</button>
        <button type="submit">SUBMIT</button>
      </form>
    );
  }
}

const mapState = (state, ownProps) =>
  ownProps.creatureId
    ? ({ creature: makeGetCreatureSelector(ownProps.creatureId)(state) })
    : null;

const mapDispatch = {
  createCreature: creatureActions.createCreature,
  updateCreature: creatureActions.updateCreature,
  removeCreature: initiativeActions.removeCreature,
};

export default connect(mapState, mapDispatch)(CreatureForm);
