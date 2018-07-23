import React from 'react';
import { connect } from 'react-redux';
import uuid from 'uuid/v4';

import Counter from '../components/Counter';
import CreateButton from './CreateButton';
import * as creatureActions from '../actions/creatures';

class InitiativeToken extends React.Component {

  handleCounterCreate = label => {
    this.props.createCounter(this.props.creature.id, label);
  };

  handleCounterUpdate = counter => {
    let creature = this.props.creature;
    creature.counters[counter.id].value = counter.value;
    this.props.creatureUpdate(creature);
  };

  handleCounterDelete = counterId => {
    let creature = this.props.creature;
    creature.counters.splice(counterId, 1);
    this.props.creatureUpdate(creature);
  };

  render () {
    const { creature } = this.props;
    return (
      <div className="initiative-token">
        <h2 className="initiative-token_title">{creature.name}</h2>
        <div className="initiative-token_left">
          {creature.counters.map((counter) =>
            <Counter
              key={counter.id}
              id={counter.id}
              label={counter.label}
              value={counter.value}
              onUpdateValue={this.handleCounterUpdate}
              onCounterDelete={this.handleCounterDelete}
            />
          )}
        </div>
        <div className="initiative-token_right">
          <CreateButton
            buttonLabel="New Counter"
            onSubmit={this.handleCounterCreate}
          />
          <CreateButton
            buttonLabel="Edit Creature"
            onSubmit={console.log('EDIT CREATURE')}
          />
          <CreateButton
           buttonLabel="Delete Creature"
           onSubmit={console.log('DELETE CREATURE')}
          />
        </div>
      </div>
    );
  }
}

const mapDispatchToProps = {
  creatureUpdate: creatureActions.creatureUpdate,
  creatureDelete: creatureActions.creatureDelete,
  createCounter: creatureActions.createCounter,
};

export default connect(null, mapDispatchToProps)(InitiativeToken);
