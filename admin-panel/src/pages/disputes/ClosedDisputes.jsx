import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { fetchDisputes } from '../../app/store/disputeSlice';
import { DisputeList } from './DisputeList';

export const ClosedDisputes = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchDisputes({ page: 1, status: 'closed' }));
  }, [dispatch]);

  return <DisputeList defaultStatus="closed" />;
};