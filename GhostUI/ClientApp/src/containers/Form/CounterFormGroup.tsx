import { actionCreators } from '../../store/form';
import { useDispatch, useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import type { RootState } from '../../store';
import type { FunctionComponent } from 'react';

const CounterFormGroup: FunctionComponent = () => {
  const dispatch = useDispatch();
  const count = useSelector<RootState, number>((state) => state.form.count);

  return (
    <div className='column'>
      <h3 className='title is-4'>Counter</h3>
      <h5 className='subtitle is-5'>Use buttons to update count value</h5>
      <p className='buttons incrementer-buttons form-control-group'>
        <button
          className='button is-light minus'
          onClick={() => dispatch(actionCreators.decrement())}
        >
          <FontAwesomeIcon icon='minus' />
        </button>
        <button
          className='button is-light plus'
          onClick={() => dispatch(actionCreators.increment())}
        >
          <FontAwesomeIcon icon='plus' />
        </button>
      </p>
      <p className='subtitle is-5'>
        Current count: <code>{count}</code>
      </p>
    </div>
  );
};

export default CounterFormGroup;
