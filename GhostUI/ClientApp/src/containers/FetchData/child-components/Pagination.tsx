import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIconMemo } from '../../../components';

type PaginationProps = {
  readonly startDateIndex?: number;
};

const Pagination = React.memo<PaginationProps>(({ startDateIndex = 0 }) => (
  <p className='buttons is-pagination-group'>
    <Link className='button is-info' to={`/fetchdata/${startDateIndex - 5}`}>
      <FontAwesomeIconMemo icon='angle-double-left' size='2x' />
    </Link>
    <Link className='button is-info' to={`/fetchdata/${startDateIndex + 5}`}>
      <FontAwesomeIconMemo icon='angle-double-right' size='2x' />
    </Link>
  </p>
));

Pagination.displayName = 'Pagination';

export default Pagination;